import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const { login } = useAuth();

  async function onSubmit(e) {
    e.preventDefault(); setErr('');
    try { await login(email, password); nav('/'); }
    catch (e) { setErr(e.message); }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">Přihlášení</h1>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Heslo" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Přihlásit</button>
      </form>
      <p className="text-sm mt-3">Nemáš účet? <Link to="/register" className="text-blue-600">Registrace</Link></p>
    </div>
  );
}
