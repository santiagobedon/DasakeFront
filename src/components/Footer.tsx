import { Link } from "react-router-dom";
import { navigationMap } from "../routes/navigationMap";
import { useAuth } from "../context/AuthContext";

type Route = {
  path: string;
  name: string;
  children?: { path: string; name: string }[];
};

/**
 * Footer component
 *
 * Displays a fixed footer with dynamic navigation links
 * that adjust based on the user's authentication state.
 *
 * If the user is authenticated, private routes are displayed;
 * otherwise, public routes are shown. Each route can have
 * nested children links that are displayed below their parent.
 *
 * The footer remains visible at the bottom of the screen
 * with a dark background and soft hover effects on links.
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
    <footer className="fixed bottom-0 left-0 w-full bg-gray-900 text-white py-2 shadow-md z-50">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {routes.map((route) => (
            <div key={route.path}>
              <Link
                to={route.path}
                className="hover:text-blue-400 transition-colors"
              >
                {route.name}
              </Link>

              {route.children && (
                <div className="text-xs mt-1 text-gray-400">
                  {route.children.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className="block hover:text-blue-400"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          © {new Date().getFullYear()} dasakewaremovies
        </p>
      </div>
    </footer>
  );
}
