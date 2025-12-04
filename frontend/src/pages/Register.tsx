import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Gesli se ne ujemata.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth_register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Registracija ni uspela.');
        return;
      }
      navigate('/login', { state: { message: 'Registracija uspešna. Sedaj se prijavi.' } });
    } catch (err) {
      setError((err as Error).message || 'Prišlo je do napake.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-center">
      <div className="card form-card">
        <h2>Registracija</h2>
        <p className="subtitle">Vnesi svoje podatke in pridruži se beta programu.</p>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <label>
            E-pošta
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ime@domena.si"
              required
            />
          </label>
          <label>
            Uporabniško ime
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="uporabnik"
              required
            />
          </label>
          <label>
            Geslo
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          <label>
            Potrdi geslo
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Ustvarjam račun ...' : 'Ustvari račun'}
          </button>
        </form>
        <p className="muted">
          Že imaš račun? <Link to="/login">Prijavi se.</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
