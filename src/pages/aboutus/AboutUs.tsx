// src/pages/aboutus/AboutUs.tsx
import { useNavigate } from "react-router-dom";
import "./AboutUs.scss";
import logo from "../../assets/images/logo.png";
import Santiago from "../../assets/images/Santiago.png";
import Kevin from "../../assets/images/Kevin.jpg";
import Gianka from "../../assets/images/Gianka.jpg";

/**
 * AboutUs page
 *
 * Displays information about the company, mission, vision, and team members.
 * Includes a back button to navigate to the previous page.
 */
export default function AboutUs() {
  const navigate = useNavigate();

  // placeholder for team member not available
  const daniela = "https://via.placeholder.com/100";

  return (
    <div className="aboutus-page">
      <div className="aboutus-header">
        <img src={logo} alt="Company Logo" className="aboutus-logo" />
        <h1>About Us</h1>
        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="aboutus-content">
        <section className="aboutus-description">
          <p>
            We are a development company dedicated to creating innovative and
            elegant web solutions. In this project, we developed a web
            application for users to explore and enjoy movies in an intuitive
            and modern way.
          </p>
        </section>

        <section className="aboutus-mv">
          <div className="mv-item">
            <h2>Mission</h2>
            <p>
              Provide high-quality digital experiences that connect users with
              cinematic entertainment in a simple and engaging way.
            </p>
          </div>
          <div className="mv-item">
            <h2>Vision</h2>
            <p>
              Become a reference in web entertainment applications by combining
              technology, design, and usability to create memorable experiences.
            </p>
          </div>
        </section>

        <section className="aboutus-team">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-card">
              <img src={Santiago} alt="Santiago Bedon" />
              <h3>Santiago Bedon</h3>
              <p>Backend Developer & Product Owner</p>
            </div>
            <div className="team-card">
              <img src={Kevin} alt="Kevin C. Molina" />
              <h3>Kevin C. Molina</h3>
              <p>Frontend Developer</p>
            </div>
            <div className="team-card">
              <img src={daniela} alt="Daniela Martinez" />
              <h3>Daniela Martinez</h3>
              <p>Database Developer</p>
            </div>
            <div className="team-card">
              <img src={Gianka} alt="Giankarlo Cifuentes" />
              <h3>Giankarlo Cifuentes</h3>
              <p>Designer & QA</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
