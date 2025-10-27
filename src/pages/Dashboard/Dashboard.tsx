// src/pages/dashboard/Dashboard.tsx
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Dashboard.scss";

interface Movie {
  id: number;
  url: string;
  image: string;
  category?: string;
  user?: {
    name?: string;
    url?: string;
  };
  video_files?: {
    link: string;
    quality?: string;
    file_type?: string;
  }[];
}

type GroupedMovies = Record<string, Movie[]>;

/**
 * Dashboard page
 *
 * Displays movies grouped by category.
 * Allows the user to view, filter by category, and mark favorites.
 * Includes a dropdown menu for navigation and logout.
 */
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [groupedMovies, setGroupedMovies] = useState<GroupedMovies>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const availableCategories = [
    "accion",
    "naturaleza",
    "deportes",
    "cine",
    "musica",
    "tecnologia",
    "urbano",
    "gastronomia",
    "otros",
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  // fetch movies from API
  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await api.get("/movies");

        if (Array.isArray(res.data)) {
          const grouped = res.data.reduce((acc: Record<string, Movie[]>, movie: Movie) => {
            const cat = movie.category ?? "otros";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(movie);
            return acc;
          }, {});
          setGroupedMovies(grouped);
        } else {
          setGroupedMovies(res.data);
        }
      } catch (err) {
        console.error("❌ error fetching movies:", err);
      }
    }
    fetchMovies();
  }, []);

  // fetch user favorites
  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    async function fetchFavorites() {
      try {
        const res = await api.get(`/favorites?userId=${userId}`);
        const favIds = Array.isArray(res.data) ? res.data.map((f: any) => f.video_id) : [];
        setFavorites(favIds);
      } catch (err) {
        console.error("❌ error fetching favorites:", err);
      }
    }

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (movie: Movie) => {
    if (!user?.id) return;
    const isFav = favorites.includes(movie.id);

    try {
      if (isFav) {
        await api.delete("/favorites/remove", { data: { userId: user.id, videoId: movie.id } });
        setFavorites((prev) => prev.filter((id) => id !== movie.id));
      } else {
        await api.post("/favorites/add", {
          userId: user.id,
          videoId: movie.id,
          videoUrl: movie.url,
          videoImage: movie.image,
        });
        setFavorites((prev) => [...prev, movie.id]);
      }
    } catch (err) {
      console.error("❌ error updating favorite:", err);
    }
  };

  const displayedGroups =
    selectedCategory && selectedCategory !== "favoritos" && groupedMovies[selectedCategory]
      ? { [selectedCategory]: groupedMovies[selectedCategory] }
      : selectedCategory === "favoritos"
      ? { favoritos: Object.values(groupedMovies).flat().filter((m) => favorites.includes(m.id)) }
      : groupedMovies;

  const handleSelectCategory = (cat: string | null) => {
    setSelectedCategory(cat);
    setShowCategories(false);
  };

  // handle clicks outside menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
        setShowCategories(false);
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnterMenu = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMenuOpen(true);
  };

  const handleMouseLeaveMenu = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setMenuOpen(false);
      setShowCategories(false);
    }, 2000);
  };

  return (
    <div className="dash-page">
      <div className="movies-container">
        <div className="header-row">
          <div className="user-info">
            <div className="avatar" aria-label="user profile" onClick={goToProfile}>
              {user?.firstName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <h2>welcome, {user?.firstName ?? "user"}</h2>
          </div>

          <div className="user-menu-wrapper" ref={menuRef}>
            <div
              className="hamburger-menu"
              onMouseEnter={handleMouseEnterMenu}
              onMouseLeave={handleMouseLeaveMenu}
            >
              <div className="menu-icon" ref={iconRef}>
                <span />
                <span />
                <span />
              </div>

              <div
                className={`menu-content ${menuOpen ? "show" : ""}`}
                onMouseEnter={handleMouseEnterMenu}
                onMouseLeave={handleMouseLeaveMenu}
              >
                <div className="menu-section">
                  <button
                    onClick={() => setShowCategories((prev) => !prev)}
                    className="menu-button"
                  >
                    📂 categorias
                  </button>

                  <div className={`categories-submenu ${showCategories ? "show" : ""}`}>
                    <button
                      className={selectedCategory === null ? "active" : ""}
                      onClick={() => handleSelectCategory(null)}
                    >
                      view all
                    </button>
                    <button
                      className={selectedCategory === "favoritos" ? "active" : ""}
                      onClick={() => handleSelectCategory("favoritos")}
                    >
                      ⭐ favoritos
                    </button>
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        className={selectedCategory === cat ? "active" : ""}
                        onClick={() => handleSelectCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => navigate("/aboutus")}>ℹ️ acerca de</button>
                <button onClick={handleLogout}>🚪 cerrar sesión</button>
              </div>
            </div>
          </div>
        </div>

        <div className="movies-scroll" role="region" aria-label="movie container">
          {Object.keys(displayedGroups).length === 0 ? (
            <div className="movies-placeholder">
              <p role="alert" aria-live="polite">
                loading movies...
              </p>
            </div>
          ) : (
            Object.entries(displayedGroups).map(([cat, catMovies]) => (
              <section className="category-section" key={cat}>
                <h3 className="category-title">{cat}</h3>
                <div className="movies-row" tabIndex={0}>
                  {catMovies.map((movie) => {
                    const videoLink =
                      movie.video_files?.find(
                        (file) => file.quality === "hd" || file.quality === "sd"
                      )?.link ?? movie.url ?? "";

                    const isFav = favorites.includes(movie.id);

                    return (
                      <div key={movie.id} className="movie-card">
                        <video className="movie-video" controls poster={movie.image}>
                          {videoLink && <source src={videoLink} type="video/mp4" />}
                          your browser does not support video playback.
                        </video>

                        <div className="movie-info">
                          <h4>{movie.user?.name ?? "unknown author"}</h4>
                          <a
                            href={movie.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="source-link"
                          >
                            view on pexels
                          </a>
                          <button
                            className={`favorite-btn ${isFav ? "favorited" : ""}`}
                            onClick={() => toggleFavorite(movie)}
                          >
                            {isFav ? "⭐" : "☆"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
