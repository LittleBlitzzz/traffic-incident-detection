import React from "react";
import { Link } from "react-router-dom";

import { SliderToggle } from './';

interface NavBarProps {
  currentPage?: string;
}

const NavBar: React.FC<NavBarProps> = ({
    currentPage="Homepage",
  }) => {

  const pagesAndRoutes = [
    [ "/", "Home" ],
    [ "/annotator", "Annotator" ],
    [ "/model-interface", "Model Interface" ],
  ];

  return (
    <>
      <div id="nav-bar" className="sticky top-0 flex py-2 space-x-8 px-36 bg-slate-300 z-20 w-screen h-[10vh]">
        <div className="flex-initial self-center">
          <p className="text-2xl">Traffic LLaVA</p>
        </div>
        <div className="grow"></div>
        <ul className="flex self-center space-x-4">
          {pagesAndRoutes.map(([route, title]) => (
            <li className="p-1 rounded-lg hover:shadow-md hover:shadow-md hover:shadow-stone-400/50 active:shadow-lg active:shadow-stone-400/75">
              <Link to={route}>{title}</Link>
            </li>
          ))}
        </ul>
        <SliderToggle
        />
        <div className="self-center">
          <a href="https://github.com/LittleBlitzzz/traffic-incident-detection" target="blank">
            <img src="/github-mark/github-mark.svg" className="w-10" alt="GitHub Logo" />
          </a>
        </div>
      </div>
    </>
  )
}

export default NavBar;