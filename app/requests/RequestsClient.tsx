"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ServiceRequestForm } from "@/components/ServiceRequestForm";

export default function Requests() {
  const { data: session, status } = useSession();
  const [currentUrl, setCurrentUrl] = useState("");
  const searchParams = useSearchParams();
  const formOpen = searchParams.get("request") || false;

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Unauthorized</div>;

  return (
    <section className="min-h-screen max-h-fit bg-white text-black">
      <div>Test</div>
      {formOpen && <ServiceRequestForm session={session} />}
    </section>
  );
}
