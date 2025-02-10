import React, { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";

interface PropType {
  optionList: string[];
  setOptionList: React.Dispatch<React.SetStateAction<string[]>>;
}

const OptionInput = ({ optionList, setOptionList }: PropType) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim() && optionList.length < 4) {
      setOptionList([...optionList, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index: number) => {
    setOptionList(optionList.filter((_, i) => i !== index));
  };

  return (
    <div>
      {optionList.map((item: string, index: number) => (
        <div
          key={index}
          className="flex justify-between bg-gray-200/80 px-4 py-2 rounded-md mb-3"
        >
          <p className="text-xs font-medium text-black">{item}</p>

          <button onClick={() => handleDeleteOption(index)}>
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      {optionList.length < 4 && (
        <div className="flex items-center gap-5 mt-4">
          <input
            type="text"
            placeholder="Enter Option"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none bg-gray-200/80 px-3 py-[6px] rounded-md"
          />
          <button
            className="btn-small text-nowrap py-[6px] cursor-pointer"
            onClick={handleAddOption}
          >
            <HiMiniPlus className="text-lg" /> ADD OPTION
          </button>
        </div>
      )}
    </div>
  );
};

export default OptionInput;
