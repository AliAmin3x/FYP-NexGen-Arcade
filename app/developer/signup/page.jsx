"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "../../../lib/SessionContext";

const SignUpDeveloper = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/developers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Signup failed"); return; }
    router.push("/developer/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181818] text-white">
      <h2 className="text-3xl font-bold mb-4">Sign Up as Developer</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form className="w-full max-w-sm" onSubmit={handleSignUp}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 rounded bg-[#4e4949] text-white" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 rounded bg-[#4e4949] text-white" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 rounded bg-[#4e4949] text-white" required />
        </div>
        <button type="submit" className="bg-[#71319f] hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded">Sign Up</button>
      </form>
      <p className="mt-4">Already have an account? <Link href="/developer/login" className="text-purple-500 hover:underline">Login</Link></p>
    </div>
  );
};

export default SignUpDeveloper;
