"use client";
import { useState } from "react";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUpDeveloper = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "developers"), {
                name,
                email,
                password,
            });
            console.log("Document written with ID: ", docRef.id);
            router.push("/developer/login");
        } catch (e) {
            setError("Error adding document: " + e.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#181818] text-white">
            <h2 className="text-3xl font-bold mb-4">Sign Up as Developer</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form className="w-full max-w-sm" onSubmit={handleSignUp}>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2" htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 rounded bg-[#4e4949] text-white"
                        required
                    />
                </div>
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
                    Sign Up
                </button>
            </form>
            <p className="mt-4">
                Already have an account? <Link href="/developer/login" className="text-purple-500 hover:underline">Login</Link>
            </p>
        </div>
    );
};

export default SignUpDeveloper;