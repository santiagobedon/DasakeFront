/**
 * App
 *
 * Root component of the DasakeMovies frontend.
 * - Wraps the app with `AuthProvider` to provide authentication context.
 * - Renders `AppRoutes` for routing between pages.
 * - Includes a persistent `Footer`.
 * - Displays toast notifications using `ToastContainer`.
 */

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.scss";
import Footer from "./components/Footer";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col justify-between">
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer isAuthenticated={false} />
      </div>
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar />
    </AuthProvider>
  );
}
