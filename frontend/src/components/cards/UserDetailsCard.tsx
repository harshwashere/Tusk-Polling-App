import CharAvatar from "./CharAvatar";

type UserDetailsCardType = {
  profileimageUrl: string;
  fullname: string;
  username: string;
  totalPollSVotes: number;
  totalPollsCreated: number;
  totalPollsBookmarked: number;
};

type PropsType = {
  label: string;
  value: number;
};

const StatsInfo = ({ label, value }: PropsType) => {
  return (
    <div>
      <p className="font-medium text-gray-950">{value}</p>
      <p className="text-xs text-slate-700/80 mt-[2px]">{label}</p>
    </div>
  );
};

const UserDetailsCard = ({
  profileimageUrl,
  fullname,
  username,
  totalPollSVotes,
  totalPollsCreated,
  totalPollsBookmarked,
}: UserDetailsCardType) => {
  return (
    <div className="bg-slate-100/50 rounded-lg mt-16 overflow-hidden">
      <div
        className="w-full h-32 flex justify-center relative"
        style={{
          background:
            "url('https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute bottom-10 rounded-full overflow-hidden border-2 border-blue-400">
          {profileimageUrl ? <img
            src={
              profileimageUrl
                ? `${profileimageUrl}`
                : ""
            }
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          /> : <CharAvatar fullname={fullname} width="w-20" height="h-20" style="text-xl" />}
        </div>
      </div>

      <div className="mt-12 px-5">
        <div className="text-center pt-1">
          <h5 className="text-lg text-gray-950 font-medium leading-6">
            {fullname}
          </h5>

          <span className="text-[13px] font-medium text-slate-700/60">
            @{username}
          </span>
        </div>

        <div className="flex items-center justify-center gap-5 flex-wrap my-6">
          <StatsInfo label="Polls Created" value={totalPollsCreated || 0} />
          <StatsInfo label="Polls Voted" value={totalPollSVotes || 0} />
          <StatsInfo
            label="Polls Bookmarked"
            value={totalPollsBookmarked || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsCard;
