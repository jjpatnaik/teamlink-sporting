
import React from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedTournaments, FeaturedTournament } from '@/hooks/useFeaturedTournaments';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

const FeaturedTournaments = () => {
  const { tournaments, loading } = useFeaturedTournaments(3);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Tournaments</h2>
            <p className="text-gray-600">Loading featured tournaments...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Tournaments</h2>
          <p className="text-gray-600">Discover upcoming events and join the competition</p>
        </div>

        {tournaments.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No tournaments found. Check back soon!</p>
            <Button className="mt-4" asChild>
              <Link to="/create-tournament">Create a Tournament</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.map((tournament: FeaturedTournament) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="h-48 overflow-hidden bg-sport-soft-blue">
                  <img
                    src={tournament.image}
                    alt={tournament.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="px-2 py-1 bg-sport-purple/10 text-sport-purple rounded text-sm font-semibold">
                      {tournament.sport}
                    </div>
                  </div>
                  <CardTitle className="mt-2">{tournament.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tournament.location || "Location TBA"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2">
                  {tournament.start_date && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {format(new Date(tournament.start_date), "MMMM d, yyyy")}
                        {tournament.end_date && ` - ${format(new Date(tournament.end_date), "MMMM d, yyyy")}`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{tournament.teams_allowed} teams allowed</span>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to={`/tournaments/${tournament.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button variant="outline" asChild>
            <Link to="/tournaments">View All Tournaments</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTournaments;
