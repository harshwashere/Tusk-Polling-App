import { useState } from "react";
import { IoCloseOutline, IoFilterOutline } from "react-icons/io5";
import { POLL_TYPE } from "../../utils/data";

interface PropsType {
  title: string;
  filterType: string;
  setFilterType: (value: string) => void;
}

const HeaderWithFilter = ({ title, filterType, setFilterType }: PropsType) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="sm:text-xl font-medium text-black">{title}</h2>

        <button
          className={`flex items-center gap-3 text-sm text-white bg-blue-400 px-4 py-2
        ${open ? "rounded-t-lg" : "rounded-lg"}`}
          onClick={() => {
            if (filterType !== "") setFilterType(""); // Clear filter if set
            setOpen(!open); // Toggle filter menu visibility
          }}
        >
          {filterType !== "" ? (
            <>
              <IoCloseOutline className="text-lg" />
              Clear
            </>
          ) : (
            <>
              <IoFilterOutline className="text-lg" />
              Filter
            </>
          )}
        </button>
      </div>

      {open && (
        <div className="flex flex-wrap gap-4 bg-blue-400 p-4 rounded-l-lg rounded-b-lg">
          {[{ label: "All", value: "" }, ...POLL_TYPE].map((type) => (
            <button
              key={type.value}
              className={`text-[14px] px-4 pt-1 rounded-lg text-nowrap text-center ${
                filterType === type.value
                  ? "text-white bg-sky-900" // Selected filter
                  : "bg-sky-100" // Unselected filter
              }`}
              onClick={() => {
                setFilterType(type.value); // Update filter type on click
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderWithFilter;
