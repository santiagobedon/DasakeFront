import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import ButtonPrimary from "../../components/ButtonPrimary";
import "./Profile.scss";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  function announce(msg: string) {
    if (liveRef.current) liveRef.current.textContent = msg;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return announce("corrige los campos antes de continuar");

    try {
      setLoading(true);
      announce("guardando cambios...");
      if (!user) return <p>cargando...</p>;
      const res = await api.put(`/users/${user.id}`, {
        firstName,
        lastName,
        age,
        email,
      });

      if (res.status === 200) {
        toast.success("perfil actualizado");
        await refreshMe();
        setTimeout(() => navigate("/profile"), 500);
      }
    } catch (err: any) {
      if (err?.response?.status === 409) {
        announce("el correo ya está registrado");
      } else if (err?.response?.status === 401) {
        window.location.href = "/login";
      } else {
        announce("ocurrió un error, intenta más tarde");
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
    <div className="profile-page">
      <form className="profile-card" onSubmit={handleSave} noValidate>
        <h2>editar perfil</h2>

        <div className="profile-info">
          <label>
            firstNames
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setfirstName(e.target.value);
                announce("");
              }}
              placeholder="firstNames"
              required
            />
          </label>

          <label>
            lastName
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setlastName(e.target.value);
                announce("");
              }}
              placeholder="Apellidos"
              required
            />
          </label>

          <label>
            age
            <input
              type="number"
              value={age}
              min={13}
              onChange={(e) => {
                setage(e.target.value);
                announce("");
              }}
              placeholder="Edad"
              required
            />
          </label>

          <label>
            correo
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                announce("");
              }}
              placeholder="Correo electrónico"
              required
            />
          </label>
        </div>

        <ButtonPrimary type="submit" disabled={!valid || loading}>
          {loading ? <Spinner size={16} /> : "guardar cambios"}
        </ButtonPrimary>

        <div className="visually-hidden" aria-live="polite" ref={liveRef}></div>
      </form>
    </div>
  );
}
