import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  className?: string;
}

const RatingStars = ({
  rating,
  onRatingChange,
  readOnly = false,
  className,
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rate: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(rate);
    }
  };

  const handleMouseEnter = (rate: number) => {
    if (!readOnly) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-5 w-5",
            (hoverRating || rating) >= star
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300",
            !readOnly && "cursor-pointer"
          )}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};

export default RatingStars;
