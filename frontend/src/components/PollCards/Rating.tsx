import { useState } from "react";
import { HiMiniStar } from "react-icons/hi2";

interface PropsType {
  maxStars?: number;
  value?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

const Rating = ({
  maxStars = 5,
  value = 0,
  onChange,
  readOnly = false,
}: PropsType) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating); // Notify parent component of the rating change
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readOnly) setHoverValue(rating); // Update hover value on mouse enter
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverValue(0); // Reset hover value on mouse leave
  };

  return (
    <div
      className={`flex gap-2 ${readOnly ? "cursor-default" : "cursor-pointer"}`}
    >
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className={`text-3xl transition-colors cursor-pointer ${
              starValue <= (hoverValue || value)
                ? "text-yellow-500"
                : "text-gray-400"
            }`}
          >
            <HiMiniStar />
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
