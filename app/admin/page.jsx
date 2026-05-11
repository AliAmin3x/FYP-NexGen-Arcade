"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminIndex = () => {
  const router = useRouter();
  useEffect(() => { router.replace("/admin/game-approvals"); }, [router]);
  return null;
};

export default AdminIndex;
