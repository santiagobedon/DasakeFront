// src/pages/aboutus/AboutUs.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutUs.scss";
import logo from "../../assets/images/logo.png";

// placeholders para las fotos del equipo
const santiago = "https://via.placeholder.com/100";
const kevin = "https://via.placeholder.com/100";
const daniela = "https://via.placeholder.com/100";
const giankarlo = "https://via.placeholder.com/100";

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="aboutus-page">
      <div className="aboutus-header">
        <img src={logo} alt="Logo de la empresa" className="aboutus-logo" />
        <h1>Sobre Nosotros</h1>
        <button className="back-button" onClick={() => navigate(-1)}>
            Volver
        </button>
      </div>

      <div className="aboutus-content">
        <section className="aboutus-description">
          <p>
            Somos una empresa de desarrollo dedicada a crear soluciones web
            innovadoras y elegantes. En este proyecto, hemos desarrollado un
            aplicativo web para que los usuarios puedan explorar y disfrutar de
            películas de manera intuitiva y moderna.
          </p>
        </section>

        <section className="aboutus-mv">
          <div className="mv-item">
            <h2>Misión</h2>
            <p>
              Proporcionar experiencias digitales de calidad que conecten a
              los usuarios con el entretenimiento cinematográfico de forma
              sencilla y atractiva.
            </p>
          </div>
          <div className="mv-item">
            <h2>Visión</h2>
            <p>
              Ser referentes en el desarrollo de aplicaciones web de
              entretenimiento, combinando tecnología, diseño y usabilidad
              para crear experiencias memorables.
            </p>
          </div>
        </section>

        <section className="aboutus-team">
          <h2>Nuestro Equipo</h2>
          <div className="team-grid">
            <div className="team-card">
              <img src={santiago} alt="Santiago Bedon" />
              <h3>Santiago Bedon</h3>
              <p>Backend Developer & Product Owner</p>
            </div>
            <div className="team-card">
              <img src={kevin} alt="Kevin C. Molino" />
              <h3>Kevin C. Molino</h3>
              <p>Frontend Developer</p>
            </div>
            <div className="team-card">
              <img src={daniela} alt="Daniela Martinez" />
              <h3>Daniela Martinez</h3>
              <p>Database Developer</p>
            </div>
            <div className="team-card">
              <img src={giankarlo} alt="Giankarlo Cifuentes" />
              <h3>Giankarlo Cifuentes</h3>
              <p>Designer & QA</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
