import React, { useState } from 'react';
import { Button as SharedButton } from '@te4m/shared';

const Button = () => {
  const [count, setCount] = useState(0);

  return (
    <SharedButton onClick={() => setCount(prev => prev + 1)}>
      app1 button {count}
    </SharedButton>
  );
};

export default Button;
