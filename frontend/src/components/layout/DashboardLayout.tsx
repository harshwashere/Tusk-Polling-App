import { ReactNode } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import UserDetailsCard from "../cards/UserDetailsCard";
import { useUserContext } from "../../context/userContext";

type PropsType = {
  children: ReactNode;
  activeMenu: string;
};

const DashboardLayout = ({ children, activeMenu }: PropsType) => {
  const { user } = useUserContext();

  return (
    <div>
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5">{children}</div>

          <div className="hidden md:block mr-5">
            <UserDetailsCard
              profileimageUrl={(user && user.profileimageUrl) || ""}
              fullname={(user && user?.fullname) || ""}
              username={(user && user?.username) || ""}
              totalPollSVotes={(user && user?.totalPollsVotes) || 0}
              totalPollsCreated={(user && user?.totalPollsCreated) || 0}
              totalPollsBookmarked={(user && user?.totalPollsBookmarked) || 0}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
