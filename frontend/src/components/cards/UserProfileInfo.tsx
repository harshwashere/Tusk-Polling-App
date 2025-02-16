import CharAvatar from "./CharAvatar";
import moment from "moment";

interface UserProfileInfoType {
  imgUrl: string;
  fullname: string;
  username: string;
  createdAt: string;
}

const UserProfileInfo = ({
  imgUrl,
  fullname,
  username,
  createdAt,
}: UserProfileInfoType) => {
  return (
    <div className="flex items-center gap-4">
      {imgUrl ? (
        <img src={imgUrl} alt="w-10 h-10 rounded-full border-none" />
      ) : (
        <CharAvatar
          fullname={fullname}
          style="text-[13px]"
          width={""}
          height={""}
        />
      )}

      <div>
        <p className="text-[18px] text-sm text-black font-medium leading-4">
          {fullname} <span className="mx-1 text-sm text-slate-500">•</span>
          <span className="text-[14px] text-sm text-slate-500">
            {" "}
            {createdAt && moment(createdAt).fromNow()}
          </span>
        </p>
        <span className="text-[12px] text-slate-500 leading-4">
          @{username}
        </span>
      </div>
    </div>
  );
};

export default UserProfileInfo;
