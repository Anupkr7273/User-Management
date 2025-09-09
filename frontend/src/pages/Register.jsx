import { useState } from "react";
import { BACKEND_URL } from "../config";

export default function Register({ onRegister, switchToLogin }) {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Account created!");
                onRegister?.(data);
                setForm({ name: "", email: "", password: "" });
            } else {
                setMessage(data.message || "Couldn't create account");
            }
        } catch {
            setMessage("Server issue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm w-80">
                <h2 className="text-xl font-semibold mb-4 text-center">Create Account</h2>
                
                {message && (
                    <div className={`px-3 py-2 rounded mb-3 text-sm ${
                        message.includes("created") 
                            ? "bg-green-100 text-green-700 border border-green-300" 
                            : "bg-red-100 text-red-700 border border-red-300"
                    }`}>
                        {message}
                    </div>
                )}

                <div className="mb-3">
                    <input
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                        required
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Sign Up"}
                </button>

                <p className="text-center mt-4 text-sm text-gray-600">
                    Already registered?{" "}
                    <button
                        type="button"
                        onClick={switchToLogin}
                        className="text-blue-500 hover:underline"
                    >
                        Sign in
                    </button>
                </p>
            </form>
        </div>
    );
}