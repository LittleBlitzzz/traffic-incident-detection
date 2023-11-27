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
  const [options, setOptions] = useState(['option 1', 'option 2'])
  const [isLoading, setIsLoading] = useState(true);

  console.log(datasetName);
  console.log(currVideoName);
  console.log(currFilename);

  let isLoading = true;

  let videoTitles = []
  for (var i=0; i < 2; i++) {
    videoTitles.push(
      <div className="flex-initial self-center mx-2">
        <p className="text-xl">Annotator</p>
      </div>
    )
  }

  const apiUrl = '/api/videos-in-dataset/extracted_frames';
  
  if (isLoading) {
    fetch(apiUrl, {
        method: "get",
        headers: new Headers({
          "ngrok-skip-browser-warning": "1",
        }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(typeof data)
      isLoading = false;
      setOptions(data);
    })
    .catch(error => console.error('Error:', error));
  }

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