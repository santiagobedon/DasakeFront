import { useEffect, useState } from "react";
import axios from "axios";

interface CommentSectionProps {
  movieId: string;
  title: string;
  posterUrl: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
}

export default function CommentSection({
  movieId,
  title,
  posterUrl,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const userId = localStorage.getItem("userId");

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/movies/comments/${movieId}?title=${title}&posterUrl=${posterUrl}`
      );
      setComments(res.data);
    } catch (err) {
      console.error("error al obtener comentarios:", err);
    }
  };

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post("http://localhost:3000/api/movies/comments", {
        userId,
        movieExternalId: movieId,
        content: newComment,
        title,
        posterUrl,
      });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("error al agregar comentario:", err);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await axios.delete("http://localhost:3000/api/movies/comments", {
        data: { commentId, userId },
      });
      fetchComments();
    } catch (err) {
      console.error("error al eliminar comentario:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  return (
    <div className="comment-section">
      <h3>comentarios</h3>
      <div className="comments-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-item">
            <p>{c.content}</p>
            {c.user_id === userId && (
              <button onClick={() => handleDelete(c.id)}>eliminar</button>
            )}
          </div>
        ))}
      </div>

      <div className="add-comment">
        <textarea
          placeholder="escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAdd}>publicar</button>
      </div>
    </div>
  );
}
