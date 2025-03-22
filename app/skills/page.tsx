'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock data - would be replaced with actual data fetching
const mockSkills = [
  { id: '1', name: 'JavaScript', description: 'Modern JavaScript programming', cyclesCount: 8 },
  { id: '2', name: 'Public Speaking', description: 'Effective communication and presentation', cyclesCount: 5 },
  { id: '3', name: 'Photography', description: 'Digital photography techniques', cyclesCount: 3 },
  { id: '4', name: 'Data Analysis', description: 'Working with datasets and visualization', cyclesCount: 6 },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState(mockSkills);
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateSkill = () => {
    if (newSkill.name.trim()) {
      const skill = {
        id: Date.now().toString(),
        name: newSkill.name,
        description: newSkill.description,
        cyclesCount: 0
      };
      setSkills([...skills, skill]);
      setNewSkill({ name: '', description: '' });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Skills</h1>
          <p className="text-muted-foreground">Manage and track your skill development</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Skill</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new skill</DialogTitle>
              <DialogDescription>
                Add a skill you want to develop using Kolb&apos;s Learning Cycle.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="skill-name">Skill Name</label>
                <Input 
                  id="skill-name" 
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  placeholder="e.g., JavaScript, Public Speaking, Photography"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="skill-description">Description (optional)</label>
                <Textarea 
                  id="skill-description" 
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                  placeholder="Briefly describe what you want to learn about this skill"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateSkill}>Create Skill</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <Card key={skill.id}>
            <CardHeader>
              <CardTitle>{skill.name}</CardTitle>
              <CardDescription>{skill.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{skill.cyclesCount} learning cycles</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/skills/${skill.id}`}>View Details</Link>
              </Button>
              <Button asChild>
                <Link href={`/cycles/new?skillId=${skill.id}`}>Start Cycle</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 