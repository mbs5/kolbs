import { UserProfile } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Kolb's Learning Cycle Tracker",
  description: "Update your profile settings",
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <UserProfile 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none",
              navbar: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
} 