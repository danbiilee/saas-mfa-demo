import React from 'react';
import Logo from '@images/logo.png';

import RemoteApp1 from './components/remotes/RemoteApp1';
import RemoteApp2 from './components/remotes/RemoteApp2';

const App = () => {
  return (
    <div>
      <h1>
        <img src={Logo} alt="logo" width="40" />
        DEMO
      </h1>
      <RemoteApp1 module="./Button" />
      <RemoteApp2 module="./Button" />
    </div>
  );
};

export default App;
