
import React, { useState, useEffect } from 'react';
import { Dropdown, ImageFromBackend, AnnotatorInterface } from '../components';

interface HomepageProps {
  datasetName: string
}

const Homepage: React.FC<HomepageProps> = ({ datasetName }) => {
  const [videoTitles, setVideoTitles] = useState([]);
  const [imageFileNames, setImageFileNames] = useState([]);

  const [currVideoName, setCurrVideoName] = useState("000000");
  const [currImageFileName, setCurrImageFileName] = useState("0.jpg");

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
  }, []);

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
        imageFileNames.map((filename, index) => {
          let styleClass = "p-2 mx-2 h-full rounded-lg hover:cursor-pointer "
          if (filename == currImageFileName) {
            styleClass += "bg-cyan-300/[0.4] hover:bg-cyan-300/[0.6]"
          } else {
            styleClass += "hover:bg-cyan-300/[0.2]"
          }
          return (
            <div key={index} className={styleClass} onClick={() => {
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
          <AnnotatorInterface
            datasetName={datasetName}
            videoName={currVideoName}
            imageFileName={currImageFileName}
          />
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
        <div className="h-40">
        </div>
      </div>
    </>
  );
}

export default Homepage;