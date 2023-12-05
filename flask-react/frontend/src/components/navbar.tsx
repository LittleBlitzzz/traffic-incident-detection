import React from "react";
import { Link } from "react-router-dom";

import { SliderToggle } from './';

interface NavBarProps {
  currentPage?: string;
}

const NavBar: React.FC<NavBarProps> = ({
    currentPage="Homepage",
  }) => {
  return (
    <>
      <div id="nav-bar" className="sticky top-0 flex py-4 space-x-8 px-36 bg-slate-300 z-20 w-screen">
        <div className="flex-initial self-center">
          <p className="text-2xl">Traffic LLaVA</p>
        </div>
        <div className="grow"></div>
        <ul className="flex self-center space-x-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/annotator">Annotator</Link>
          </li>
          <li>
            <Link to="/model-interface">Model Interface</Link>
          </li>
        </ul>
        <SliderToggle
        />
        <div>
          <a href="https://github.com/LittleBlitzzz/traffic-incident-detection" target="blank">
            <img src="/github-mark/github-mark.svg" className="w-10" alt="GitHub Logo" />
          </a>
        </div>
      </div>
    </>
  )
}

export default NavBar;