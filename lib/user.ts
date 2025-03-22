import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { User } from "@prisma/client";

// Function to get or create a user profile in the database
export async function getUserProfile() {
  const authResult = await auth();
  const userId = authResult.userId;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Look up user in our database
  let user = await prisma.user.findUnique({
    where: {
      clerkId: userId
    }
  });

  // If user doesn't exist, create a new profile
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: "placeholder@example.com", // This will be updated later
      }
    });
  }

  return user;
}

// Update user profile from Clerk data
export async function syncUserProfile(clerkUser: {
  id: string;
  email_addresses?: Array<{ email_address: string }>;
  first_name?: string;
  last_name?: string;
  image_url?: string;
}) {
  if (!clerkUser || !clerkUser.id) {
    throw new Error("Invalid user data");
  }

  // Update or create user with Clerk user data
  const user = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: clerkUser.email_addresses?.[0]?.email_address || "",
      name: clerkUser.first_name
        ? `${clerkUser.first_name} ${clerkUser.last_name || ""}`.trim()
        : null,
      image: clerkUser.image_url || null,
    },
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.email_addresses?.[0]?.email_address || "",
      name: clerkUser.first_name
        ? `${clerkUser.first_name} ${clerkUser.last_name || ""}`.trim()
        : null,
      image: clerkUser.image_url || null,
    },
  });

  return user;
}

/**
 * Gets the currently authenticated user profile from the database
 * If the user doesn't exist in the database, it returns null
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const authResult = await auth();
    if (!authResult || !authResult.userId) {
      return null;
    }
    
    const clerkId = authResult.userId;
    
    const user = await prisma.user.findFirst({
      where: { clerkId }
    });
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Gets a user by their Clerk ID
 * If the user doesn't exist in the database, it returns null
 */
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  if (!clerkId) {
    return null;
  }
  
  try {
    const user = await prisma.user.findFirst({
      where: { clerkId }
    });
    
    return user;
  } catch (error) {
    console.error('Error finding user by Clerk ID:', error);
    return null;
  }
}

/**
 * Creates a new user profile with the given Clerk ID
 */
export async function createUser(clerkId: string, data: { 
  name?: string | null;
  email?: string | null;
  image?: string | null;
}): Promise<User> {
  return prisma.user.create({
    data: {
      clerkId,
      name: data.name || null,
      email: data.email || "",
      image: data.image || null
    }
  });
}

/**
 * Gets a user by their Clerk ID or creates a new one if they don't exist
 */
export async function getOrCreateUser(clerkId: string, data: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}): Promise<User> {
  const user = await getUserByClerkId(clerkId);
  
  if (user) {
    return user;
  }
  
  return createUser(clerkId, data);
} 