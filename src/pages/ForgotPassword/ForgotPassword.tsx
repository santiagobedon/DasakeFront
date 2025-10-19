// src/pages/ForgotPassword/ForgotPassword.tsx
import React, { useRef, useState } from "react";
import InputField from "../../components/InputField";
import ButtonPrimary from "../../components/ButtonPrimary";
import Spinner from "../../components/Spinner";
import api from "../../services/api";
import { emailRegex } from "../../utils/validator";
import { toast } from "react-toastify";
import "./ForgotPassword.scss";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const liveRef = useRef<HTMLDivElement | null>(null);

  function announce(msg: string) { if (liveRef.current) liveRef.current.textContent = msg; }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailRegex.test(email)) { announce("Correo inválido"); return; }
    setLoading(true);
    try {
      await Promise.race([api.post("/auth/recover", { email }), new Promise((_, rej) => setTimeout(() => rej({ timeout: true }), 3000))]);
      setLoading(false);
      toast.success("Revisa tu correo para continuar");
      announce("Revisa tu correo para continuar");
    } catch (err: any) {
      setLoading(false);
      announce("Inténtalo de nuevo más tarde");
      if (import.meta.env.DEV) console.error(err);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Recuperar contraseña</h1>
        <p className="muted">Ingresa tu correo para recibir el enlace de recuperación</p>
        <InputField id="recover-email" label="Correo electronico" value={email} onChange={e => { setEmail(e.target.value); announce(""); }} />
        <div className="actions">
          <ButtonPrimary type="submit" disabled={!emailRegex.test(email) || loading}>
            {loading ? <Spinner /> : "Enviar enlace"}
          </ButtonPrimary>
        </div>
        <a className="muted" href="/login">Volver al inicio</a>
        <div className="visually-hidden" aria-live="polite" ref={liveRef}></div>
      </form>
      <div className="brand">
        <div className="brand-logo" aria-hidden />
        <div className="brand-text">DasakeMovies</div>
      </div>
    </div>
  );
}
