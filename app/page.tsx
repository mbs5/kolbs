'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle, Lightbulb, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

// Define features for the landing page
const features = [
  {
    title: "Track Learning Cycles",
    description: "Document your concrete experiences, reflections, conceptualizations, and experiments.",
    icon: <RefreshCw className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Develop Insights",
    description: "Transform experiences into insights by following the complete learning cycle.",
    icon: <Lightbulb className="h-10 w-10 text-yellow-500" />,
  },
  {
    title: "Build Knowledge Base",
    description: "Create a personal knowledge base of your learning and insights over time.",
    icon: <BookOpen className="h-10 w-10 text-green-500" />,
  },
  {
    title: "Build Learning Habits",
    description: "Develop a consistent practice of reflection and experimentation in your learning.",
    icon: <CheckCircle className="h-10 w-10 text-blue-500" />,
  },
];

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const isDevelopmentMode = process.env.NODE_ENV === 'development';
  
  // Redirect to dashboard if signed in
  useEffect(() => {
    if (isLoaded && (isSignedIn || isDevelopmentMode)) {
      router.push('/dashboard');
    }
  }, [isSignedIn, isLoaded, router, isDevelopmentMode]);
  
  // If still loading or checking auth, don't render anything yet
  if (!isLoaded || isSignedIn || isDevelopmentMode) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Master your learning with Kolb&apos;s Learning Cycle
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Track your experiences, reflections, and experiments to maximize your personal and professional development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" passHref>
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/sign-in" passHref>
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/images/kolb-cycle.png" 
                alt="Kolb's Learning Cycle" 
                className="w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x400?text=Kolbs+Learning+Cycle';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why use Kolb&apos;s Learning Cycle?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            The Kolb Learning Cycle helps you transform experiences into knowledge through a four-stage process.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">1. Concrete Experience</h3>
              <p className="text-gray-600">Document specific experiences and actions you&apos;ve taken.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-2 text-purple-600">2. Reflective Observation</h3>
              <p className="text-gray-600">Review and reflect on your experience from different perspectives.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-2 text-green-600">3. Abstract Conceptualization</h3>
              <p className="text-gray-600">Draw conclusions and form concepts from your reflections.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-2 text-orange-600">4. Active Experimentation</h3>
              <p className="text-gray-600">Plan how to test your concepts in new situations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-4 md:px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to accelerate your learning?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join today and start transforming your experiences into structured knowledge.
          </p>
          <Link href="/sign-up" passHref>
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2"
            >
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
