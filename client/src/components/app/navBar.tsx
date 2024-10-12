"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getSessionId } from "@/lib/getUserId";
import { Home, Link2, User } from "lucide-react";

export default function Navbar() {
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch the user ID after the component mounts
  useEffect(() => {
    const sessionId = getSessionId();
    setUserId(sessionId);
  }, []);

  const truncatedUserId = userId ? userId.slice(0, 8) : "Guest"; // Handle the case where userId is null

  return (
    <nav className="w-full bg-transparent py-4 px-8 fixed top-0 left-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-10">
          <Link href="/" className="flex items-center text-black hover:text-gray-700 font-medium">
            <Home className="mr-2" size={18} />
            Home
          </Link>
        </div>

        <div className="flex space-x-10 items-center">
          <div className="flex items-center text-black">
            <User className="mr-2" size={20} />
            <span className="font-medium">{truncatedUserId}</span>
          </div>
          <Link
            href="https://lgzz4srm5gimo3invvmtgykami0pcxpy.lambda-url.us-west-2.on.aws/docs"
            className="flex items-center text-black hover:text-gray-700 font-medium"
            target="_blank"
          >
            <Link2 className="mr-2" size={18} />
            FastAPI Endpoints
          </Link>
        </div>
      </div>
    </nav>
  );
}