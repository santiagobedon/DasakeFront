import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./MovieDetail.scss";

interface Comment {
  id: string;
  user: string;
  userId: string;
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
  const [movieAverageRating, setMovieAverageRating] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

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

  // ========================
  // carga inicial
  // ========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // comentarios
        const commentsRes = await api.get(`/${movie.id}/comments`);
        const formattedComments = commentsRes.data.map((c: any) => ({
          id: c.id,
          user: c.user ?? "usuario",
          userId: c.userId ?? "",
          text: c.text,
        }));
        setComments(formattedComments);

        // calificaciones
        const ratingRes = await api.get(`/${movie.id}/rating`, { params: { userId: user?.id } });
        if (ratingRes.data) {
          if (ratingRes.data.userRating !== null) setRating(ratingRes.data.userRating);
          if (ratingRes.data.promedio !== undefined) setMovieAverageRating(ratingRes.data.promedio);
        }
      } catch (err) {
        console.error("❌ error al cargar datos de la película:", err);
      }
    };

    fetchData();
  }, [movie, user?.id]);

  // ========================
  // publicar comentario
  // ========================
  const handleSubmitComment = async () => {
    if (!comment.trim() || !user?.id) return;

    try {
      const res = await api.post("/comments", {
        userId: user.id,
        movieExternalId: movie.id,
        content: comment.trim(),
        title: movie.title,
        posterUrl: movie.image,
      });

      const newComment = res.data.data?.[0];
      setComments((prev) => [
        {
          id: newComment?.id ?? crypto.randomUUID(),
          user: user.firstName ?? "usuario",
          userId: user.id,
          text: comment.trim(),
        },
        ...prev,
      ]);
      setComment("");
    } catch (err) {
      console.error("❌ error al guardar comentario:", err);
    }
  };

  // ========================
  // editar comentario
  // ========================
  const handleEditComment = async (commentId: string) => {
    if (!editedText.trim() || !user?.id) return;

    try {
      await api.put(`/comments/${commentId}`, {
        userId: user.id,
        content: editedText.trim(),
      });

      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, text: editedText.trim() } : c))
      );
      setEditingCommentId(null);
      setEditedText("");
    } catch (err) {
      console.error("❌ error al editar comentario:", err);
    }
  };

  // ========================
  // eliminar comentario
  // ========================
  const handleDeleteComment = async (commentId: string) => {
    if (!user?.id) return;

    try {
      await api.delete(`/comments/${commentId}`, { data: { userId: user.id } });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("❌ error al eliminar comentario:", err);
    }
  };

  // ========================
  // calificación
  // ========================
  const handleRate = async (value: number) => {
    setRating(value);
    try {
      const res = await api.post("/ratings", {
        userId: user?.id,
        movieExternalId: movie.id,
        rating: value,
        title: movie.title,
        posterUrl: movie.image,
      });

      if (res.data?.promedioActualizado) {
        setMovieAverageRating(res.data.promedioActualizado);
      } else {
        const avgRes = await api.get(`/${movie.id}/rating`, { params: { userId: user?.id } });
        if (avgRes.data?.promedio) setMovieAverageRating(avgRes.data.promedio);
      }
    } catch (err) {
      console.error("❌ error al guardar calificación:", err);
    }
  };

  // ========================
  // render
  // ========================
  return (
    <div className="movie-detail">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← volver
      </button>

      <div className="video-section">
        <h2 className="movie-title">{movie.title}</h2>

        <video className="movie-player" controls poster={movie.image}>
          <source src={videoLink} type="video/mp4" />
          <track
            label="Español"
            kind="subtitles"
            srcLang="es"
            src={`/subtitles/${movie.id}_es.vtt`}
            default
          />
          <track
            label="Inglés"
            kind="subtitles"
            srcLang="en"
            src={`/subtitles/${movie.id}_en.vtt`}
          />
          tu navegador no soporta la reproducción de video.
        </video>
      </div>

      <div className="interaction-section">
        <div className="rating-section">
          <h3>califica este video:</h3>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={`star-${star}`}
                className={`star ${rating && rating >= star ? "filled" : ""}`}
                onClick={() => handleRate(star)}
              >
                ★
              </span>
            ))}
          </div>

          {movieAverageRating !== null && (
            <div className="average-rating">
              <span className="average-number">{movieAverageRating.toFixed(1)}</span>
              <div className="progress-bar">
                <div
                  className="fill"
                  style={{ width: `${(movieAverageRating / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="comment-input-section">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="escribe un comentario..."
          />
          <button onClick={handleSubmitComment}>publicar</button>
        </div>

        <div className="comments-container">
          {comments.length === 0 ? (
            <p className="no-comments">sé el primero en comentar</p>
          ) : (
            comments.map((c) => (
              <div className="comment" key={`comment-${c.id}`}>
                <div className="comment-header">
                  <strong>{c.user}:</strong>
                  {c.userId === user?.id && (
                    <div
                      className="menu-icon"
                      onClick={() => setMenuOpenId(menuOpenId === c.id ? null : c.id)}
                    >
                      ⋮
                      {menuOpenId === c.id && (
                        <div className="menu-dropdown">
                          <button
                            onClick={() => {
                              setEditingCommentId(c.id);
                              setEditedText(c.text);
                              setMenuOpenId(null);
                            }}
                          >
                            editar
                          </button>
                          <button onClick={() => handleDeleteComment(c.id)}>eliminar</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {editingCommentId === c.id ? (
                  <div className="edit-section">
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                    />
                    <button onClick={() => handleEditComment(c.id)}>guardar</button>
                    <button onClick={() => setEditingCommentId(null)}>cancelar</button>
                  </div>
                ) : (
                  <p>{c.text}</p>
                )}
              </div>
            ))
          )}
          <div ref={commentsEndRef}></div>
        </div>
      </div>
    </div>
  );
}
