import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    if (userData && accessToken) {
      router.push("/userInfo");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const baseUrl = "http://localhost:3000/api";
    const registerUrl = `${baseUrl}/auth/register`;
    const payload = {
      email,
      password,
    };

    try {
      const response = await axios.post(registerUrl, payload);
      console.log("Registration successful:", response.data);
      // localStorage.setItem("user", JSON.stringify(response.data.user));
      // localStorage.setItem("accessToken", response.data.accessToken);
      router.push("/login");
    } catch (error) {
      console.error("Error:", error);
      // Handle registration error here
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
