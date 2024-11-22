import React from 'react';

const Board = ({ grid, onCellClick }) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-lg w-80 sm:w-96">
      {grid.map((cell, index) => (
        <div
          key={index}
          className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center border-2 border-gray-300 rounded-lg 
                      text-4xl font-bold cursor-pointer hover:bg-gray-100 transition-transform ${
                        cell === 'X' ? 'text-blue-500' : cell === 'O' ? 'text-pink-500' : 'text-gray-400'
                      }`}
          onClick={() => onCellClick(index)}
        >
          {cell || ''}
        </div>
      ))}
    </div>
  );
};

export default Board;
