import { Link } from "react-router-dom";
import { navigationMap } from "../routes/navigationMap";
import { useAuth } from "../context/AuthContext";
import "../components/Footer.scss";
import manualPDF from "../assets/images/Manual_de_Usuario_DasakeMovie.pdf";
type Route = {
  path: string;
  name: string;
  children?: { path: string; name: string }[];
};

/**
 * Footer component
 *
 * Displays a modern footer with dynamic navigation links, a help button,
 * and copyright information. The links change depending on the user's
 * authentication state (public or private routes).
 *
 * The design features centered links separated by dividers ("|")
 * with hover effects and a minimalistic dark theme.
 *
 * Example:
 * <Footer />
 */
export default function Footer() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const routes: Route[] = isAuthenticated
    ? (navigationMap.private as Route[])
    : (navigationMap.public as Route[]);

  return (
    <div className="footer">
      <div className="footer-links">
        {routes.map((route, index) => (
          <span key={route.path} className="footer-item">
            <Link to={route.path} className="footer-link">
              {route.name}
            </Link>
            {index < routes.length - 1 && <span className="separator">|</span>}
          </span>
        ))}

        <span className="separator">|</span>
        <a href={manualPDF} className="footer-help" download="Manual_de_Usuario_DasakeMovie.pdf">
          ¿Necesitas ayuda?
        </a>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} DasakeMovies. todos los derechos reservados.
      </p>
    </div>
  );
}
