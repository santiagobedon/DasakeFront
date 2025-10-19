// src/pages/Login/Login.tsx
import React, { useRef, useState } from "react";
import InputField from "../../components/InputField";
import ButtonPrimary from "../../components/ButtonPrimary";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { emailRegex } from "../../utils/validator";
import "./Login.scss";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // <-- mensaje de error
  const liveRef = useRef<HTMLDivElement | null>(null);

  const emailValid = emailRegex.test(email);
  const passValid = password.length > 0;
  const formValid = emailValid && passValid;

  function announce(msg: string) {
    setErrorMsg(msg);
    if (liveRef.current) liveRef.current.textContent = msg;
  }

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
      // show spinner at most 3s visually
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

        {errorMsg && <div className="field-error" role="alert">{errorMsg}</div>} {/* <-- mensaje visible */}

        <div className="actions">
          <ButtonPrimary type="submit" disabled={!formValid || loading}>
            {loading ? <Spinner size={16} /> : "Iniciar sesión"}
          </ButtonPrimary>
        </div>

        <p className="muted">¿No tienes cuenta? <a href="/register">Registrarse</a></p>

        <div className="visually-hidden" aria-live="polite" ref={liveRef}></div>
      </form>

      <div className="brand">
        <div className="brand-logo" aria-hidden />
        <div className="brand-text">DasakeMovies</div>
      </div>
    </div>
  );
}
