import React, { useState, useEffect, useRef, RefObject, FormEvent } from 'react';

import { InputWithLabel, TextField } from './';

interface ImageFromBackendProps {
  datasetName: string;
  videoName: string;
  imageFileName: string;
  altText?: string,
  className?: string;
}

const ImageFromBackend: React.FC<ImageFromBackendProps> = ({
    datasetName, 
    videoName, 
    imageFileName, 
    altText = "Image", 
    className = "",
  }) => {
  const [imageSrc, setImageSrc] = useState("");

  let apiUrl = ["/api/annotator/get-image", datasetName, videoName, imageFileName].join("/");

  useEffect(() => {
    fetch(apiUrl, {
      method:"get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "1",
      }),
    })
    .then(response => response.blob())
    .then(blob => {
      console.log(blob)
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
    })
    .catch(error => {
      console.error(error);
    });
  }, [apiUrl]);

  return (
    <>
      {imageSrc && <img src={imageSrc} alt={altText} className={className} />}
    </>
  );
};


interface ImageSelectorProps {
  refDatasetName?: RefObject<string>;
  refVideoName?: RefObject<string>;
  refImageFilename?: RefObject<string>;
  altText?: string,
  className?: string;
  showImage?: boolean;
  onImageUpdated? : (imagePath: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ 
    refDatasetName=useRef("extracted_frames"),
    refVideoName=useRef("000000"),
    refImageFilename=useRef("6.jpg"),
    altText="Image", 
    className="",
    showImage=true,
    onImageUpdated=null,
  }) => {
  const [imagePath, setImagePath] = useState("");
 
  const inputContextForm = (
    <form id="input-context-form" className="flex space-x-4 justify-center" onSubmit={(e: FormEvent) => {
      e.preventDefault();
      const newImagePath = [ refDatasetName.current, refVideoName.current, refImageFilename.current].join("/");
      setImagePath(newImagePath);

      if (onImageUpdated) {
        onImageUpdated(newImagePath);
      }
    }}>
      <fieldset className="flex flex-col space-y-4 w-1/3 ">
        <legend>Input path</legend>
        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter dataset name"
              initialValue={refDatasetName.current}
              inputValueName="dataset_name"
              refInputValue={refDatasetName}
            />
          )}
          label="Dataset Name"
          labelClassName="w-56 mb-auto"
        />
        
        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter video name"
              initialValue={refVideoName.current}
              inputValueName="video_name"
              refInputValue={refVideoName}
            />
          )}
          label="Video Name"
          labelClassName="w-56 mb-auto"
        />
        
        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter image filename"
              initialValue={refImageFilename.current}
              inputValueName="image_filename"
              refInputValue={refImageFilename}
            />
          )}
          label="Image Filename"
          labelClassName="w-56 mb-auto py-2"
        />

        <button className="form-submit-btn self-end" type="submit">Update context</button>
      </fieldset>
      
      { refDatasetName.current && refVideoName.current && refImageFilename.current && showImage && (
        <fieldset className="w-1/3">
          <legend>Image from Server</legend>
          <ImageFromBackend
            datasetName={refDatasetName.current}
            videoName={refVideoName.current}
            imageFileName={refImageFilename.current}
            altText={imagePath}
            className={className}
          />
        </fieldset>
      )}

    </form>
  )

  return inputContextForm;
}

export { ImageSelector, ImageFromBackend };
