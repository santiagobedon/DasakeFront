// src/pages/ResetPassword/ResetPassword.tsx
import React, { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField";
import ButtonPrimary from "../../components/ButtonPrimary";
import Spinner from "../../components/Spinner";
import api from "../../services/api";
import { validatePassword } from "../../utils/validator";
import { toast } from "react-toastify";
import "./ResetPassword.scss";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [validToken, setValidToken] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const liveRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await api.get(`/auth/reset/validate?token=${encodeURIComponent(token)}`);
        setValidToken(true);
      } catch {
        setValidToken(false);
      }
    })();
  }, [token]);

  const pass = validatePassword(password);
  const valid = pass.valid && password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      if (!pass.valid) liveRef.current!.textContent = "Contraseña no cumple requisitos";
      else liveRef.current!.textContent = "Las contraseñas no coinciden";
      return;
    }
    setLoading(true);
    try {
      await Promise.race([api.post("/auth/reset", { token, password }), new Promise((_, rej) => setTimeout(() => rej({ timeout: true }), 3000))]);
      setLoading(false);
      toast.success("Contraseña actualizada");
      navigate("/login");
    } catch (err: any) {
      setLoading(false);
      if (err?.response?.status === 400 || err?.response?.status === 410) {
        liveRef.current!.textContent = "Enlace inválido o caducado";
      } else {
        liveRef.current!.textContent = "Inténtalo de nuevo más tarde";
        if (import.meta.env.DEV) console.error(err);
      }
    }
  }

  if (validToken === null) return <div className="auth-page"><div className="auth-card"><Spinner /></div></div>;
  if (!validToken) return <div className="auth-page"><div className="auth-card"><h2>Enlace inválido o caducado</h2><a href="/recover">Reenviar enlace</a></div></div>;

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Recuperar contraseña</h1>
        <InputField id="new-pass" label="Contraseña" type="password" value={password} onChange={e => { setPassword(e.target.value); liveRef.current!.textContent = ""; }} />
        <InputField id="confirm-pass" label="Confirmar contraseña" type="password" value={confirm} onChange={e => { setConfirm(e.target.value); liveRef.current!.textContent = ""; }} />
        <div className="actions">
          <ButtonPrimary type="submit" disabled={!valid || loading}>{loading ? <Spinner /> : "Actualizar"}</ButtonPrimary>
        </div>
        <div className="visually-hidden" aria-live="polite" ref={liveRef}></div>
      </form>
      <div className="brand">
        <div className="brand-logo" aria-hidden />
        <div className="brand-text">DasakeMovies</div>
      </div>
    </div>
  );
}
