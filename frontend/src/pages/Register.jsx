import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Register() {
  const [name, setName] = useState(''); 
  const [surename, setSurename] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const nav = useNavigate();
  const { register } = useAuth();

  async function onSubmit(e) {
    e.preventDefault();
    try { await register(name, surename, email, password); setMsg('Účet vytvořen. Přihlas se.'); setTimeout(()=>nav('/login'), 600); }
    catch (e) { setMsg(e.message); }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">Registrace</h1>
      {msg && <p className="text-sm mb-2">{msg}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Jméno" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Prijmení" value={surename} onChange={e=>setSurename(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Heslo" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Vytvořit</button>
      </form>
      <p className="text-sm mt-3"><Link to="/login" className="text-blue-600">Zpět na přihlášení</Link></p>
    </div>
  );
}
