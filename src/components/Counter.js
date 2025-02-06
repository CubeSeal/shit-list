import React from 'react';

export const Counter = ({ count, onIncrement, onReset }) => {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
};
