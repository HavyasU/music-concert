import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { apiCall } from "../lib/api";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setMessage("Please enter both username and password");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      const response = await apiCall("/admin/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.success) {
        // Store token
        if (response.token) {
          localStorage.setItem("adminToken", response.token);
        }

        localStorage.setItem(
          "adminUser",
          JSON.stringify(response.admin || { username: formData.username })
        );

        setMessageType("success");
        setMessage("Login successful! Redirecting to dashboard...");

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      } else {
        setMessageType("error");
        setMessage(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessageType("error");
      setMessage(error.message || "Error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl border border-white/5">
          <div className="p-8 bg-blue-700 text-center">
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-blue-100 mt-2">Management & Analytics</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  messageType === "success"
                    ? "bg-blue-900 text-blue-100"
                    : "bg-black text-white"
                }`}
              >
                {message}
              </div>
            )}

            <div>
              <label className="block text-white font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="w-full px-4 py-2 rounded-lg bg-black text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-black text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center">
              <p className="text-slate-400">
                Don't have an account?{" "}
                <a
                  href="/admin/register"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Register here
                </a>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-slate-300">
          <p className="text-sm">Default credentials for demo:</p>
          <p className="text-xs text-slate-400 mt-2">
            Username: admin | Password: admin@123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
