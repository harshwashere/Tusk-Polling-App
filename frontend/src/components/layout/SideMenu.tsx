import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA } from "../../utils/data";
import { useUserContext } from "../../context/userContext";

type SideMenuProps = {
  activeMenu: string;
};

const SideMenu = ({ activeMenu }: SideMenuProps) => {
  const { clearUser } = useUserContext();
  const navigate = useNavigate();

  const handleOnClick = (route: string) => {
    if (route === "logout") {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-slate-50/50 border-r border-slate-100/70 p-5 sticky top-[61px] z-20">
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`cursor-pointer w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label ? "text-white bg-blue-400" : ""
          } py-4 px-6 rounded-full mb-3`}
          onClick={() => handleOnClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
