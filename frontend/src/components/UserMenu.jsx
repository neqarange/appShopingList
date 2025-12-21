import { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../hooks/useLanguage";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { t } = useLanguage();

  // zavření při kliknutí mimo
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition shadow border border-gray-700"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        {/* Name + Email */}
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <span className="text-sm font-medium text-white">{user.name}</span>
          <span className="text-xs text-gray-400">{user.email}</span>
        </div>

        {/* Arrow */}
        <span
          className={`ml-2 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-gray-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden animate-fadeIn">
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800 transition"
          >
            🚪 {t.logout}
          </button>
        </div>
      )}
    </div>
  );
}
