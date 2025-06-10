
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";

interface TournamentCardActionsProps {
  onCancelTournament: () => void;
}

const TournamentCardActions = ({ onCancelTournament }: TournamentCardActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600"
          onClick={onCancelTournament}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Cancel Tournament
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TournamentCardActions;
