// src/pages/changePassword/ChangePassword.tsx
import React, { useState, useRef } from "react";
import InputField from "../../components/InputField";
import ButtonPrimary from "../../components/ButtonPrimary";
import Spinner from "../../components/Spinner";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../../utils/validator";
import "./Change-Password.scss";
import logo from "../../assets/images/logo.png";

/**
 * ChangePassword page
 *
 * Allows the user to change their current password.
 * Validates password strength and confirmation.
 * Displays live error messages and success notifications.
 */
export default function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const liveRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const handleBack = () => navigate("/Dashboard");

  const pass = validatePassword(password);
  const valid =
    current.trim().length > 0 && pass.valid && password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      if (!pass.valid)
        liveRef.current!.textContent =
          "La nueva contraseña no cumple con los requisitos mínimos";
      else if (password !== confirm)
        liveRef.current!.textContent = "Las contraseñas no coinciden";
      return;
    }

    try {
      setLoading(true);
      const res = await api.put("/auth/change-password", {
        currentPassword: current,
        newPassword: password,
      });
      if (res.status === 200) {
        toast.success("password updated successfully");
        navigate("/profile");
      }
    } catch (err: any) {
      if (err?.response?.status === 400) {
        liveRef.current!.textContent = "La contraseña actual es incorrecta";
      } else if (err?.response?.status === 401) {
        window.location.href = "/login";
      } else {
        liveRef.current!.textContent = "Ocurrió un error, inténtalo de nuevo más tarde";
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo-wrapper">
          <img src={logo} alt="Logo DasakeMovies" className="auth-logo" />
        </div>
        <h1>Cambiar contraseña</h1>

        <InputField
          id="current-pass"
          label="Contraseña actual"
          type="password"
          value={current}
          onChange={(e) => {
            setCurrent(e.target.value);
            liveRef.current!.textContent = "";
          }}
        />

        <InputField
          id="new-pass"
          label="Nueva contraseña"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            liveRef.current!.textContent = "";
          }}
        />

        <InputField
          id="confirm-pass"
          label="Confirmar contraseña"
          type="password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            liveRef.current!.textContent = "";
          }}
        />

        <div className="actions">
          <ButtonPrimary type="submit" disabled={!valid || loading}>
            {loading ? <Spinner /> : "Guardar cambios"}
          </ButtonPrimary>
          <ButtonPrimary onClick={handleBack} aria-label="volver al inicio">
            Inicio
          </ButtonPrimary>
        </div>

        <div
          className="visually-hidden"
          aria-live="polite"
          ref={liveRef}
        ></div>
      </form>
    </div>
  );
}
