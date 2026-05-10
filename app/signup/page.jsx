"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Auth is disabled in dev mode — redirect to role picker
const Signup = () => {
  const router = useRouter();
  useEffect(() => { router.replace("/"); }, [router]);
  return null;
};

export default Signup;
