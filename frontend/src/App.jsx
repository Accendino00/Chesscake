import './App.css'
import React from 'react';
import ChessStart from './components/chessboard/ChessStart';
import ChessGame from './components/chessboard/ChessGame';

const App = () => {
  return (
    <div>
      <ChessGame rank={80}/> 
    </div>
  );
};

export default App;