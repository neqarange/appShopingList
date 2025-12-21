import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../hooks/useLanguage";

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      navigate("/");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div
        className="
          w-full max-w-sm
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          p-5 sm:p-6
          rounded-2xl shadow-xl
          transition-colors
        "
      >
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          {t.login}
        </h1>

        {err && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {err}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="
              w-full p-2.5 rounded border
              bg-white dark:bg-gray-700
              dark:border-gray-600 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500
              text-sm sm:text-base
            "
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="
              w-full p-2.5 rounded border
              bg-white dark:bg-gray-700
              dark:border-gray-600 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500
              text-sm sm:text-base
            "
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition text-sm sm:text-base">
            {t.signIn}
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-600 dark:text-gray-400">
          {t.noAccount}{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            {t.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
