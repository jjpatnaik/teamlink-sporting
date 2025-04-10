
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BriefcaseIcon, MapPinIcon, CalendarIcon, CheckCircleIcon, TrophyIcon, UsersIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SponsorProfile = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="h-48 bg-gradient-to-r from-sport-purple to-sport-blue relative">
              <Button variant="outline" className="absolute top-4 right-4 bg-white/90 hover:bg-white">
                Edit Profile
              </Button>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 pb-6 -mt-16">
              <div className="flex flex-col sm:flex-row sm:items-end">
                <Avatar className="h-32 w-32 rounded-full border-4 border-white shadow-md">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Nike Sports" />
                </Avatar>
                <div className="mt-4 sm:mt-0 sm:ml-4">
                  <h1 className="text-3xl font-bold">Nike Sports</h1>
                  <p className="text-lg text-sport-gray">Global Sports Apparel & Equipment</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="bg-sport-purple">Equipment</Badge>
                    <Badge className="bg-sport-blue">Apparel</Badge>
                    <Badge className="bg-sport-purple">Footwear</Badge>
                    <Badge className="bg-sport-blue">Event Sponsorship</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="about" className="mb-8">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="sponsored">Sponsored</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>About Nike Sports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sport-gray mb-4">
                        Nike, Inc. is an American multinational corporation that is engaged in the design, development, manufacturing, and worldwide marketing and sales of footwear, apparel, equipment, accessories, and services.
                      </p>
                      <p className="text-sport-gray mb-4">
                        We're committed to supporting athletes at all levels, from grassroots to professional. Our sponsorship programs aim to provide athletes with the best equipment and apparel to help them perform at their best.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center gap-2">
                          <BriefcaseIcon className="text-sport-purple" />
                          <span>Sports Equipment & Apparel</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="text-sport-purple" />
                          <span>Beaverton, Oregon, USA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="text-sport-purple" />
                          <span>Founded in 1964</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UsersIcon className="text-sport-purple" />
                          <span>75,000+ employees worldwide</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Sponsorship Focus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                          <h3 className="font-semibold text-lg mb-2">Sports Categories</h3>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-sport-purple" />
                              <span>Football/Soccer</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-sport-purple" />
                              <span>Basketball</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-sport-purple" />
                              <span>Running</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-sport-purple" />
                              <span>Tennis</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-sport-purple" />
                              <span>Cricket</span>
                            </li>
                          </ul>
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-semibold text-lg mb-2">Sponsorship Types</h3>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <TrophyIcon className="h-5 w-5 text-sport-blue" />
                              <span>Professional Athletes</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <TrophyIcon className="h-5 w-5 text-sport-blue" />
                              <span>National Teams</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <TrophyIcon className="h-5 w-5 text-sport-blue" />
                              <span>League Competitions</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <TrophyIcon className="h-5 w-5 text-sport-blue" />
                              <span>Youth Development</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <TrophyIcon className="h-5 w-5 text-sport-blue" />
                              <span>Event Sponsorships</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold">Main Office</h3>
                          <p className="text-sport-gray">
                            One Bowerman Drive<br />
                            Beaverton, OR 97005<br />
                            United States
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Sponsorship Inquiries</h3>
                          <p className="text-sport-gray">
                            Email: sponsorships@nike.com<br />
                            Phone: +1 (503) 671-6453
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Web Presence</h3>
                          <p className="text-sport-gray">
                            Website: www.nike.com<br />
                            Social: @nikesports
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-sport-purple">Contact for Sponsorship</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Budget Range</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Individual Athletes</span>
                          <span className="font-semibold">$50K - $10M+</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Teams</span>
                          <span className="font-semibold">$500K - $50M+</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tournaments</span>
                          <span className="font-semibold">$250K - $5M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Youth Programs</span>
                          <span className="font-semibold">$25K - $500K</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sponsored">
              <h2 className="text-2xl font-bold mb-6">Current Sponsorships</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sponsored content would go here */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle>Manchester United</CardTitle>
                      <Badge>Team</Badge>
                    </div>
                    <CardDescription>Premier League Football Club</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <img src="https://images.unsplash.com/photo-1564914138563-0c50eaca135b?auto=format&fit=crop&q=80" alt="Manchester United" />
                      </Avatar>
                      <div>
                        <p className="font-semibold">Kit Sponsor</p>
                        <p className="text-sm text-sport-gray">Since 2002</p>
                      </div>
                    </div>
                    <p className="text-sm text-sport-gray">Full kit and training wear supplier for one of the world's most popular football clubs.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle>Serena Williams</CardTitle>
                      <Badge>Athlete</Badge>
                    </div>
                    <CardDescription>Professional Tennis Player</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <img src="https://images.unsplash.com/photo-1612452826316-41725f420e44?auto=format&fit=crop&q=80" alt="Serena Williams" />
                      </Avatar>
                      <div>
                        <p className="font-semibold">Lifetime Deal</p>
                        <p className="text-sm text-sport-gray">Since 2003</p>
                      </div>
                    </div>
                    <p className="text-sm text-sport-gray">Exclusive apparel and footwear sponsorship with signature product lines.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle>World Athletics Championships</CardTitle>
                      <Badge>Tournament</Badge>
                    </div>
                    <CardDescription>Global Athletics Competition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar>
                        <img src="https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80" alt="World Athletics" />
                      </Avatar>
                      <div>
                        <p className="font-semibold">Official Supplier</p>
                        <p className="text-sm text-sport-gray">Since 2009</p>
                      </div>
                    </div>
                    <p className="text-sm text-sport-gray">Official apparel and equipment supplier for athletes and officials.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="events">
              <h2 className="text-2xl font-bold mb-6">Sponsored Events</h2>
              {/* Events content would go here */}
              <p className="text-sport-gray">Events tab content...</p>
            </TabsContent>
            
            <TabsContent value="connections">
              <h2 className="text-2xl font-bold mb-6">Network Connections</h2>
              {/* Connections content would go here */}
              <p className="text-sport-gray">Connections tab content...</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SponsorProfile;
