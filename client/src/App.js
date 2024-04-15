
import React from 'react';
import './App.css';
import Login from './login';
import Signup from './signup';
import { BackgroundBeams } from "./ui/beams.tsx";

function App() {
  return (
    <div className="App bg-black">
      <div className="h-[100rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <h1 class="px-relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">Welcome to Notify</h1>
        <Login />
        <Signup />
        <BackgroundBeams />
      </div>
    </div>
  );
}

export default App;
