import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  // cerrar menú al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dash-page">
      <div className="movies-container">
        {/* header: avatar + bienvenida + hamburger */}
        <div className="header-row">
          <div className="user-info">
            <div
              className="avatar"
              aria-label="perfil de usuario"
              onClick={goToProfile}
            >
              {user?.firstName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <h2>Bienvenido, {user?.firstName ?? "Usuario"}</h2>
          </div>

          <div
            className="user-menu-wrapper"
            ref={menuRef}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span />
              <span />
              <span />
            </div>

            <div className={`menu-dropdown ${menuOpen ? "show" : ""}`}>
              <button disabled>📂 Categorías</button>
              <button onClick={handleLogout}>🚪 Cerrar sesión</button>
            </div>
          </div>
        </div>

        {/* placeholder peliculas */}
        <div className="movies-placeholder">
          <p role="alert" aria-live="polite">
            Próximamente tendremos películas...
          </p>
        </div>
      </div>
    </div>
  );
}
