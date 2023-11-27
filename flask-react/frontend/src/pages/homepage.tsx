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
    <div className="flex overflow-x-auto self-center grow">
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

  let ssimFilterToggle = (
    <div className="flex-none p-2 mx-2 h-full rounded-lg bg-slate-300 hover:cursor-pointer ">
      <p>SSIM Filter</p>
    </div>
  )

  let annotatorPanel = (
    <div className="px-36 pt-8 flex">
      { (currVideoName !== "" && currImageFileName !== "") &&
        <>
          <ImageFromBackend
            datasetName={datasetName}
            videoName={currVideoName}
            imageFileName={currImageFileName}
            altText="Video footage"
            className="rounded-lg w-[400px] h-fit border-2 border-slate-400"
          />
          <div className="w-10"></div>
          <div className="flex flex-col">
            <p>Environment details:</p>
              <p className="ml-2">Road details:</p>
                <p className="ml-4">Location:</p>
                <p className="ml-4">Type of Road:</p>
                <p className="ml-4">Road layout:</p>
                <p className="ml-4">Surroundings:</p>
              <p className="ml-2">Time of Day:</p>
              <p className="ml-2">Weather:</p>
              <p className="ml-2">Lighting Conditions:</p>
              <p className="ml-2">Traffic density:</p>
            <p>Traffic Participants:</p>
              <p className="ml-2">Motor Vehicles:</p>
                <p className="ml-4">Cars:</p>
                <p className="ml-4">Trucks/Large Vehicles:</p>
                <p className="ml-4">Motorcycles/Rickshaws:</p>
              <p className="ml-2">Cyclists:</p>
              <p className="ml-2">Pedestrians:</p>
          </div>
        </>
      }
    </div>
  )
  
  return (
    <>
      <div>
        <div id="nav-bar" className="flex py-4 px-36 bg-slate-200">
          {videoDropdown}
          {imageFileNameList}
          {ssimFilterToggle}
        </div>
        {annotatorPanel}
      </div>
    </>
  );
}

export default Homepage;