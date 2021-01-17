import React from 'react';
import ReactDOM from 'react-dom';
import DrawTree from './treeHelpers/DrawTree';

window.drawStatusTree = (str) => {
  ReactDOM.render(<DrawTree />, document.getElementById('root'));
}

function App() {
  React.useEffect(() => {
    setTimeout(() => {
      window.postMessage(`${document.getElementById('root').innerHTML}`)
    }, 4000);
  }, []);
  return <div>
    <DrawTree />
  </div>
}

export default App;
