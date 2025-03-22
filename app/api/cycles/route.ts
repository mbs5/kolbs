import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user";
import { Prisma } from "@prisma/client";

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized, please sign in" },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const skillId = searchParams.get("skillId");
    
    // Base query for learning cycles
    const where: Prisma.LearningCycleWhereInput = {
      userId: user.id
    };

    // Add skill filter if provided
    if (skillId) {
      where.skillId = skillId;
    }

    // Get learning cycles from the database
    const cycles = await prisma.learningCycle.findMany({
      where,
      orderBy: {
        updatedAt: "desc"
      },
      include: {
        skill: true
      }
    });

    return NextResponse.json(cycles);
  } catch (error) {
    console.error("Error fetching learning cycles:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning cycles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized, please sign in" },
        { status: 401 }
      );
    }

    // Get the cycle data from the request
    const cycleData = await request.json();

    // Create the learning cycle
    const cycle = await prisma.learningCycle.create({
      data: {
        title: cycleData.title,
        skillId: cycleData.skillId,
        concreteExperience: cycleData.concreteExperience,
        reflectiveObservation: cycleData.reflectiveObservation,
        abstractConceptualization: cycleData.abstractConceptualization,
        activeExperimentation: cycleData.activeExperimentation,
        userId: user.id
      }
    });

    return NextResponse.json(cycle, { status: 201 });
  } catch (error) {
    console.error("Error creating learning cycle:", error);
    return NextResponse.json(
      { error: "Failed to create learning cycle" },
      { status: 500 }
    );
  }
} 