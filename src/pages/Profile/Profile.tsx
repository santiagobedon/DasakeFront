import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import ButtonPrimary from "../../components/ButtonPrimary";
import Spinner from "../../components/Spinner";
import "./Profile.scss";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="profile-page">
        <p role="alert" aria-live="polite">cargando usuario...</p>
      </div>
    );
  }

  const handleEdit = () => navigate("/profile/edit");
  const handleBack = () => navigate("/Dashboard");

  const openModal = () => {
    setModalOpen(true);
    setPassword("");
    setConfirmText("");
  };

  const closeModal = () => setModalOpen(false);

  const handleDelete = async () => {
    if (confirmText !== "ELIMINAR") {
      toast.error('debes escribir "ELIMINAR" para continuar');
      return;
    }
    setLoading(true);
    try {
      await api.delete(`/users/${user.id}`, { data: { password } });
      toast.success("Cuenta eliminada");
      logout();
      navigate("/inicio");
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("contraseña incorrecta");
      } else if (err.response?.status === 404) {
        toast.error("cuenta no encontrada");
      } else {
        toast.error("ocurrió un error, intenta más tarde");
        if (import.meta.env.DEV) console.error("error eliminando cuenta:", err);
      }
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Perfil de {user.firstName} {user.lastName}</h2>

        <section className="profile-details">
          <div className="detail-row"><strong>Nombres:</strong> <span>{user.firstName}</span></div>
          <div className="detail-row"><strong>Apellidos:</strong> <span>{user.lastName}</span></div>
          <div className="detail-row"><strong>Edad:</strong> <span>{user.age}</span></div>
          <div className="detail-row"><strong>Correo:</strong> <span>{user.email}</span></div>
        </section>

        <div className="profile-buttons">
          <ButtonPrimary onClick={handleEdit} aria-label="editar perfil">
            Editar perfil
          </ButtonPrimary>
          <ButtonPrimary onClick={handleBack} aria-label="volver al inicio">
            Inicio
          </ButtonPrimary>
          <ButtonPrimary onClick={openModal} aria-label="eliminar cuenta" className="danger-btn">
            Eliminar cuenta
          </ButtonPrimary>
        </div>

        <div aria-live="polite" className="sr-only" id="profile-messages"></div>
      </div>

      {/* modal eliminar cuenta */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Eliminar cuenta</h3>
            <p>Para eliminar tu cuenta escribe <strong>ELIMINAR</strong> y tu contraseña:</p>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder='Escribe "ELIMINAR"'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="modal-actions">
              <ButtonPrimary onClick={closeModal} disabled={loading}>Cancelar</ButtonPrimary>
              <ButtonPrimary
                onClick={handleDelete}
                disabled={loading || !password || confirmText !== "ELIMINAR"}
              >
                {loading ? <Spinner size={16} /> : "Eliminar"}
              </ButtonPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
