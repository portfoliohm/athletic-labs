"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface SupportFormData {
  topic: string;
  priority: string;
  subject: string;
  message: string;
}

export default function SupportPage() {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<SupportFormData>({
    topic: "",
    priority: "medium",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTopic = searchParams.get('topic');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    // Set preselected topic if available
    if (preselectedTopic) {
      setFormData(prev => ({ ...prev, topic: preselectedTopic }));
    }
  }, [user, authLoading, router, preselectedTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call for now
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSubmitted(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-title-large text-primary">Support Request Submitted</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-title-large text-primary">
                Thank You for Contacting Us
              </CardTitle>
              <CardDescription>
                Your support request has been received
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-body-large">
                We&apos;ve received your support request and will respond within 24 hours during business hours. 
                You&apos;ll receive updates at <strong>{user.email}</strong>.
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/support">Submit Another Request</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-title-large text-primary">Support Center</h1>
            <p className="text-sm text-muted-foreground">
              Get help with Athletic Labs platform
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard">← Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-title-large">Contact Support</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <Select 
                        value={formData.topic} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="orders">Order Support</SelectItem>
                          <SelectItem value="menu-templates">Menu Templates</SelectItem>
                          <SelectItem value="custom-templates">Custom Template Request</SelectItem>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="account">Account & Profile</SelectItem>
                          <SelectItem value="password">Password Reset</SelectItem>
                          <SelectItem value="access">Team Access & Permissions</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={formData.priority} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General inquiry</SelectItem>
                          <SelectItem value="medium">Medium - Standard request</SelectItem>
                          <SelectItem value="high">High - Urgent issue</SelectItem>
                          <SelectItem value="critical">Critical - Service disruption</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your request"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide detailed information about your request or issue..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Support Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Support Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-medium">Monday - Friday</p>
                  <p className="text-sm text-muted-foreground">8:00 AM - 6:00 PM PST</p>
                </div>
                <div>
                  <p className="font-medium">Saturday</p>
                  <p className="text-sm text-muted-foreground">10:00 AM - 4:00 PM PST</p>
                </div>
                <div>
                  <p className="font-medium">Sunday</p>
                  <p className="text-sm text-muted-foreground">Closed</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  For urgent delivery issues on game days:
                </p>
                <p className="font-medium">1-800-ATHLETIC</p>
                <p className="text-sm text-muted-foreground">
                  Available 24/7 during active seasons
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" size="sm" className="w-full justify-start">
                  <Link href="/help">Browse Help Articles</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full justify-start">
                  <Link href="/training">Platform Training</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full justify-start">
                  <Link href="/help/faq">Frequently Asked Questions</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name: </span>
                  <span>{user.profile?.first_name} {user.profile?.last_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  <span>{user.profile?.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Role: </span>
                  <span>{user.profile?.role === 'admin' ? 'Administrator' : 'Team Staff'}</span>
                </div>
                {user.profile?.team_id && (
                  <div>
                    <span className="text-muted-foreground">Team ID: </span>
                    <span>{user.profile.team_id}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}