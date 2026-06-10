"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { LogOut, UserCircle } from "lucide-react";
import MobileSidebar from "../../components/layout/MobileSidebar";

export default function DashboardHeader() {
  const { data: session } = useSession();

  const userName = session?.user?.name || "HealthIQ User";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image || "";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <MobileSidebar />

        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h2 className="text-base font-semibold md:text-lg">
            Your Health Overview
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 rounded-xl border px-3 py-2 md:flex">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <UserCircle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="max-w-40">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-muted"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
