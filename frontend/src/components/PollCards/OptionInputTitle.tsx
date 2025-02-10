import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";

interface PropsType {
  isSelected: boolean;
  label: string;
  onSelect: () => Promise<void>;
}

const OptionInputTitle = ({ isSelected, label, onSelect }: PropsType) => {
  const getColors = () => {
    if(isSelected) return "text-white bg-blue-400 border-sky-400"

    return "text-black bg-slate-200/80 border-slate-200"
  };

  return (
    <button
      className={`w-full flex items-centergap-2 px-3 py-1 mb-4 border rounded-md ${getColors()}`}
      onClick={onSelect}
    >
      {isSelected ? (
        <MdRadioButtonChecked className="text-lg text-white" />
      ) : (
        <MdRadioButtonUnchecked className="text-lg text-slate-400" />
      )}

      <span className="text-[13px]">{label}</span>
    </button>
  );
};

export default OptionInputTitle;
