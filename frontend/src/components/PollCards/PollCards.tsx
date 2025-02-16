import { useCallback, useEffect, useState } from "react";
import { API_PATHS, getPollBookmarked } from "../../utils/helper";
import UserProfileInfo from "../cards/UserProfileInfo";
import PollActions from "./PollActions";
import PollContent, { Option } from "./PollContent";
import { useUserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import PollResultContent from "./PollResultContent";

export interface Poll {
  [x: string]: any;
  id: string;
  question: string;
  type: string;
  options: Option[];
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
  options,
  creator,
  userHasVoted,
  closed = false,
  createdAt,
}: Poll) => {
  const { user, onUserVoted, toggleBookmarkId, onPollCreateOrDelete } =
    useUserContext();

  const [isVoteComplete, setIsVoteComplete] = useState<boolean>(
    userHasVoted || false
  );
  const [pollClosed, setPollClosed] = useState<boolean>(closed);
  const [pollDeleted, setPollDeleted] = useState<boolean>(false);

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

    return { optionindex: selectedOptionIndex, voterId: user?._id };
  }, [type, userResponse, rating, selectedOptionIndex, user]);

  const getPollDetail = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.GET_BY_ID(id));
      if (response.data) {
        setPollResult((prev) => ({
          ...prev,
          options: response.data.options || [],
          votes: response.data.voters || [],
          response: response.data.response || [],
        }));
      }
    } catch (error) {
      console.error(error || "Error fetching poll details");
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

  const toggleBookmarks = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.BOOKMARK(id));

      toggleBookmarkId(id);
      setPollBookmarked((prev) => !prev);

      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const closePoll = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(id));

      if (response.data) {
        setPollClosed(true);
        toast.success(response.data?.message || "Poll Deleted Successfully");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later!!");
      console.error("Something went wrong. Please try again later!!", error);
    }
  };

  const deletePoll = async () => {
    try {
      const response = await axiosInstance.delete(API_PATHS.POLLS.DELETE(id));

      if (response.data) {
        setPollDeleted(true);
        onPollCreateOrDelete();
        toast.success(response.data?.message || "Poll Deleted Successfully");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later!!");
      console.error("Something went wrong. Please try again later!!", error);
    }
  };

  useEffect(() => {
    if (isVoteComplete || pollClosed) {
      getPollDetail();
    }
  }, [isVoteComplete, pollClosed]);

  return (
    !pollDeleted && (
      <div className="bg-slate-100/50 my-5 py-5 rounded-lg border border-slate-100 mx-auto pl-5 pr-5">
        <div className="flex items-start justify-between">
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
            toggleBookmark={toggleBookmarks}
            isMyPoll={isMyPoll}
            pollClosed={pollClosed}
            onClosePoll={closePoll}
            onDelete={deletePoll}
            option={options}
          />
        </div>

        <div className="ml-14 mt-3">
          <p className="text-[15px] text-black leading-8">{question}</p>

          <div className="mt-4">
            {isVoteComplete || pollClosed ? (
              <PollResultContent
                type={type}
                option={pollResult.options.map((opt, index) => ({
                  _id: index.toString(),
                  optionText: opt,
                  votes: pollResult.votes[index] || 0,
                }))}
                voters={
                  pollResult.votes?.reduce((acc, curr) => acc + curr, 0) || 0
                }
                response={pollResult.response || []}
              />
            ) : (
              <PollContent
                type={type}
                option={options}
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
    )
  );
};

export default PollCards;
