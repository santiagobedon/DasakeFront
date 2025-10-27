import React, { useRef, useState } from "react";
import InputField from "../../components/InputField";
import ButtonPrimary from "../../components/ButtonPrimary";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { emailRegex } from "../../utils/validator";
import "./Login.scss";
import logo from "../../assets/images/logo.png";

/**
 * Login component
 *
 * Handles user login with email and password.
 * Provides real-time validation, accessible feedback via aria-live, 
 * and handles various error states such as incorrect credentials,
 * temporary account lock, and too many attempts.
 */
export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const liveRef = useRef<HTMLDivElement | null>(null);

  const emailValid = emailRegex.test(email);
  const passValid = password.length > 0;
  const formValid = emailValid && passValid;

  /**
   * Updates the aria-live region with a message and sets error state
   * @param msg - message to announce to screen readers
   */
  function announce(msg: string) {
    setErrorMsg(msg);
    if (liveRef.current) liveRef.current.textContent = msg;
  }

  /**
   * Handles form submission for login
   * @param e - form submission event
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid) {
      announce("Corrige los campos.");
      return;
    }
    setLoading(true);
    announce("Procesando...");
    try {
      const p = login(email, password);
      await Promise.race([
        p,
        new Promise((_, rej) => setTimeout(() => rej({ timeout: true }), 3000))
      ]);
      setLoading(false);
      toast.success("Sesión iniciada");
      setTimeout(() => (window.location.href = "/dashboard"), 400);
    } catch (err: any) {
      setLoading(false);
      if (err?.response?.status === 401) {
        announce("Correo o contraseña incorrectos");
      } else if (err?.response?.status === 423) {
        announce("Cuenta temporalmente bloqueada");
      } else if (err?.response?.status === 429) {
        announce("Demasiados intentos. Intenta en unos minutos.");
      } else {
        announce("Inténtalo de nuevo más tarde");
        if (import.meta.env.DEV) console.error(err);
      }
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <div className="auth-logo-wrapper">
          <img src={logo} alt="Logo DasakeMovies" className="auth-logo" />
        </div>

        <h1>Iniciar sesión</h1>

        <InputField
          id="login-email"
          label="Correo electronico"
          value={email}
          onChange={e => { setEmail(e.target.value); announce(""); }}
        />

        <InputField
          id="login-pass"
          label="Contraseña"
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); announce(""); }}
        />

        <a className="forgot-link" href="/recover">¿Olvidaste tu contraseña?</a>

        {errorMsg && <div className="field-error" role="alert">{errorMsg}</div>}

        <div className="actions">
          <ButtonPrimary type="submit" disabled={!formValid || loading}>
            {loading ? <Spinner size={16} /> : "Iniciar sesión"}
          </ButtonPrimary>
        </div>

        <p className="muted">¿No tienes cuenta? <a href="/register">Registrarse</a></p>

        <div className="visually-hidden" aria-live="polite" ref={liveRef}></div>
      </form>
    </div>
  );
}
