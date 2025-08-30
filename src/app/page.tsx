import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-display-large text-primary mb-6">
            Athletic Labs
          </h1>
          <p className="text-headline-large text-muted-foreground mb-8">
            Professional Sports Nutrition Platform
          </p>
          <p className="text-body-large text-foreground max-w-2xl mx-auto mb-12">
            Premium meal catering platform designed for professional sports teams. 
            Streamlined nutritional planning and meal ordering with team-specific scheduling integration.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/login">Team Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8">
              <Link href="/request-access">Request Access</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-title-large text-primary">
                Precision Nutrition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-body-large">
                Customized meal templates designed for professional athletes with precise macronutrient profiles
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-title-large text-primary">
                Schedule Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-body-large">
                Seamless coordination with team calendars and game schedules for optimal meal timing
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-title-large text-primary">
                Professional Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-body-large">
                Enterprise-level platform built specifically for the unique needs of professional sports organizations
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
