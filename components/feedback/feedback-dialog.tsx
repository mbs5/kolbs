'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rating } from "@/components/feedback/rating";
import { Loader2 } from "lucide-react";

interface FeedbackSection {
  rating: number;
  feedback: string;
}

interface FeedbackData {
  concreteExperience: FeedbackSection;
  reflectiveObservation: FeedbackSection;
  abstractConceptualization: FeedbackSection;
  activeExperimentation: FeedbackSection;
  overallFeedback: string;
}

interface FeedbackDialogProps {
  cycleData: {
    id: string;
    title: string;
    concreteExperience: string;
    reflectiveObservation: string;
    abstractConceptualization: string;
    activeExperimentation: string;
  };
}

export function FeedbackDialog({ cycleData }: FeedbackDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: cycleData.title,
          concreteExperience: cycleData.concreteExperience,
          reflectiveObservation: cycleData.reflectiveObservation,
          abstractConceptualization: cycleData.abstractConceptualization,
          activeExperimentation: cycleData.activeExperimentation,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get feedback');
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (err) {
      setError('Error getting AI feedback. Please try again later.');
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && !feedback && !loading) {
      fetchFeedback();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Get AI Feedback</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Feedback: {cycleData.title}</DialogTitle>
          <DialogDescription>
            Analysis of your learning cycle based on Kolb&apos;s Experiential Learning Theory
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Analyzing your learning cycle...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800">
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={fetchFeedback}
            >
              Try Again
            </Button>
          </div>
        ) : feedback ? (
          <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-md">
              <h3 className="font-medium text-lg mb-2">Overall Feedback</h3>
              <p>{feedback.overallFeedback}</p>
            </div>

            <Tabs defaultValue="concreteExperience">
              <TabsList className="grid grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="concreteExperience">Experience</TabsTrigger>
                <TabsTrigger value="reflectiveObservation">Reflection</TabsTrigger>
                <TabsTrigger value="abstractConceptualization">Conceptualization</TabsTrigger>
                <TabsTrigger value="activeExperimentation">Experimentation</TabsTrigger>
              </TabsList>
              
              <FeedbackTab
                value="concreteExperience"
                title="Concrete Experience"
                description="Your hands-on experience"
                feedback={feedback.concreteExperience}
              />
              
              <FeedbackTab
                value="reflectiveObservation"
                title="Reflective Observation"
                description="Your reflections and observations"
                feedback={feedback.reflectiveObservation}
              />
              
              <FeedbackTab
                value="abstractConceptualization"
                title="Abstract Conceptualization"
                description="Your theories and conclusions"
                feedback={feedback.abstractConceptualization}
              />
              
              <FeedbackTab
                value="activeExperimentation"
                title="Active Experimentation"
                description="Your plan to apply insights"
                feedback={feedback.activeExperimentation}
              />
            </Tabs>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface FeedbackTabProps {
  value: string;
  title: string;
  description: string;
  feedback: FeedbackSection;
}

function FeedbackTab({ value, title, description, feedback }: FeedbackTabProps) {
  return (
    <TabsContent value={value} className="mt-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{title}</CardTitle>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>
            <Rating value={feedback.rating} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-medium">Feedback:</h4>
            <p>{feedback.feedback}</p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
} 