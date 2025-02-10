interface PropsType {
  onSelect: () => void;
  imgUrl: string;
  isSelected: boolean;
}

const ImageOptionInputTile = ({ onSelect, imgUrl, isSelected }: PropsType) => {
  const getColors = () => {
    if (isSelected) return "border-2 border-blue-400";
    return "border-transparent";
  };

  return (
    <button
      className={`w-full flex items-center gap-2 bg-slate-200/40 mb-4 border rounded-md overflow-hidden ${getColors()}`}
      onClick={onSelect}
    >
      <img src={imgUrl} alt="" className="w-full h-36 object-contain" />
    </button>
  );
};

export default ImageOptionInputTile;
