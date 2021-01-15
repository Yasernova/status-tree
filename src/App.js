import React from 'react';
import ReactDOM from 'react-dom';
import DrawTree from './treeHelpers/DrawTree';

window.drawStatusTree = (str) => {
  ReactDOM.render(<DrawTree />, document.getElementById('root'));
}

function App() {
  return null
}

export default App;
