
import React from 'react';
import { Trophy } from "lucide-react";

const TournamentsEmptyState = () => {
  return (
    <div className="text-center py-12">
      <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">No tournaments yet</h3>
      <p className="text-gray-600 mb-6">You haven't created any tournaments. Get started by creating your first tournament!</p>
    </div>
  );
};

export default TournamentsEmptyState;
