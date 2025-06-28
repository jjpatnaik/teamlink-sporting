
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendInvitationRequest {
  receiverEmail: string;
  message?: string;
}

interface UpdateInvitationRequest {
  action: 'accept' | 'reject';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    
    // POST /teams/{teamId}/members - Send invitation
    if (req.method === 'POST' && pathParts.includes('members')) {
      const teamId = pathParts[pathParts.indexOf('teams') + 1];
      const { receiverEmail, message }: SendInvitationRequest = await req.json();

      console.log('Sending invitation:', { teamId, receiverEmail, senderId: user.id });

      // Validate team ownership/captain permissions
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData || !['owner', 'captain'].includes(memberData.role)) {
        console.error('Permission error:', memberError);
        return new Response(
          JSON.stringify({ error: 'Insufficient permissions. Only team owners and captains can send invitations.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if user exists by email - search in profiles by display_name (since we don't have email field)
      const { data: receiverData, error: receiverError } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .ilike('display_name', `%${receiverEmail}%`)
        .single();

      if (receiverError || !receiverData) {
        console.error('Receiver not found:', receiverError);
        return new Response(
          JSON.stringify({ error: 'User not found with that email/name' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if invitation already exists
      const { data: existingInvitation, error: existingError } = await supabase
        .from('team_invitations')
        .select('id, status')
        .eq('team_id', teamId)
        .eq('receiver_id', receiverData.user_id)
        .eq('status', 'pending')
        .maybeSingle();

      if (existingInvitation) {
        return new Response(
          JSON.stringify({ error: 'Invitation already sent to this user' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create invitation record
      const { data: invitationData, error: invitationError } = await supabase
        .from('team_invitations')
        .insert({
          team_id: teamId,
          sender_id: user.id,
          receiver_id: receiverData.user_id,
          message: message || null,
          status: 'pending'
        })
        .select()
        .single();

      if (invitationError) {
        console.error('Error creating invitation:', invitationError);
        return new Response(
          JSON.stringify({ error: 'Failed to send invitation' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Invitation created successfully:', invitationData);

      return new Response(
        JSON.stringify({ 
          success: true, 
          invitation: invitationData,
          message: 'Invitation sent successfully'
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // PATCH /teams/{teamId}/requests/{reqId} - Accept/reject invitation
    if (req.method === 'PATCH' && pathParts.includes('requests')) {
      const teamId = pathParts[pathParts.indexOf('teams') + 1];
      const invitationId = pathParts[pathParts.indexOf('requests') + 1];
      const { action }: UpdateInvitationRequest = await req.json();

      console.log('Processing invitation:', { teamId, invitationId, action, userId: user.id });

      if (!['accept', 'reject'].includes(action)) {
        return new Response(
          JSON.stringify({ error: 'Invalid action. Must be "accept" or "reject"' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate invitation exists and belongs to current user
      const { data: invitationData, error: invitationError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('id', invitationId)
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .single();

      if (invitationError || !invitationData) {
        console.error('Invitation not found:', invitationError);
        return new Response(
          JSON.stringify({ error: 'Invitation not found or already processed' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update invitation status
      const { data: updatedInvitation, error: updateError } = await supabase
        .from('team_invitations')
        .update({
          status: action === 'accept' ? 'accepted' : 'rejected',
          processed_at: new Date().toISOString()
        })
        .eq('id', invitationId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating invitation:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to process invitation' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If accepted, add record to team_members table
      if (action === 'accept') {
        const { error: memberError } = await supabase
          .from('team_members')
          .insert({
            team_id: teamId,
            user_id: user.id,
            role: 'member'
          });

        if (memberError) {
          console.error('Error adding team member:', memberError);
          // Rollback invitation status
          await supabase
            .from('team_invitations')
            .update({ status: 'pending', processed_at: null })
            .eq('id', invitationId);

          return new Response(
            JSON.stringify({ error: 'Failed to join team' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      console.log('Invitation processed successfully:', updatedInvitation);

      return new Response(
        JSON.stringify({ 
          success: true,
          invitation: updatedInvitation,
          message: `Invitation ${action}ed successfully`
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Method not allowed
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
