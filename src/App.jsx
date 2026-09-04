import React from 'react';
import '../client/src/index.css';
import { App as IDSSApp } from '../client/src/App';
import './styles/idss-theme.css';

export function App() {
  return (
    <div className="intelligent-decision-module">
      <IDSSApp />
    </div>
  );
}

export default App;
