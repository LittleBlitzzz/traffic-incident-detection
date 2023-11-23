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
   return (
     <>
      <div>
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