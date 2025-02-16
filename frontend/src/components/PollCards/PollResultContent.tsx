import moment from "moment";
import CharAvatar from "../cards/CharAvatar";

interface PollOptionType {
  _id: string;
  optionText: string;
  votes: number;
}

interface PollResultContentType {
  type: string;
  option: PollOptionType[];
  voters: number;
  response?: any[];
}

interface PollOptionVoteResultType {
  label: string;
  optionVotes: number;
  totalVotes: number;
  imgUrl: string;
}

interface OpenEndedPollResponseType {
  profileImgUrl: string;
  userFullName: string;
  response: string;
  createdAt: string;
}

const PollOptionVoteResult = ({
  label,
  optionVotes,
  totalVotes,
}: PollOptionVoteResultType) => {
  const progress =
    totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;

  return (
    <div className="w-full bg-slate-200/80 rounded-md h-6 relative mb-3">
      <div
        className="bg-sky-900/10 h-6 rounded-md"
        style={{ width: `${progress}%` }}
      ></div>
      <span className="absolute inset-0 flex items-center justify-between text-gray-800 text-[12px] font-medium mx-4">
        {label} <span className="text-[11px] text-slate-500">{progress} %</span>
      </span>
    </div>
  );
};

const ImagePollResult = ({
  imgUrl,
  optionVotes,
  totalVotes,
}: PollOptionVoteResultType) => {
  return (
    <>
      <div>
        <div className="w-full bg-gray-800 flex items-center gap-2 mb-4 rounded-md overflow-hidden">
          <img src={imgUrl} alt="" className="w-full h-36 object-contain" />
        </div>

        <PollOptionVoteResult
          optionVotes={optionVotes}
          totalVotes={totalVotes}
          imgUrl=""
          label=""
        />
      </div>
    </>
  );
};

const OpenEndedPollResponse = ({
  profileImgUrl,
  userFullName,
  response,
  createdAt,
}: OpenEndedPollResponseType) => {
  return (
    <div className="mb-8 ml-3">
      <div className="flex gap-3">
        {profileImgUrl ? (
          <>
            <img src={profileImgUrl} alt="" className="w-8 h-8 rounded-full" />
          </>
        ) : (
          <CharAvatar
            fullname={userFullName}
            style="text-[10px] bg-sky-800/40"
            width="2rem"
            height="2rem"
          />
        )}

        <p className="text-[13px] text-black">
          {userFullName}{" "}
          <span className="mx-1 text-[10px] text-slate-500">•</span>
          <span className="text-[10px] text-slate-500">{createdAt}</span>
        </p>
      </div>

      <p className="text-xs text-slate-700 -mt-2 ml-[44px]">{response}</p>
    </div>
  );
};

const PollResultContent = ({
  type,
  option,
  response,
  voters,
}: PollResultContentType) => {
  switch (type) {
    case "image-based":
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            {option.map((item) => (
              <ImagePollResult
                key={item._id}
                imgUrl={item.optionText || ""}
                optionVotes={item.votes}
                totalVotes={voters || 0}
                label=""
              />
            ))}
          </div>
        </>
      );

    case "rating":
      return (
        <>
          {option.map((opt) => (
            <PollOptionVoteResult
              key={opt._id}
              label={`${opt.optionText} ${type === "rating" ? "Star" : ""}`}
              optionVotes={opt.votes}
              totalVotes={voters || 0}
              imgUrl=""
            />
          ))}
        </>
      );

    case "open-ended":
      return response?.map((response) => {
        return (
          <>
            <OpenEndedPollResponse
              key={response._id}
              profileImgUrl={response.voterId?.profileImgUrl}
              userFullName={response.voterId?.fullName || ""}
              response={response.responseText || ""}
              createdAt={
                response.createdAt ? moment(response.createdAt).fromNow() : ""
              }
            />
          </>
        );
      });

    default:
      break;
  }
  return (
    <>
      {/* {["single-choice", "yes/no", "rating", "image-based"].includes(type) &&
        } */}
    </>
  );
};

export default PollResultContent;
