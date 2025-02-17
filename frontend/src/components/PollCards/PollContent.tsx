import Rating from "./Rating";
import OptionInputTitle, { OptionRatingInputTitle } from "./OptionInputTitle";
import ImageOptionInputTile from "./ImageOptionInputTile";

export interface Option {
  _id: string;
  optiontext:
    | {
        optiontext: string;
      }
    | string;
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
  const getOptionText = (option: Option) => {
    return typeof option.optiontext === "string"
      ? option.optiontext
      : option.optiontext.optiontext;
  };

  switch (type) {
    case "single-choice":
      return (
        <>
          {option.map((item, index) => (
            <OptionInputTitle
              key={item._id}
              isSelected={selectedOptionIndex === index}
              label={getOptionText(item)}
              onSelect={async () => onOptionSelect(index)}
            />
          ))}
        </>
      );

    case "yes/no":
      return (
        <>
          {option.map((opt, index) => (
            <OptionRatingInputTitle
              key={opt._id}
              isSelected={selectedOptionIndex === index}
              label={getOptionText(opt)}
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
              imgUrl={getOptionText(option) || ""}
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
