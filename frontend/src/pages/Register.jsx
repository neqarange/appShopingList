import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [surename, setSurename] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await register(name, surename, email, password);
      navigate("/login");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-xl transition-colors">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Registrace
        </h1>

        {err && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {err}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full p-2 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jméno"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-2 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Příjmení"
            value={surename}
            onChange={(e) => setSurename(e.target.value)}
          />

          <input
            className="w-full p-2 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-2 rounded border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
            Vytvořit účet
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-gray-600 dark:text-gray-400">
          <Link to="/login" className="text-blue-500 hover:underline">
            Zpět na přihlášení
          </Link>
        </p>
      </div>
    </div>
  );
}
