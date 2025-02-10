import Rating from "./Rating";
import OptionInputTitle from "./OptionInputTitle";
import ImageOptionInputTile from "./ImageOptionInputTile";

interface Option {
  _id: string;
  optionText: string;
}

interface PollContentProps {
  type: string;
  option: Option[];
  selectedOptionIndex: number | null;
  onOptionSelect: (index: number) => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  userResponse?: string;
  onResponseChange?: (response: string) => void;
}

const PollContent = ({
  type,
  option,
  selectedOptionIndex,
  onOptionSelect,
  rating,
  onRatingChange,
  userResponse,
  onResponseChange,
}: PollContentProps) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
      return (
        <>
          {option.map((opt, index) => (
            <OptionInputTitle
              key={opt._id}
              isSelected={selectedOptionIndex === index}
              label={opt.optionText}
              onSelect={async () => onOptionSelect(index)}
            />
          ))}
        </>
      );

    case "image-based":
      return (
        <div className="grid grid-cols-2 gap-4">
          {option.map((option, index) => (
            <ImageOptionInputTile
              key={option._id}
              isSelected={selectedOptionIndex === index}
              imgUrl={option.optionText || ""}
              onSelect={() => onOptionSelect(index)}
            />
          ))}
        </div>
      );

    case "rating":
      return <Rating value={rating} onChange={onRatingChange} />;

    case "open-ended":
      return (
        <textarea
          className="w-full text-[13px] text-black outline-none bg-slate-200/80 p-2 rounded-md mt-2"
          rows={4}
          value={userResponse}
          onChange={(e) => onResponseChange && onResponseChange(e.target.value)}
          placeholder="Your response"
        />
      );

    default:
      return <p>Invalid poll type</p>;
  }
};

export default PollContent;
