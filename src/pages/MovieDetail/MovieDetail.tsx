import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./MovieDetail.scss";

interface Comment {
  user: string;
  text: string;
}

export default function MovieDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const movie = location.state?.movie;

  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  if (!movie) {
    return (
      <div className="movie-detail">
        <p>no se encontró información de la película.</p>
        <button onClick={() => navigate("/dashboard")}>volver</button>
      </div>
    );
  }

  const videoLink =
    movie.video_files?.find((f: any) => f.quality === "hd" || f.quality === "sd")?.link ??
    movie.url ??
    "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commentsRes = await api.get(`/${movie.id}/comments`);
        setComments(commentsRes.data);

        const ratingRes = await api.get(`/${movie.id}/rating`, { params: { userId: user?.id } });
        if (ratingRes.data && ratingRes.data.userRating) {
          setRating(ratingRes.data.userRating);
        }
      } catch (err) {
        console.error("❌ error al cargar datos de la película:", err);
      }
    };

    fetchData();
  }, [movie, user?.id]);

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    const newComment: Comment = { user: user?.firstName ?? "usuario", text: comment.trim() };
    setComments((prev) => [newComment, ...prev]);
    setComment("");

    try {
      await api.post("/comments", {
        userId: user?.id,
        movieExternalId: movie.id,
        content: newComment.text,
        title: movie.title,
        posterUrl: movie.image,
      });
    } catch (err) {
      console.error("❌ error al guardar comentario:", err);
    }
  };

  const handleRate = async (value: number) => {
    setRating(value);
    try {
      await api.post("/ratings", {
        userId: user?.id,
        movieExternalId: movie.id,
        rating: value,
        title: movie.title,
        posterUrl: movie.image,
      });
    } catch (err) {
      console.error("❌ error al guardar calificación:", err);
    }
  };

  return (
    <div className="movie-detail">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← volver
      </button>

      <div className="video-section">
        <h2 className="movie-title">{movie.title}</h2>
        <video className="movie-player" controls poster={movie.image}>
          <source src={videoLink} type="video/mp4" />
          tu navegador no soporta la reproducción de video.
        </video>
      </div>

      <div className="interaction-section">
        <div className="rating-section">
          <h3>califica este video:</h3>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${rating && rating >= star ? "filled" : ""}`}
                onClick={() => handleRate(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="comment-input-section">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="escribe un comentario..."
          />
          <button onClick={handleSubmitComment}>publicar</button>
        </div>

        {/* 🔹 nuevo contenedor con scroll para los comentarios */}
        <div className="comments-container">
          {comments.length === 0 ? (
            <p className="no-comments">sé el primero en comentar</p>
          ) : (
            comments.map((c, index) => (
              <div className="comment" key={index}>
                <strong>{c.user}:</strong>
                <p>{c.text}</p>
              </div>
            ))
          )}
          <div ref={commentsEndRef}></div>
        </div>
      </div>
    </div>
  );
}
