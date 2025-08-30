"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Team {
  id: string;
  name: string;
  league: string;
  city: string;
  nutrition_profile: {
    protein: number;
    carbs: number;
    fats: number;
  };
  roster_size: number;
  budget_limit: number | null;
  created_at: string;
}

interface TeamStats {
  team_id: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string | null;
}

export default function AdminTeamsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamStats, setTeamStats] = useState<Record<string, TeamStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    if (!isAdmin) {
      router.push("/dashboard");
      return;
    }

    fetchTeams();
    fetchTeamStats();
  }, [user, authLoading, router, isAdmin]);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (error) {
        setError(error.message);
        return;
      }

      setTeams(data || []);
    } catch {
      setError("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamStats = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('team_id, total_amount, created_at')
        .eq('status', 'delivered');

      if (error) {
        console.error("Failed to load team stats:", error);
        return;
      }

      const stats = (data || []).reduce((acc, order) => {
        const teamId = order.team_id;
        if (!acc[teamId]) {
          acc[teamId] = {
            team_id: teamId,
            total_orders: 0,
            total_spent: 0,
            last_order_date: null
          };
        }
        
        acc[teamId].total_orders += 1;
        acc[teamId].total_spent += order.total_amount;
        
        if (!acc[teamId].last_order_date || order.created_at > acc[teamId].last_order_date) {
          acc[teamId].last_order_date = order.created_at;
        }
        
        return acc;
      }, {} as Record<string, TeamStats>);

      setTeamStats(stats);
    } catch (err) {
      console.error("Failed to load team stats:", err);
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.league.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-title-large text-primary">Team Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage teams and their configurations
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/teams/new">Add New Team</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-headline-large">All Teams ({teams.length})</h2>
          </div>
          
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search teams, leagues, or cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const stats = teamStats[team.id];
            
            return (
              <Card key={team.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription>
                        {team.city} • {team.league}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {team.roster_size} players
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-muted rounded">
                      <p className="font-bold">{team.nutrition_profile.protein}%</p>
                      <p className="text-muted-foreground">Protein</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="font-bold">{team.nutrition_profile.carbs}%</p>
                      <p className="text-muted-foreground">Carbs</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="font-bold">{team.nutrition_profile.fats}%</p>
                      <p className="text-muted-foreground">Fats</p>
                    </div>
                  </div>

                  {stats && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Orders:</span>
                        <span className="font-medium">{stats.total_orders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Spent:</span>
                        <span className="font-medium text-primary">
                          ${stats.total_spent.toFixed(2)}
                        </span>
                      </div>
                      {stats.last_order_date && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Order:</span>
                          <span className="font-medium">
                            {new Date(stats.last_order_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {team.budget_limit && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Budget Limit: </span>
                      <span className="font-medium">${team.budget_limit.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/admin/teams/${team.id}`}>View Details</Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/admin/teams/${team.id}/edit`}>Edit Team</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTeams.length === 0 && teams.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No teams found matching &quot;{searchTerm}&quot;
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </Button>
          </div>
        )}

        {teams.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No teams found. Add your first team to get started.
            </p>
            <Button asChild>
              <Link href="/admin/teams/new">Add New Team</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}