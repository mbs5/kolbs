'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FeedbackDialog } from '@/components/feedback/feedback-dialog';

// Mock skills data - replace with actual data fetching
const mockSkills = [
  { id: '1', name: 'JavaScript' },
  { id: '2', name: 'Public Speaking' },
  { id: '3', name: 'Photography' },
  { id: '4', name: 'Data Analysis' },
];

// Form schema with validation
const formSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters.',
  }),
  skillId: z.string({
    required_error: 'Please select a skill.',
  }),
  concreteExperience: z.string().min(10, {
    message: 'Please provide more details about your experience.',
  }),
  reflectiveObservation: z.string().min(10, {
    message: 'Please provide more details about your reflections.',
  }),
  abstractConceptualization: z.string().min(10, {
    message: 'Please provide more details about the concepts learned.',
  }),
  activeExperimentation: z.string().min(10, {
    message: "Please provide more details about how you'll apply this learning.",
  }),
  isPublic: z.boolean().default(false),
});

// Component that uses useSearchParams
function NewCyclePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = searchParams.get('skillId');
  
  const [skills] = useState(mockSkills);
  const [canGetFeedback, setCanGetFeedback] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      skillId: skillId || '',
      concreteExperience: '',
      reflectiveObservation: '',
      abstractConceptualization: '',
      activeExperimentation: '',
      isPublic: false,
    },
  });
  
  // Watch form values to enable/disable feedback
  const watchedValues = form.watch();
  
  // Enable feedback button if all required fields have content
  const checkFeedbackAvailability = () => {
    const { 
      title, 
      concreteExperience, 
      reflectiveObservation, 
      abstractConceptualization, 
      activeExperimentation 
    } = watchedValues;
    
    const hasRequiredContent = 
      title.length >= 3 && 
      concreteExperience.length >= 10 && 
      reflectiveObservation.length >= 10 && 
      abstractConceptualization.length >= 10 && 
      activeExperimentation.length >= 10;
    
    if (hasRequiredContent !== canGetFeedback) {
      setCanGetFeedback(hasRequiredContent);
    }
  };
  
  // Check feedback availability whenever form values change
  useEffect(() => {
    checkFeedbackAvailability();
  }, [watchedValues]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    
    // Here we would normally save the data to the database
    // For now, we'll just redirect to the cycles page
    router.push('/cycles');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Start a New Learning Cycle</h1>
        <p className="text-muted-foreground">Document your learning experience using Kolb&apos;s Experiential Learning Cycle</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="What are you learning about?" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        checkFeedbackAvailability();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear title for your learning cycle
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skillId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      checkFeedbackAvailability();
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skills.map((skill) => (
                        <SelectItem key={skill.id} value={skill.id}>{skill.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The skill you are developing with this learning cycle
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-8">
            <Card className="p-6">
              <FormField
                control={form.control}
                name="concreteExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Concrete Experience</FormLabel>
                    <FormDescription className="mb-4">
                      Describe the specific experience or activity. What happened? What did you do? Be detailed and specific.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="I participated in..."
                        className="min-h-[120px]"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          checkFeedbackAvailability();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            <Card className="p-6">
              <FormField
                control={form.control}
                name="reflectiveObservation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Reflective Observation</FormLabel>
                    <FormDescription className="mb-4">
                      Reflect on what happened. What did you observe? What insights or patterns emerged? What went well or didn&apos;t go well?
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="When reflecting on this experience, I noticed..."
                        className="min-h-[120px]"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          checkFeedbackAvailability();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            <Card className="p-6">
              <FormField
                control={form.control}
                name="abstractConceptualization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Abstract Conceptualization</FormLabel>
                    <FormDescription className="mb-4">
                      Form theories and conclusions. What principles or patterns did you discover? How does this connect to existing knowledge or theories?
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Based on my reflections, I learned that..."
                        className="min-h-[120px]"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          checkFeedbackAvailability();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            <Card className="p-6">
              <FormField
                control={form.control}
                name="activeExperimentation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Active Experimentation</FormLabel>
                    <FormDescription className="mb-4">
                      Plan how to apply your learning. How will you test your theories in future situations? What will you do differently next time?
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Based on what I've learned, next time I will..."
                        className="min-h-[120px]"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          checkFeedbackAvailability();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </div>

          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Make Public</FormLabel>
                    <FormDescription>
                      Allow others to view and learn from your learning cycle
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4 justify-end">
            {canGetFeedback && (
              <FeedbackDialog
                cycleData={{
                  id: 'new',
                  title: form.getValues('title'),
                  concreteExperience: form.getValues('concreteExperience'),
                  reflectiveObservation: form.getValues('reflectiveObservation'),
                  abstractConceptualization: form.getValues('abstractConceptualization'),
                  activeExperimentation: form.getValues('activeExperimentation'),
                }}
              />
            )}
            <Button type="submit">Save Learning Cycle</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Main page component with Suspense
export default function NewCyclePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <NewCyclePageContent />
    </Suspense>
  );
} 