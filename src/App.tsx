import React from 'react';
import reactLogo from './assets/react.svg';
import FilePathDisplay from './components/FourierPlot';

function App() {
  return (
    <div>
      <FilePathDisplay filePath={reactLogo} />
    </div>
  );
}

export default App;
