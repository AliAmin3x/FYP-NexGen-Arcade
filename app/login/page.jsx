"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "../../lib/SessionContext";

const roles = [
  {
    id: "user",
    label: "Customer",
    description: "Browse and purchase games",
    icon: "🎮",
    redirect: "/homepage",
  },
  {
    id: "developer",
    label: "Developer",
    description: "Upload and manage games",
    icon: "👨‍💻",
    redirect: "/dashboard",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Approve games and manage revenue",
    icon: "🛡️",
    redirect: "/admin/game-approvals",
  },
];

const Login = () => {
  const router = useRouter();
  const { switchRole } = useSession();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const handleRoleSelect = async (role) => {
    setLoading(role.id);
    setError("");
    try {
      await switchRole(role.id);
      router.push(role.redirect);
    } catch (err) {
      setError(err.message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818] p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-2">NexGen Arcade</h1>
          <p className="text-gray-400 text-sm">
            Dev Mode — Select a role to continue
          </p>
        </motion.div>

        {error && (
          <p className="text-red-400 text-center mb-4 text-sm">{error}</p>
        )}

        <div className="flex flex-col gap-4">
          {roles.map((role, i) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              onClick={() => handleRoleSelect(role)}
              disabled={!!loading}
              className="flex items-center gap-5 bg-[#303030] hover:bg-[#404040] border border-transparent hover:border-purple-500 text-white px-6 py-5 rounded-xl transition-all duration-300 disabled:opacity-60"
            >
              <span className="text-4xl">{role.icon}</span>
              <div className="text-left">
                <p className="text-lg font-semibold">
                  {loading === role.id ? "Entering..." : role.label}
                </p>
                <p className="text-gray-400 text-sm">{role.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <p className="text-gray-600 text-xs text-center mt-8">
          Authentication is disabled in dev mode. RBAC rules still apply per role.
        </p>
      </div>
    </div>
  );
};

export default Login;
