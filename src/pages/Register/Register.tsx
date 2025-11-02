import React, { useRef, useState } from "react";
import InputField from "../../components/InputField";
import ButtonPrimary from "../../components/ButtonPrimary";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/AuthContext";
import { validatePassword, emailRegex } from "../../utils/validator";
import { toast } from "react-toastify";
import "./Register.scss";
import logo from "../../assets/images/logo.png";

/**
 * Register component
 *
 * Allows new users to create an account by providing first name, last name,
 * age, email, and password. Validates all fields before submission and provides
 * live accessibility feedback via aria-live region.
 *
 * Features:
 * - Validates age (≥ 13), email format, and password strength.
 * - Password hints show live feedback on password requirements.
 * - Confirm password must match the password field.
 * - Displays toast messages on success or errors.
 */
export default function Register() {
  const { signup } = useAuth();
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const liveRef = useRef<HTMLDivElement | null>(null);

  const pass = validatePassword(password);
  const ageValid = /^\d+$/.test(age) && Number(age) >= 13;
  const emailValid = emailRegex.test(email);
  const confirmMatch = password === confirmPassword && password.length > 0;
  const formValid =
    firstName.trim() &&
    lastName.trim() &&
    ageValid &&
    emailValid &&
    pass.valid &&
    confirmMatch;

  /**
   * Sets live feedback message for accessibility
   * @param msg Message to announce
   */
  function announce(msg: string) {
    if (liveRef.current) liveRef.current.textContent = msg;
  }

  /**
   * Handles form submission
   * - Validates all inputs
   * - Calls signup function from AuthContext
   * - Shows success toast and redirects to login
   * - Shows error messages if signup fails
   * @param e Form event
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ageNumber = Number(age);

    if (!firstName.trim() || !lastName.trim() || !ageValid || !emailValid || !pass.valid || !confirmMatch) {
      announce("Corrige los campos antes de continuar.");
      return;
    }
    if (isNaN(ageNumber) || ageNumber < 13) {
      announce("La edad debe ser un número mayor o igual a 13");
      return;
    }

    setLoading(true);
    try {
      await signup({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: ageNumber,
        email: email.trim(),
        password: password,
        confirmPassword: confirmPassword.trim(),
      });
      setLoading(false);
      toast.success("Cuenta creada con éxito");
      setTimeout(() => (window.location.href = "/login"), 400);
    } catch (err: any) {
      setLoading(false);
      if (err?.response?.status === 409) {
        announce("Este correo ya está registrado");
      } else if (err?.response?.status === 400) {
        announce("Datos inválidos, revisa el formulario");
      } else {
        announce("Inténtalo de nuevo más tarde");
        if (import.meta.env.DEV) console.error(err);
      }
    }
  }

  return (
    <div className="content-main">
      <div className="auth-page">

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-logo-wrapper">
            <img src={logo} alt="Logo DasakeMovies" className="auth-logo" />
          </div>
          <h1>Crear cuenta</h1>
          <p className="muted">Regístrate para acceder a todas las películas</p>

          <InputField
            id="nombre"
            label="Nombres"
            value={firstName}
            onChange={(e) => { setfirstName(e.target.value); announce(""); }}
          />

          <InputField
            id="apellidos"
            label="Apellidos"
            value={lastName}
            onChange={(e) => { setlastName(e.target.value); announce(""); }}
          />

          <InputField
            id="edad"
            label="Edad"
            type="number"
            value={age}
            onChange={(e) => { setAge(e.target.value); announce(""); }}
          />

          <InputField
            id="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => { setEmail(e.target.value); announce(""); }}
          />
          {!emailValid && email.length > 0 && <div className="field-error">Correo inválido</div>}

          <InputField
            id="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); announce(""); }}
          />
          <div className="password-hints">
            <small className={pass.length ? "ok" : ""}>≥ 8 caracteres/letras</small>
            <small className={pass.upper ? "ok" : ""}>1 mayúscula</small>
            <small className={pass.num ? "ok" : ""}>1 número</small>
            <small className={pass.special ? "ok" : ""}>1 carácter especial</small>
          </div>

          <InputField
            id="confirm"
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); announce(""); }}
          />
          {!confirmMatch && confirmPassword.length > 0 && (
            <div className="field-error">Las contraseñas no coinciden</div>
          )}

          <div className="actions">
            <ButtonPrimary type="submit" disabled={!formValid || loading}>
              {loading ? <Spinner size={16} /> : "Registrarse"}
            </ButtonPrimary>
          </div>

          <p className="muted">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>

          <div className="visually-hidden" aria-live="polite" ref={liveRef}></div>
        </form>
      </div>
    </div>
  );
}
