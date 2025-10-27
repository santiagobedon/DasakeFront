import React, { useRef, useState } from "react";
import InputField from "../../components/InputField";
import ButtonPrimary from "../../components/ButtonPrimary";
import Spinner from "../../components/Spinner";
import api from "../../services/api";
import { validatePassword } from "../../utils/validator";
import { toast } from "react-toastify";
import "./ResetPassword.scss";
import { useSearchParams, useNavigate } from "react-router-dom";

/**
 * ResetPassword component
 *
 * Allows users to reset their password using a token received via email.
 * Validates the new password strength and ensures it matches the confirmation field.
 *
 * Features:
 * - Password validation hints displayed live.
 * - Provides accessible live feedback via aria-live region.
 * - Sends token and new password to backend for updating.
 * - Displays toast messages for success and error cases.
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const liveRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const pass = validatePassword(password);
  const valid = pass.valid && password === confirm;

  /**
   * Handles form submission to reset password.
   * - Validates password and confirmation
   * - Sends POST request to /auth/reset with token and new password
   * - Provides live feedback on errors
   * @param e Form event
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      if (!pass.valid) liveRef.current!.textContent = "contraseña no cumple requisitos";
      else liveRef.current!.textContent = "las contraseñas no coinciden";
      return;
    }
    setLoading(true);
    try {
      console.log("🔹 token recibido en frontend:", token);
      const res = await api.post("/auth/reset", { token, newPassword: password });
      console.log("🔹 respuesta del backend al cambiar contraseña:", res.data);
      setLoading(false);
      toast.success("contraseña actualizada");
      navigate("/login");
    } catch (err: any) {
      setLoading(false);
      console.error("❌ error al cambiar contraseña:", err.response?.data || err.message);
      if (err?.response?.status === 400 || err?.response?.status === 410) {
        liveRef.current!.textContent = "enlace inválido o caducado";
      } else {
        liveRef.current!.textContent = "inténtalo de nuevo más tarde";
      }
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>recuperar contraseña</h1>
        <InputField
          id="new-pass"
          label="contraseña"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            liveRef.current!.textContent = "";
          }}
        />
        <InputField
          id="confirm-pass"
          label="confirmar contraseña"
          type="password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            liveRef.current!.textContent = "";
          }}
        />

        {/* password validation hints */}
        <div className="password-hints">
          <small className={pass.length ? "ok" : ""}>≥ 8 caracteres/letras</small>
          <small className={pass.upper ? "ok" : ""}>1 mayúscula</small>
          <small className={pass.num ? "ok" : ""}>1 número</small>
          <small className={pass.special ? "ok" : ""}>1 carácter especial</small>
        </div>

        <div className="actions">
          <ButtonPrimary type="submit" disabled={!valid || loading}>
            {loading ? <Spinner /> : "actualizar"}
          </ButtonPrimary>
        </div>
        <div className="visually-hidden" aria-live="polite" ref={liveRef}></div>
      </form>
      <div className="brand">
        <div className="brand-logo" aria-hidden />
        <div className="brand-text">dasakemovies</div>
      </div>
    </div>
  );
}
