import { useState } from "react";
import { useUserContext } from "../../context/userContext";
import { getPollBookmarked } from "../../utils/helper";
import UserProfileInfo from "../cards/UserProfileInfo";

interface Poll {
  id: string;
  question: string;
  type: string;
  options: string[];
  votes: any[];
  response?: any[];
  creatorProfileImg: string;
  creatorName: string;
  creatorUsername: string;
  userHasVoted?: boolean;
  closed?: boolean;
  createdAt: string;
}
const PollCards = ({
  id,
  question,
  type,
  options,
  votes,
  response,
  creatorProfileImg,
  creatorName,
  creatorUsername,
  userHasVoted,
  closed,
  createdAt,
}: Poll) => {
  const { user } = useUserContext();

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [rating, setRating] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);
  const [pollResult, setPollResult] = useState({
    options,
    votes,
    response,
  });

  const isPollBookmarked = getPollBookmarked(
    id,
    user?.bookmarkedPolls || []
  );

  const [pollBokmarked, setPollBookmarked] = useState(isPollBookmarked);
  const [pollClosed, setPollClosed] = useState(pollClosed || false);
  const [pollDeleted, setPollDeleted] = useState(false);

  return (
    !pollDeleted && (
      <div className="bg-slate-100/50 my-5 py-5 rounde-lg border border-slate-100 mx-auto">
        <div className="flex items-start justify-between">
          <UserProfileInfo
            imgUrl={creatorProfileImg}
            fullname={creatorName}
            username={creatorUsername}
            createdAt={createdAt}
          />
        </div>
        {question}
      </div>
    )
  );
};

export default PollCards;
