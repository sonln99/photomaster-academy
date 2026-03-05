"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { setUserId, loadProgressFromCloud, uploadProgressToCloud } from "@/lib/progress";

function SyncProgress() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const id = (session.user as Record<string, unknown>).id as string || session.user.name || "anonymous";
      setUserId(id);
      // Tải progress từ cloud về, rồi upload local lên cloud
      loadProgressFromCloud().then(() => uploadProgressToCloud());
    } else {
      setUserId(null);
    }
  }, [session]);

  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SyncProgress />
      {children}
    </SessionProvider>
  );
}
