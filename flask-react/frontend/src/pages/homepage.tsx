import React from "react";
import github_logo_light from "/content/traffic-incident-detection/flask-react/frontend/src/assets/github-mark/github-mark.svg"
import github_logo_dark from "/content/traffic-incident-detection/flask-react/frontend/src/assets/github-mark/github-mark-white.svg"

class Homepage extends React.Component {
 constructor(props) {
   super(props);
   this.state = {
    count: 0,
    datasetName: "extracted_frames",
    currVideoName: "000000",
    currFilename: "6.jpg",
   };
 }

 render() {
  let videoTitles = []
  for (var i=0; i < 2; i++) {
    videoTitles.push(
      <div className="flex-initial self-center mx-2">
        <p className="text-xl">Annotator</p>
      </div>
    )
  }

  return (
    <>
      <div>
        <div id="nav-bar" className="flex py-4 px-36 bg-slate-200">
            {videoTitles}
        </div>
        <p>count: {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click
        </button>
      </div>
     </>
   );
 }
}

export default Homepage;