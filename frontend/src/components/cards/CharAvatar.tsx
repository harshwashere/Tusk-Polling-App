import { getInitials } from "../../utils/helper";

interface PropsType {
  fullname: string;
  width: string;
  height: string;
  style: string;
}

const CharAvatar = ({ fullname, width, height, style }: PropsType) => {
  return (
    <div
      className={`${width || "w-12"} ${height || "h-12"} ${
        style || ""
      } flex items-center justify-center rounded-full text-gray-900 font-medium bg-gray-100 `}
    >
      {getInitials(fullname || "")}
    </div>
  );
};

export default CharAvatar;
