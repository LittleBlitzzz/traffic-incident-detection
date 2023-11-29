import React from "react";
import github_logo_light from "/content/traffic-incident-detection/flask-react/frontend/src/assets/github-mark/github-mark.svg"
import github_logo_dark from "/content/traffic-incident-detection/flask-react/frontend/src/assets/github-mark/github-mark-white.svg"

interface NavBarProps {
  currentPage: string;
}

const NavBar: React.FC<NavBarProps> = ({
    currentPage="Homepage",
  }) => {
  return (
    <>
      <div id="nav-bar" className="sticky top-0 flex py-4 px-36 bg-slate-300">
        <div className="flex-initial self-center">
          <p className="text-2xl">Annotator</p>
        </div>
        <div className="grow"></div>
        <div>
          <a href="https://github.com/LittleBlitzzz/traffic-incident-detection">
            <img src={github_logo_light} className="w-10" alt="GitHub Logo" />
          </a>
        </div>
      </div>
    </>
  )
}

export default NavBar;