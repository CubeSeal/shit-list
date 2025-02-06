import React, { useState } from 'react';
import { Card } from './components/Card';
import { Counter } from './components/Counter';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Card title="My First React App">
        <Counter 
          count={count}
          onIncrement={() => setCount(count + 1)}
          onReset={() => setCount(0)}
        />
      </Card>
    </div>
  );
};

export default App;
