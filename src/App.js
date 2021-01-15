import React from 'react';
import ReactDOM from 'react-dom';
import DrawTree from './treeHelpers/DrawTree';

window.drawStatusTree = (str) => {
  ReactDOM.render(<DrawTree />, document.getElementById('root'));
}

function App() {
  return <div>
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit, reiciendis mollitia! Nobis possimus tempora reiciendis quia blanditiis neque, quas, quod illo quaerat ducimus, soluta veniam ipsum repellendus minus expedita culpa.
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit, reiciendis mollitia! Nobis possimus tempora reiciendis quia blanditiis neque, quas, quod illo quaerat ducimus, soluta veniam ipsum repellendus minus expedita culpa.
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit, reiciendis mollitia! Nobis possimus tempora reiciendis quia blanditiis neque, quas, quod illo quaerat ducimus, soluta veniam ipsum repellendus minus expedita culpa.
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit, reiciendis mollitia! Nobis possimus tempora reiciendis quia blanditiis neque, quas, quod illo quaerat ducimus, soluta veniam ipsum repellendus minus expedita culpa.
      <DrawTree />
  </div>
}

export default App;
