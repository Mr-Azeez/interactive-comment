import React from "react";

type ScoreProps = {
  score: number;
  onUpVote: () => void;
  onDownVote: () => void;
};
const Score: React.FC<ScoreProps> = ({ score, onDownVote, onUpVote }) => {
  return (
    <div className="flex flex-row md:flex-col justify-between items-center bg-[#f5f6fa] p-2 mb-2 rounded-md absolute md:w-[40px] md:h-full w-[150px] h-[40px] md:top-0 md:left-0 top-45 left-6">
      <button
        className="border-none py-auto md:py-2 cursor-pointer"
        onClick={onUpVote}
      >
        <img src="images/icon-plus.svg" alt="Plus button" className="" />
      </button>
      <span className="text-[#5457b6] font-bold pb-2">{score}</span>
      <button className="pb-2 cursor-pointer" onClick={onDownVote}>
        <img src="images/icon-minus.svg" alt="Minus button" />
      </button>
    </div>
  );
};

export default Score;
