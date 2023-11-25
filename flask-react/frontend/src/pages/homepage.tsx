import github_logo_light from "/content/traffic-incident-detection/flask-react/frontend/src/assets/github-mark/github-mark.svg"
import github_logo_dark from "/content/traffic-incident-detection/flask-react/frontend/src/assets/github-mark/github-mark-white.svg"
import React, { useState } from 'react';
import { Dropdown } from '../components';

interface HomepageProps {
  datasetName: string,
  currVideoName: string,
  currFilename: string,
}

const Homepage: React.FC<HomepageProps> = ({ datasetName, currVideoName, currFilename }) => {
  const [count, setCount] = useState(0);
  console.log(datasetName);
  console.log(currVideoName);
  console.log(currFilename);

  let videoTitles = []
  for (var i=0; i < 2; i++) {
    videoTitles.push(
      <div className="flex-initial self-center mx-2">
        <p className="text-xl">Annotator</p>
      </div>
    )
  }

  const apiUrl = '/api/videos-in-dataset/extracted_frames';
  let options = ['option 1', 'option 2']
  fetch(apiUrl, {
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "1",
      }),
  })
    .then(response => {
      response.text().then(body => {
        console.log(body);
      });
    })
    .catch(error => console.error('Error:', error));

  return (
    <>
      <div>
        <div id="nav-bar" className="flex py-4 px-36 bg-slate-200">
          <div className="flex-initial self-center mr-2">
            <Dropdown options={options} />
          </div>
          {videoTitles}
        </div>
        <p>count: {count} times</p>
        <button onClick={ () => setCount(count + 1) }>
          Click
        </button>
      </div>
    </>
  );
}

export default Homepage;