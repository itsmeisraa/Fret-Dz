// src/components/Navbar.jsx
import { useAuth } from '../context/AuthContext';

export default function Navbar({ page, setPage }) {
  const { user, signOut } = useAuth();
  const links = [
    ['dashboard',    'Dashboard'],
    ['camionneurs',  'Camionneurs'],
    ['expeditions',  'Expéditions'],
  ];

  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage('dashboard')}>
        Fret<span>-DZ</span>
      </div>

      <div className="nav-links">
        {links.map(([p, label]) => (
          <button
            key={p}
            className={`nav-link${page === p ? ' active' : ''}`}
            onClick={() => setPage(p)}
          >
            {label}
          </button>
        ))}

        <span className="nav-user">{user?.company || user?.name || ''}</span>

        <button
          className="btn btn-g btn-sm"
          style={{ marginLeft: 8 }}
          onClick={signOut}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
