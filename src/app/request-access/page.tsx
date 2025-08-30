"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RequestAccessPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organizationName: "",
    league: "",
    role: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call for now
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-title-large text-primary">
              Request Submitted
            </CardTitle>
            <CardDescription>
              Thank you for your interest in Athletic Labs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-body-large">
              We&apos;ve received your access request and will review it within 24-48 hours. 
              Our team will contact you at <strong>{formData.email}</strong> with next steps.
            </p>
            <Button asChild className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-headline-large text-primary mb-2">
            Athletic Labs
          </h1>
          <p className="text-body-large text-muted-foreground">
            Request platform access for your professional sports team
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-title-large">Request Team Access</CardTitle>
            <CardDescription>
              Complete this form to request access to Athletic Labs&apos; nutrition platform. 
              We&apos;ll review your application and contact you within 24-48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nutrition@yourteam.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Team/Organization Name</Label>
                  <Input
                    id="organizationName"
                    placeholder="Los Angeles Lakers"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange("organizationName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="league">League</Label>
                  <Select onValueChange={(value) => handleInputChange("league", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select league" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nfl">NFL</SelectItem>
                      <SelectItem value="nba">NBA</SelectItem>
                      <SelectItem value="mlb">MLB</SelectItem>
                      <SelectItem value="nhl">NHL</SelectItem>
                      <SelectItem value="mls">MLS</SelectItem>
                      <SelectItem value="college">College Sports</SelectItem>
                      <SelectItem value="other">Other Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Select onValueChange={(value) => handleInputChange("role", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nutritionist">Team Nutritionist</SelectItem>
                    <SelectItem value="chef">Team Chef</SelectItem>
                    <SelectItem value="manager">Team Manager</SelectItem>
                    <SelectItem value="coordinator">Nutrition Coordinator</SelectItem>
                    <SelectItem value="director">Director of Player Development</SelectItem>
                    <SelectItem value="other">Other Team Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your team&apos;s nutrition needs, current catering situation, or any specific requirements..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                size="lg"
              >
                {loading ? "Submitting Request..." : "Submit Access Request"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/login">Sign In to Your Account</Link>
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Link 
                href="/" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}