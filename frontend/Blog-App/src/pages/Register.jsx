import { useState, useEffect, useRef } from "react";
import Login from "./Login";
import { registerUser } from "../api/BlogApi";

const Register = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const dialogRef = useRef(null);
  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const validate = () => {
    const newErrors = {};

    // Username: at least 3 chars, only letters, numbers, underscores
    if (!/^[a-zA-Z0-9_]{3,}$/.test(user.username)) {
      newErrors.username =
        "Username must be at least 3 characters and contain only letters, numbers, or underscores.";
    }

    // Email: simple regex for email
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password: at least 8 chars, at least one letter and one number
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(user.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include a letter, a number, and a special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await registerUser(user);
      if (res) {
        alert("Registration Successful! Please Login.");
      }
      onClose();
    } catch (error) {
      alert(error.message || "Registration failed.");
    }
    setUser({
      username: "",
      name: "",
      email: "",
      password: "",
    });
  };

  // Click outside to close
  const handleBackdropClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="signup-title"
      onMouseDown={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 id="signup-title" className="text-xl font-semibold text-gray-900">
            Create an account
          </h2>
          <button
            onClick={onClose}
            aria-label="Hide sign up"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit} method="POST">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              value={user.username}
              type="text"
              onChange={handleChange}
              required
              className={`mt-1 w-full rounded-lg border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/10`}
              placeholder="johndoe"
            />
            {errors.username && (
              <p className="text-xs text-red-600 mt-1">{errors.username}</p>
            )}
          </div>
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              name="email"
              onChange={handleChange}
              autoComplete="email"
              required
              className={`mt-1 w-full rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/10`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={user.password}
                onChange={handleChange}
                required
                className={`w-full rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/10`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-2 my-auto rounded-md px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-black text-white px-4 py-2 font-medium hover:bg-gray-900 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a className="text-gray-900 underline hover:no-underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
