import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user";

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get the authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized, please sign in" },
        { status: 401 }
      );
    }

    // Get skills for the authenticated user
    const skills = await prisma.skill.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        name: "asc"
      }
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
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

    // Get the skill data from the request
    const skillData = await request.json();

    // Create the skill
    const skill = await prisma.skill.create({
      data: {
        name: skillData.name,
        description: skillData.description,
        userId: user.id
      }
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
} 