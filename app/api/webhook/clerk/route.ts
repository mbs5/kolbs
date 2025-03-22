import { NextRequest, NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Get the headers
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error: Missing svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new NextResponse("Error: Missing webhook secret", {
      status: 500,
    });
  }

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error verifying webhook", {
      status: 400,
    });
  }

  // Get the event type
  const eventType = evt.type;

  // Handle the event
  try {
    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        
        // Check if a user with the given clerkId already exists
        const existingUser = await prisma.user.findFirst({ 
          where: { clerkId: id as string } 
        });
        
        if (!existingUser) {
          // Create a new user
          await prisma.user.create({
            data: {
              clerkId: id as string,
              email: email_addresses?.[0]?.email_address || "",
              name: first_name ? `${first_name} ${last_name || ""}`.trim() : null,
              image: image_url || null,
            },
          });
        }
        
        break;
      }
      
      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        
        // Update the user
        await prisma.user.update({
          where: { clerkId: id as string },
          data: {
            email: email_addresses?.[0]?.email_address || "",
            name: first_name ? `${first_name} ${last_name || ""}`.trim() : null,
            image: image_url || null,
          },
        });
        
        break;
      }
      
      case "user.deleted": {
        const { id } = evt.data;
        
        // Delete the user
        await prisma.user.delete({
          where: { clerkId: id as string },
        });
        
        break;
      }
      
      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${eventType}`);
    }
    
    return NextResponse.json({ message: "Webhook received" });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new NextResponse("Error processing webhook", {
      status: 500,
    });
  }
} 