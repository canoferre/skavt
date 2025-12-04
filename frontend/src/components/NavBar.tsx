import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="nav-bar">
      <div className="nav-brand">Slovenski nepremičninski skavt</div>
      <nav className="nav-links">
        <Link to="/">Domov</Link>
        {user ? (
          <>
            <Link to="/dashboard">Nadzorna plošča</Link>
            <button className="link-button" onClick={handleLogout}>
              Odjava
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Prijava</Link>
            <Link className="btn btn-small" to="/register">
              Registracija
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
