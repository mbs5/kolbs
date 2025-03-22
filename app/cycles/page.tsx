'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { format } from 'date-fns';

interface LearningCycle {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  skillId: string;
  skillName: string;
  isPublic: boolean;
}

// Mock data - would be replaced with actual data fetching
const mockCycles: LearningCycle[] = [
  { 
    id: '1', 
    title: 'Building a React Component',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-16'),
    completedAt: new Date('2024-03-16'),
    skillId: '1',
    skillName: 'JavaScript',
    isPublic: true
  },
  { 
    id: '2', 
    title: 'Conference Presentation',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-12'),
    completedAt: new Date('2024-03-12'),
    skillId: '2',
    skillName: 'Public Speaking',
    isPublic: false
  },
  { 
    id: '3', 
    title: 'Night Photography Session',
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-09'),
    completedAt: null,
    skillId: '3',
    skillName: 'Photography',
    isPublic: false
  },
];

export default function CyclesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [cycles] = useState(mockCycles);
  
  const filteredCycles = activeTab === 'all'
    ? cycles
    : activeTab === 'completed'
      ? cycles.filter(cycle => cycle.completedAt)
      : cycles.filter(cycle => !cycle.completedAt);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Learning Cycles</h1>
          <p className="text-muted-foreground">Track your progress through Kolb&apos;s Learning Cycle</p>
        </div>
        
        <Button asChild>
          <Link href="/cycles/new">Start New Cycle</Link>
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Cycles</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCycles.map(cycle => (
              <CycleCard key={cycle.id} cycle={cycle} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCycles.map(cycle => (
              <CycleCard key={cycle.id} cycle={cycle} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCycles.map(cycle => (
              <CycleCard key={cycle.id} cycle={cycle} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CycleCard({ cycle }: { cycle: LearningCycle }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{cycle.title}</CardTitle>
          {cycle.isPublic ? (
            <Badge>Public</Badge>
          ) : (
            <Badge variant="outline">Private</Badge>
          )}
        </div>
        <CardDescription>
          {cycle.skillName} • Created {format(cycle.createdAt, 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant={cycle.completedAt ? "default" : "secondary"}>
            {cycle.completedAt ? "Completed" : "In Progress"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/cycles/${cycle.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 