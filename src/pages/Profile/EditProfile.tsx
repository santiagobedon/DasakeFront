import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import ButtonPrimary from "../../components/ButtonPrimary";
import "./Profile.scss";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * EditProfile component
 * 
 * Allows the user to edit their profile information including first name, last name, age, and email.
 * Provides real-time validation and accessible feedback via aria-live regions.
 * Contains navigation buttons to change password and return to profile.
 */
export default function EditProfile() {
  const { user, refreshMe } = useAuth();
  const navigate = useNavigate();
  const liveRef = useRef<HTMLDivElement | null>(null);

  const [firstName, setfirstName] = useState(user?.firstName ?? "");
  const [lastName, setlastName] = useState(user?.lastName ?? "");
  const [age, setage] = useState(user?.age ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [loading, setLoading] = useState(false);

  const valid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    Number(age) >= 13 &&
    emailRegex.test(email);

  /**
   * Updates the aria-live region with a message
   * @param msg - message to announce to screen readers
   */
  function announce(msg: string) {
    if (liveRef.current) liveRef.current.textContent = msg;
  }

  /**
   * Handles saving profile changes
   * @param e - form submission event
   */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return announce("Corrige los campos antes de continuar");

    try {
      setLoading(true);
      announce("Guardando cambios...");
      if (!user) return <p>Cargando...</p>;
      const res = await api.put(`/users/${user.id}`, {
        firstName,
        lastName,
        age,
        email,
      });

      if (res.status === 200) {
        toast.success("Perfil actualizado");
        await refreshMe();
        setTimeout(() => navigate("/profile"), 500);
      }
    } catch (err: any) {
      if (err?.response?.status === 409) {
        announce("El correo ya está registrado");
      } else if (err?.response?.status === 401) {
        window.location.href = "/login";
      } else {
        announce("Ocurrió un error, intenta más tarde");
        if (import.meta.env.DEV) console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="profile-page">
        <p>Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="profile-page">
        <form className="profile-card" onSubmit={handleSave} noValidate>
          <h2>Editar perfil</h2>

          <div className="profile-info">
            <label>
              Nombres
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setfirstName(e.target.value);
                  announce("");
                }}
                placeholder="nombres"
                required
              />
            </label>

            <label>
              Apellidos
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setlastName(e.target.value);
                  announce("");
                }}
                placeholder="apellidos"
                required
              />
            </label>

            <label>
              Edad
              <input
                type="number"
                value={age}
                min={13}
                onChange={(e) => {
                  setage(e.target.value);
                  announce("");
                }}
                placeholder="edad"
                required
              />
            </label>

            <label>
              Correo
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  announce("");
                }}
                placeholder="correo electrónico"
                required
              />
            </label>
          </div>

          <div className="profile-buttons">
            <ButtonPrimary type="submit" disabled={!valid || loading}>
              {loading ? <Spinner size={16} /> : "Guardar cambios"}
            </ButtonPrimary>

            <ButtonPrimary
              type="button"
              onClick={() => navigate("/change-password")}
            >
              Cambiar contraseña
            </ButtonPrimary>

            <ButtonPrimary
              type="button"
              onClick={() => navigate("/profile")}
              style={{
                backgroundColor: "#444",
                color: "white",
              }}
            >
              Volver al perfil
            </ButtonPrimary>
          </div>

          <div className="visually-hidden" aria-live="polite" ref={liveRef}></div>
        </form>
      </div>
    </div>
  );
}
