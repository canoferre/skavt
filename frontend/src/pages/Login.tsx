import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate, Location } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as { from?: Location; message?: string }) || {};

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(identifier, password);
      const redirectTo = (locationState.from as Location | undefined)?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Napaka pri prijavi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-center">
      <div className="card form-card">
        <h2>Prijava</h2>
        <p className="subtitle">Vnesi e-pošto ali uporabniško ime in geslo.</p>
        {locationState.message && <div className="alert success">{locationState.message}</div>}
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <label>
            E-pošta ali uporabniško ime
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="ime@domena.si ali uporabnik"
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
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Prijavljam ...' : 'Prijava'}
          </button>
        </form>
        <p className="muted">
          Še nimaš računa? <Link to="/register">Registriraj se.</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
