import React, { useState, useEffect } from 'react';

interface ImageFromBackendProps {
  datasetName: string;
  videoName: string;
  imageFileName: string;
  altText: string,
  className: string;
}

const ImageFromBackend: React.FC<ImageFromBackendProps> = ({ 
  datasetName, 
  videoName, 
  imageFileName, 
  altText = "Image", 
  className = "",
  }) => {
  const [imageSrc, setImageSrc] = useState("");

  const apiUrl = '/api/get-image/' + datasetName + '/' + videoName + '/' + imageFileName
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
          console.log("revoked : " + imageSrc)
        }
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
        console.log("Created : " + imageUrl)
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

export default ImageFromBackend;
