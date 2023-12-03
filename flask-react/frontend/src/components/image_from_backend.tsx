import React, { useState, useEffect, RefObject, FormEvent } from 'react';

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

  const apiUrl = '/api/annotator/get-image/' + datasetName + '/' + videoName + '/' + imageFileName
  const fetchImage = () => {
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
  };
  useEffect(() => {
    fetchImage();
  }, [apiUrl]);

  return (
    <>
      {imageSrc && <img src={imageSrc} alt={altText} className={className} />}
    </>
  );
};


interface ImageFromBackendProps {
  refDatasetName?: RefObject<string>;
  refVideoName?: RefObject<string>;
  refImageFilename?: RefObject<string>;
  altText?: string,
  className?: string;
}

const ImageSelector: React.FC<ImageFromBackendProps> = ({ 
    refDatasetName=null,
    refVideoName=null,
    refImageFilename=null,
    altText="Image", 
    className="",
  }) => {
 
  
  if (refDatasetName === null) {
    refDatasetName = useRef("");
  }
  if (refVideoName === null) {
    refVideoName = useRef("");
  }
  if (refImageFilename === null) {
    refImageFilename = useRef("");
  }

  const inputContextForm = (
    <form id="input-context-form" className="flex flex-col space-y-4 w-1/2" onSubmit={(e: FormEvent) => {
      e.preventDefault();
      setImagePath([ refDatasetName.current.value, refVideoName.current.value, refImageFilename.current.value].join("/"))
    }}>
      <fieldset className="border-4 p-4 rounded-lg border ring-blue-500">
        <legend>Input image</legend>
        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter dataset name"
              initialValue="extracted_frames"
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
              initialValue="000000"
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
              initialValue="0.jpg"
              inputValueName="image_filename"
              refInputValue={refImageFilename}
            />
          )}
          label="Image Filename"
          labelClassName="w-56 mb-auto"
        />
      </fieldset>

      <button className={"py-2 px-4 bg-cyan-200 rounded-lg self-end"} type="submit">Update context</button>
    </form>
  )

  return (
    <>
      <div className="flex space-x-8 py-4">
        { inputContextForm }
        { refDatasetName.current.value && refVideoName.current.value && refImageFilename.current.value && (<ImageFromBackend
          datasetName={refDatasetName.current.value}
          videoName={refVideoName.current.value}
          imageFileName={refImageFilename.current.value}
          altText={imagePath}
          className={className}
        />)}
      </div>
    </>
  )
}

export { ImageSelector, ImageFromBackend };
