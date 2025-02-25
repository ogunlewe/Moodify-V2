import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "Anonymous",
          email: user.email,
        });
        toast.success("Registration successful! You can now log in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-[#181818] p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isRegistering ? "Create an Account" : "Log In"}
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-[#282828] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-white"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-[#282828] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-white"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 py-3 rounded-lg font-semibold hover:bg-green-400 transition"
          >
            {isRegistering ? "Sign Up" : "Log In"}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-4 text-gray-400 hover:text-white text-sm text-center"
        >
          {isRegistering ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Login;
