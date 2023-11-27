import github_logo_light from "/content/traffic-incident-detection/flask-react/frontend/src/assets/github-mark/github-mark.svg"
import github_logo_dark from "/content/traffic-incident-detection/flask-react/frontend/src/assets/github-mark/github-mark-white.svg"
import React, { useState, useEffect } from 'react';
import { Dropdown, ImageFromBackend } from '../components';

interface HomepageProps {
  datasetName: string
}

const Homepage: React.FC<HomepageProps> = ({ datasetName }) => {
  const [videoTitles, setVideoTitles] = useState([])
  const [imageFileNames, setImageFileNames] = useState([])

  const [currVideoName, setCurrVideoName] = useState("")
  const [currImageFileName, setCurrImageFileName] = useState("")

  useEffect(() => {
    fetch('/api/videos-in-dataset/' + datasetName, {
        method: "get",
        headers: new Headers({
          "ngrok-skip-browser-warning": "1",
        }),
    })
    .then(response => response.json())
    .then(data => {
      setVideoTitles(data["video_titles"]);
    })
    .catch(error => console.error('Error:', error));
  }, [])

  let videoDropdown = (
    <div className="flex-initial self-center mr-2 w-60">
      <Dropdown 
        options={videoTitles} 
        title="Select a video"
        onOptionSelected={(option) => {
          setCurrVideoName(option);

          fetch('/api/images-in-video/' + datasetName + '/' + option, {
              method: "get",
              headers: new Headers({
                "ngrok-skip-browser-warning": "1",
              }),
          })
          .then(response => response.json())
          .then(data => {
            setImageFileNames(data["image_filenames"]);
          })
          .catch(error => console.error('Error:', error)); 
        }}
      />
    </div>
  )

  let imageFileNameList = (
    <div className="flex overflow-x-auto self-center">
      {
        imageFileNames.map((filename) => {
          let styleClass = "p-2 mx-2 h-full rounded-lg hover:cursor-pointer "
          if (filename == currImageFileName) {
            styleClass += "bg-cyan-300/[0.4] hover:bg-cyan-300/[0.6]"
          } else {
            styleClass += "hover:bg-cyan-300/[0.2]"
          }
          return (
            <div className={styleClass} onClick={() => {
              setCurrImageFileName(filename);
            }}>
              <p>{filename}</p>
            </div>
          )
        })
      }
    </div>
  )

  let annotatorPanel = (currVideoName !== "" && currImageFileName !== "") ? (
    <div className="px-36 pt-8 flex">
      <div className="w-[400px] bg-cyan-100 border-cyan-300 border-2">
        <ImageFromBackend
         datasetName={datasetName}
         videoName={currVideoName}
         imageFileName={currImageFileName}
         altText="Video footage"
         className="rounded-lg"
        />
      </div>
    </div>
  ) : (
    <div>
    </div>
  )
  
  return (
    <>
      <div>
        <div id="nav-bar" className="flex py-4 px-36 bg-slate-200">
          {videoDropdown}
          {imageFileNameList}
        </div>
        {annotatorPanel}
      </div>
    </>
  );
}

export default Homepage;