import { useState } from "react";

interface StarRatingProps {
  rating?: number;
  onRate: (rating: number) => void;
}

export default function StarRating({ rating = 0, onRate }: StarRatingProps) {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? "active" : ""}`}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
