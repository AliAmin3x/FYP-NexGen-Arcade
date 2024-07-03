"use client";
import { useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginDeveloper = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const q = query(collection(db, "developers"), where("email", "==", email), where("password", "==", password));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            setError("Invalid email or password");
        } else {
            // Assuming only one document per email, password pair
            const doc = querySnapshot.docs[0];
            console.log("Logged in as: ", doc.data().name);
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#181818] text-white">
            <h2 className="text-3xl font-bold mb-4">Developer Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form className="w-full max-w-sm" onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded bg-[#4e4949] text-white"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded bg-[#4e4949] text-white"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-[#71319f] hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Login
                </button>
            </form>
            <p className="mt-4">
                Don&apos;t have an account? <Link href="/developer/signup" className="text-purple-500 hover:underline">Sign Up</Link>
            </p>
        </div>
    );
};

export default LoginDeveloper;