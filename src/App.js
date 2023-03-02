import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        Hey, this is my ethereum web app where you can send me a wave! You check how often oyu have waived so far.
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
