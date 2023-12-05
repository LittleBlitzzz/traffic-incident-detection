
import React, { useRef, useState, useEffect } from 'react';
import { Dropdown, ImageFromBackend, AnnotatorInterface, ImageSelector } from '../components';

interface AnnotatorPageProps {
  datasetName: string
}

const AnnotatorPage: React.FC<AnnotatorPageProps> = ({ datasetName }) => {
  const [videoTitles, setVideoTitles] = useState<string[]>([]);
  const [imageFileNames, setImageFileNames] = useState<string[]>([]);

  const [currVideoName, setCurrVideoName] = useState("000000");
  const [currImageFileName, setCurrImageFileName] = useState("0.jpg");

  useEffect(() => {
    fetch('/api/annotator/videos-in-dataset/' + datasetName, {
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
  }, [datasetName]);

  let videoDropdown = (
    <div className="flex-initial self-center mr-2 w-60">
      <Dropdown 
        options={videoTitles} 
        title="Select a video"
        onOptionSelected={(option) => {
          setCurrVideoName(option);

          fetch('/api/annotator/images-in-video/' + datasetName + '/' + option, {
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
          if (filename === currImageFileName) {
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

  const refDatasetName = useRef("extracted_frames");
  const refVideoName = useRef("000000");
  const refImageFilename = useRef("0.jpg");

  let annotatorPanel = (
    <div className="px-36 pt-8">
      <ImageSelector 
        refDatasetName={refDatasetName}
        refVideoName={refVideoName}
        refImageFilename={refImageFilename}
      />
      <div className="h-10"></div>
      <AnnotatorInterface
        datasetName={datasetName}
        videoName={currVideoName}
        imageFileName={currImageFileName}
        interfaceTitle="User Inputs"
      />
      <div className="h-10"></div>
      <AnnotatorInterface
        datasetName={datasetName}
        videoName={currVideoName}
        imageFileName={currImageFileName}
        readonly="true"
        interfaceTitle="Model Outputs"
      />
    </div>
  )
  
  const oldImageSelector = (
    <div id="video-selection-panel" className="flex py-4 px-36 bg-slate-200">
      {videoDropdown}
      {imageFileNameList}
      {ssimFilterToggle}
    </div>
  )

  return (
    <>
      <div>
        {annotatorPanel}
        <div className="h-40">
        </div>
      </div>
    </>
  );
}

export default AnnotatorPage;

