import { useCallback, useState, useEffect } from "react";
import { API_PATHS, getPollBookmarked } from "../../utils/helper";
import UserProfileInfo from "../cards/UserProfileInfo";
import PollActions from "./PollActions";
import PollContent from "./PollContent";
import { useUserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export interface Poll {
  [x: string]: any;
  id: string;
  question: string;
  type: string;
  options: string[];
  votes: number[];
  response?: string[];
  creator: {
    profileImgUrl: string;
    fullname: string;
    username: string;
  };
  userHasVoted?: boolean;
  closed?: boolean;
  createdAt: string;
  isBookmarked: boolean;
  toggleBookmark: () => void;
}

const PollCards = ({
  id,
  question,
  type,
  creator,
  userHasVoted = false,
  closed = false,
  createdAt,
}: Poll) => {
  const { user, onUserVoted } = useUserContext();

  const [isVoteComplete, setIsVoteComplete] = useState<boolean>(userHasVoted);
  const [pollClosed, setPollClosed] = useState<boolean>(closed);
  const [pollDeleted, setPollDeleted] = useState<boolean>(false);

  const [option, setOptions] = useState<{ _id: string; optionText: string }[]>([
    { _id: "1", optionText: "Option 1" },
    { _id: "2", optionText: "Option 2" },
  ]);

  const [pollResult, setPollResult] = useState<{
    options: string[];
    votes: number[];
    response?: string[];
  }>({
    options: [],
    votes: [],
  });

  const [rating, setRating] = useState<number>(0);
  const [userResponse, setUserResponse] = useState<string>("");
  const [selectedOptionIndex, setSelectOptionIndex] = useState<number>(-1);

  const isPollBookmarked = getPollBookmarked(id, user?.bookmarkedPolls || []);
  const isMyPoll = creator.username === user?.username;

  const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked);

  const toggleBookmark = () => {
    setPollBookmarked(!pollBookmarked);
  };

  const handleInput = (value: string | number) => {
    if (type === "rating") {
      if (typeof value === "number") {
        setRating(value);
      }
    } else if (type === "open-ended") {
      if (typeof value === "string") {
        setUserResponse(value);
      }
    } else {
      if (typeof value === "number") {
        setSelectOptionIndex(value);
      }
    }
  };

  const getPostData = useCallback(() => {
    if (type === "open-ended")
      return { responseText: userResponse, voterId: user?._id };

    if (type === "rating")
      return { responseText: rating - 1, voterId: user?._id };

    return { optionIndex: selectedOptionIndex, voterId: user?._id };
  }, [type, userResponse, rating, selectedOptionIndex, user]);

  const getPollDetail = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.GET_BY_ID(id));

      if (response.data) {
        const pollDetails = response.data;
        setPollResult({
          options: pollDetails.options || [],
          votes: pollDetails.votes.length || 0,
          response: pollDetails.response || [],
        });
      }
    } catch (error) {
      console.error(error || "Error submitting votes");
    }
  };

  const onVoteSubmit = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.POLLS.VOTE(id),
        getPostData()
      );
      console.log(response);
      getPollDetail();
      setIsVoteComplete(true);
      onUserVoted();
      toast.success("Vote submitted successfully!");
    } catch (error) {
      console.error(error || "Error submitting votes");
    }
  };

  return (
    !pollDeleted && (
      <div className="bg-slate-100/50 my-5 py-5 rounded-lg border border-slate-100 mx-auto">
        <div className="flex flex-wrap items-center justify-around">
          <UserProfileInfo
            imgUrl={creator.profileImgUrl}
            fullname={creator.fullname}
            username={creator.username}
            createdAt={createdAt}
          />

          <PollActions
            id={id}
            isVoteComplete={isVoteComplete}
            inputCaptured={
              !!(userResponse || selectedOptionIndex >= 0 || rating)
            }
            onVoteSubmit={onVoteSubmit}
            isBookmarked={pollBookmarked}
            toggleBookmark={toggleBookmark}
            isMyPoll={isMyPoll}
            pollClosed={pollClosed}
            onClosePoll={() => {}}
            onDelete={() => {}}
          />

          <div className="ml-14 mt-3">
            <p className="text-[15px] text-black leading-8">{question}</p>

            <div className="mt-4">
              {isVoteComplete || pollClosed ? (
                <>Show Result</>
              ) : (
                <PollContent
                  type={type}
                  option={option}
                  selectedOptionIndex={selectedOptionIndex}
                  onOptionSelect={handleInput}
                  rating={rating}
                  onRatingChange={handleInput}
                  userResponse={userResponse}
                  onResponseChange={handleInput}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default PollCards;
