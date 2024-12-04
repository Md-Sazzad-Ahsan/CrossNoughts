import React from 'react';

const Board = ({ grid, onCellClick }) => {
  // const playClickSound = () => {
  //   const audio = new Audio('/sound/buttonTwo.mp3');
  //   audio.play();
  // };

  return (
    <div className="grid grid-cols-3 gap-2 p-5 bg-white border border-gray-200 rounded-lg shadow-sm md:shadow-md mx-auto max-w-3xl">
      {grid.map((cell, index) => (
        <div
          key={index}
          className={`w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center border border-gray-200 md:border-gray-300 rounded-md shadow-sm
                      text-4xl font-bold cursor-pointer hover:bg-gray-100 transition-transform ${
                        cell === 'X' ? 'text-blue-500' : cell === 'O' ? 'text-red-500' : 'text-gray-400'
                      }`}
          onClick={() => {
            // playClickSound(); 
            onCellClick(index);
          }}
        >
          {cell || ''}
        </div>
      ))}
    </div>
  );
};

export default Board;
