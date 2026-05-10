"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);

  // Dev-mode: pick a role without any password
  const switchRole = async (role) => {
    const res = await fetch("/api/auth/switch-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Role switch failed");
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, switchRole, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
