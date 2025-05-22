
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageSquare, Edit, Trash2 } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const updateSchema = z.object({
  content: z.string().min(5, "Update content should be at least 5 characters"),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

// Mock data for previous updates
const initialUpdates = [
  {
    id: "1",
    content: "Due to expected rain, all outdoor matches scheduled for tomorrow will be moved to the indoor courts.",
    timestamp: "2025-06-10T15:30:00Z",
  },
  {
    id: "2",
    content: "Registration deadline has been extended by 48 hours. Teams now have until Wednesday to complete their registration.",
    timestamp: "2025-06-08T12:15:00Z",
  },
];

const UpdatesPanel = () => {
  const [updates, setUpdates] = useState(initialUpdates);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: UpdateFormValues) => {
    if (editingId) {
      // Update existing update
      setUpdates(updates.map(update => 
        update.id === editingId 
          ? { ...update, content: data.content } 
          : update
      ));
      
      toast({
        title: "Update Edited",
        description: "Your update has been edited successfully",
      });
      
      setEditingId(null);
    } else {
      // Add new update
      const newUpdate = {
        id: Date.now().toString(),
        content: data.content,
        timestamp: new Date().toISOString(),
      };
      
      setUpdates([newUpdate, ...updates]);
      
      toast({
        title: "Update Posted",
        description: "Your update has been posted successfully",
      });
    }
    
    form.reset();
  };

  const handleEdit = (id: string) => {
    const updateToEdit = updates.find(update => update.id === id);
    if (updateToEdit) {
      form.setValue("content", updateToEdit.content);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setUpdates(updates.filter(update => update.id !== id));
    
    toast({
      title: "Update Deleted",
      description: "The update has been deleted successfully",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Tournament Updates</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post an Update</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea 
                      placeholder="Share an important update, announcement, or schedule change..." 
                      className="min-h-[120px] pl-12" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-sport-purple hover:bg-sport-dark-purple"
            >
              {editingId ? "Save Edit" : "Post Update"}
            </Button>
          </div>
        </form>
      </Form>
      
      {editingId && (
        <div className="mt-4 mb-6 bg-yellow-50 p-3 rounded-md border border-yellow-200">
          <p className="text-sm text-yellow-700 flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            You are editing an update. Submit to save changes or click another edit button to discard.
          </p>
        </div>
      )}
      
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium">Previous Updates</h3>
        
        {updates.length > 0 ? (
          updates.map((update) => (
            <Card key={update.id} className="bg-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-gray-500 mb-2">
                    {formatDate(update.timestamp)}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(update.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4 text-sport-blue" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(update.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-800">{update.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No updates yet</p>
        )}
      </div>
    </div>
  );
};

export default UpdatesPanel;
