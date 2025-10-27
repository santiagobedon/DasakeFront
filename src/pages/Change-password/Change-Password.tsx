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

  const pass = validatePassword(password);
  const valid =
    current.trim().length > 0 && pass.valid && password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      if (!pass.valid)
        liveRef.current!.textContent =
          "the new password does not meet the requirements";
      else if (password !== confirm)
        liveRef.current!.textContent = "passwords do not match";
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
        liveRef.current!.textContent = "current password is incorrect";
      } else if (err?.response?.status === 401) {
        window.location.href = "/login";
      } else {
        liveRef.current!.textContent = "an error occurred, try again later";
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>change password</h1>

        <InputField
          id="current-pass"
          label="current password"
          type="password"
          value={current}
          onChange={(e) => {
            setCurrent(e.target.value);
            liveRef.current!.textContent = "";
          }}
        />

        <InputField
          id="new-pass"
          label="new password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            liveRef.current!.textContent = "";
          }}
        />

        <InputField
          id="confirm-pass"
          label="confirm password"
          type="password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            liveRef.current!.textContent = "";
          }}
        />

        <div className="actions">
          <ButtonPrimary type="submit" disabled={!valid || loading}>
            {loading ? <Spinner /> : "save changes"}
          </ButtonPrimary>
        </div>

        <div
          className="visually-hidden"
          aria-live="polite"
          ref={liveRef}
        ></div>
      </form>
      <div className="brand">
        <div className="brand-logo" aria-hidden />
        <div className="brand-text">dasakemovies</div>
      </div>
    </div>
  );
}
