import React from 'react';

// Components
import APOD from 'components/Apod';
import Header from 'components/Header';

export const App = () => {
  return (
    <div className="App">
      <Header />
      <APOD />
    </div>
  );
};

export default App;
