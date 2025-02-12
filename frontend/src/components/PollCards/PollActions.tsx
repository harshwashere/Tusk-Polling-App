import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import AuthLoader from "../layout/AuthLoader";

interface PropType {
  id: string;
  isVoteComplete: boolean;
  inputCaptured: boolean;
  onVoteSubmit: () => Promise<void>;
  isBookmarked: boolean;
  toggleBookmark: () => void;
  isMyPoll?: boolean;
  pollClosed: boolean;
  onClosePoll?: () => void;
  onDelete?: () => void;
}

const PollActions = ({
  isVoteComplete,
  inputCaptured,
  onVoteSubmit,
  isBookmarked,
  toggleBookmark,
  pollClosed,
}: PropType) => {
  const [loading, setLoading] = useState(false);

  const handleVoteClick = async () => {
    setLoading(true);
    try {
      await onVoteSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {(isVoteComplete || pollClosed) && (
        <div className="text-[11px] font-medium text-slate-600 bg-sky-700/10 px-3 py-1 rounded-md">
          {pollClosed ? "Closed" : "Voted"}
        </div>
      )}

      <button className="icon-btn" onClick={toggleBookmark}>
        {isBookmarked ? <FaBookmark className="text-blue-400" /> : <FaRegBookmark />}
      </button>

      {inputCaptured && !isVoteComplete && (
        <button className="btn-small ml-auto" onClick={handleVoteClick} disabled={loading}>
          {loading ? <AuthLoader /> : "Submit"}
        </button>
      )}
    </div>
  );
};

export default PollActions;
