import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ChevronRight, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | Kolb's Learning Cycle Tracker",
  description: "View your learning progress and stats",
};

export default async function DashboardPage() {
  // Check if user is authenticated
  const authResult = await auth();
  const userId = authResult.userId;
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Get user data
  const user = await prisma.user.findFirst({
    where: { clerkId: userId },
  });

  if (!user) {
    // Create user profile if it doesn't exist
    await prisma.user.create({
      data: {
        clerkId: userId,
        email: ""
      },
    });
  }

  // Get user's learning cycles
  const recentLearningCycles = await prisma.learningCycle.findMany({
    where: {
      user: {
        clerkId: userId,
      },
    },
    include: {
      skill: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  // Get user's skills
  const skillCount = await prisma.skill.count({
    where: {
      user: {
        clerkId: userId,
      },
    },
  });

  // Get learning cycle count
  const cycleCount = await prisma.learningCycle.count({
    where: {
      user: {
        clerkId: userId,
      },
    },
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your learning progress and manage your skills
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <Link href="/skills/new">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Skill
            </Button>
          </Link>
          <Link href="/cycles/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Learning Cycle
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-medium mb-1">Learning Cycles</h3>
          <p className="text-3xl font-bold">{cycleCount}</p>
          <p className="text-muted-foreground mt-1">Total documented cycles</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-medium mb-1">Skills</h3>
          <p className="text-3xl font-bold">{skillCount}</p>
          <p className="text-muted-foreground mt-1">Skills in development</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-lg font-medium mb-1">Streak</h3>
          <p className="text-3xl font-bold">0</p>
          <p className="text-muted-foreground mt-1">Days in a row</p>
        </div>
      </div>

      {/* Recent learning cycles */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Learning Cycles</h2>
          <Link href="/cycles" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {recentLearningCycles.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="divide-y">
              {recentLearningCycles.map((cycle) => (
                <Link 
                  key={cycle.id} 
                  href={`/cycles/${cycle.id}`} 
                  className="p-4 hover:bg-gray-50 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium">{cycle.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cycle.skill?.name || "No skill"} • {new Date(cycle.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-muted-foreground mb-4">You haven&apos;t created any learning cycles yet</p>
            <Link href="/cycles/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create your first cycle
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 