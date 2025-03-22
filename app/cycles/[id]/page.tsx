'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { FeedbackDialog } from '@/components/feedback/feedback-dialog';

// Mock data - would be replaced with actual data fetching
const mockCycle = {
  id: '1',
  title: 'Building a React Component',
  createdAt: new Date('2024-03-15'),
  updatedAt: new Date('2024-03-16'),
  completedAt: new Date('2024-03-16'),
  concreteExperience: 'I worked on creating a reusable dropdown component for our application. The component needed to handle multiple selection, custom styling, and integration with a form library. I focused on making it accessible and responsive.',
  reflectiveObservation: 'While building this component, I observed that I spent most of my time handling edge cases and accessibility concerns rather than the core functionality. The keyboard navigation was particularly challenging. I also noticed that I had to refactor my code several times as I discovered new requirements.',
  abstractConceptualization: 'I\'ve learned that planning for accessibility from the start is much more efficient than adding it later. I\'ve also realized the importance of understanding all requirements before starting implementation. Component composition in React makes it easier to manage complex UI elements when structured properly.',
  activeExperimentation: 'For my next component, I\'ll start by creating a detailed list of all requirements, including edge cases and accessibility needs. I\'ll create a simple prototype to validate the approach before implementing the full component. I\'ll also use a more structured approach to testing each aspect of the component.',
  skill: {
    id: '1',
    name: 'React',
  },
  feedback: null,
};

// Mock comments
const mockComments = [
  {
    id: '1',
    content: 'Great insights on accessibility! Have you considered using the React Aria library for this?',
    createdAt: new Date('2024-03-16'),
    user: {
      id: '2',
      name: 'Jane Smith',
      image: null,
    },
  },
  {
    id: '2',
    content: 'I faced similar challenges when building form components. Testing with actual keyboard users made a huge difference.',
    createdAt: new Date('2024-03-17'),
    user: {
      id: '3',
      name: 'Alex Johnson',
      image: null,
    },
  },
];

export default function CycleDetailsPage() {
  const params = useParams();
  const cycleId = typeof params?.id === 'string' ? params.id : '';
  
  const [cycle, setCycle] = useState(mockCycle);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedCycle, setEditedCycle] = useState({
    concreteExperience: '',
    reflectiveObservation: '',
    abstractConceptualization: '',
    activeExperimentation: '',
  });

  useEffect(() => {
    // Fetch the learning cycle data
    // In a real app, you would fetch data based on the ID
    console.log(`Fetching cycle with ID: ${cycleId}`);
    
    // Initialize edit form with current values
    setEditedCycle({
      concreteExperience: mockCycle.concreteExperience,
      reflectiveObservation: mockCycle.reflectiveObservation,
      abstractConceptualization: mockCycle.abstractConceptualization,
      activeExperimentation: mockCycle.activeExperimentation,
    });
  }, [cycleId]);

  const handleSaveEdit = () => {
    // In a real app, send a request to update the cycle
    setCycle({
      ...cycle,
      ...editedCycle,
    });
    setIsEditMode(false);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    // In a real app, send a request to create a new comment
    const newCommentObj = {
      id: `${comments.length + 1}`,
      content: newComment,
      createdAt: new Date(),
      user: {
        id: '1', // Current user ID
        name: 'Current User', // Current user name
        image: null,
      },
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{cycle.title}</h1>
          <div className="text-muted-foreground mt-1">
            {cycle.skill?.name && (
              <span className="mr-4">Skill: {cycle.skill.name}</span>
            )}
            <span className="mr-4">Created: {format(cycle.createdAt, 'MMM d, yyyy')}</span>
            {cycle.completedAt && (
              <span>Completed: {format(cycle.completedAt, 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isEditMode ? (
            <>
              <Button variant="outline" onClick={() => setIsEditMode(true)}>
                Edit
              </Button>
              <Button 
                variant={cycle.feedback ? "outline" : "default"}
              >
                {cycle.feedback ? "View Feedback" : "Get AI Feedback"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Concrete Experience</CardTitle>
            <CardDescription>What happened? What did you do?</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <Textarea 
                value={editedCycle.concreteExperience}
                onChange={(e) => setEditedCycle({...editedCycle, concreteExperience: e.target.value})}
                className="min-h-[200px]"
              />
            ) : (
              <p>{cycle.concreteExperience}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reflective Observation</CardTitle>
            <CardDescription>What did you notice? What insights emerged?</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <Textarea 
                value={editedCycle.reflectiveObservation}
                onChange={(e) => setEditedCycle({...editedCycle, reflectiveObservation: e.target.value})}
                className="min-h-[200px]"
              />
            ) : (
              <p>{cycle.reflectiveObservation}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Abstract Conceptualization</CardTitle>
            <CardDescription>What patterns or conclusions did you draw?</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <Textarea 
                value={editedCycle.abstractConceptualization}
                onChange={(e) => setEditedCycle({...editedCycle, abstractConceptualization: e.target.value})}
                className="min-h-[200px]"
              />
            ) : (
              <p>{cycle.abstractConceptualization}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Experimentation</CardTitle>
            <CardDescription>How will you apply these insights?</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <Textarea 
                value={editedCycle.activeExperimentation}
                onChange={(e) => setEditedCycle({...editedCycle, activeExperimentation: e.target.value})}
                className="min-h-[200px]"
              />
            ) : (
              <p>{cycle.activeExperimentation}</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Feedback Dialog */}
      {!isEditMode && (
        <FeedbackDialog 
          cycleData={{
            id: cycle.id,
            title: cycle.title,
            concreteExperience: cycle.concreteExperience,
            reflectiveObservation: cycle.reflectiveObservation,
            abstractConceptualization: cycle.abstractConceptualization,
            activeExperimentation: cycle.activeExperimentation
          }}
        />
      )}
      
      {/* Comments Section */}
      {!isEditMode && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Discussion</h2>
          
          <div className="space-y-4 mb-6">
            {comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{comment.user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(comment.createdAt, 'MMM d, yyyy')}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Add a Comment</h3>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts or questions..."
              className="mb-3"
            />
            <Button onClick={handleCommentSubmit}>Post Comment</Button>
          </div>
        </div>
      )}
    </div>
  );
} 