interface EmptyCardType {
  imgSrc: string;
  message: string;
  btntext: string;
  onClick: () => void;
}

const EmptyCard = ({ imgSrc, message, btntext, onClick }: EmptyCardType) => {
  return (
    <div className="bg-gray-100/50 flex flex-col items-center justify-center mt-6 py-20 rounded-lg">
      <img src={imgSrc} alt="No Notes" className="w-36 md:w-48 bg-blue-300/40 p-8 rounded-lg" />

      <p className="w-2/3 text-xs md:text-[14px] text-slate-900 text-center leading-6 mt-7">
        {message}
      </p>

      {btntext && (
        <button className="btn-small px-6 py-2 mt-7" onClick={onClick}>
          {btntext}
        </button>
      )}
    </div>
  );
};

export default EmptyCard;
