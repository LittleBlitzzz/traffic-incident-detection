
import React, { useState, useEffect } from 'react';
import { Dropdown, ImageFromBackend } from './';

interface AnnotatorInterfaceProps {
  datasetName: string;
  videoName: string;
  imageFileName: string;
}

const AnnotatorInterface: React.FC<AnnotatorInterfaceProps> = ({ 
    datasetName, 
    videoName, 
    imageFileName 
  }) => {
  
  const unableToIdentifyOption = "Unknown/Indistinguishable";
  const objectVolumeOptions = [ 'At least one', 'A few', 'Multiple' ];
  
  return (
    <>
      <ImageFromBackend
        datasetName={datasetName}
        videoName={videoName}
        imageFileName={imageFileName}
        altText="Video footage"
        className="rounded-lg w-[400px] h-fit border-2 border-slate-400"
      />
      <div className="w-10"></div>
      <div className="flex flex-col">
        <form>
          <p>Environment details:</p>
            <p className="ml-2">Road details:</p>
              <div className='flex items-center'>
                <p className="ml-4">Road Location:</p>
                <Dropdown
                  options={[ 'Urban', 'Suburban', 'Rural', unableToIdentifyOption ]}
                  title='Road Location'
                />
              </div>
              <p className="ml-4">Type of Road:</p>
              <Dropdown
                options={[ 'Highway', 'Street', 'Alley', unableToIdentifyOption ]}
                title='Type of Road'
              />
              <p className="ml-4">Road layout:</p>
              <Dropdown
                options={[ 'Straight Road', 'Curved Road', 'T-Junction', 'Y-Juntion', 'Four-way Junction', 'Roundabout', unableToIdentifyOption ]}
                title='Road Layout'
              />
              <p className="ml-4">Surroundings:</p>
            <p className="ml-2">Time of Day:</p>
              <Dropdown
                options={[ 'Dawn/Dusk', 'Daytime', 'Night', unableToIdentifyOption ]}
                title='Time of Day'
              />
            <p className="ml-2">Weather Conditions:</p>
              <Dropdown
                options={[ 'Clear', 'Raining', 'Snowing', unableToIdentifyOption ]}
                title='Weather'
              />
            <p className="ml-2">Lighting Conditions:</p>
              <Dropdown
                options={[ 'Daylight', 'Low light', 'Street lights', unableToIdentifyOption ]}
                title='Lighting Conditions'
              />
            <p className="ml-2">Traffic Density:</p>
              <Dropdown
                options={[ 'Empty', 'Sparse', 'Moderate', 'Dense' ]}
                title='Traffic Density'
              />
          <p>Traffic Participants:</p>
            <p className="ml-2">Motor Vehicles:</p>
              <p className="ml-4">Cars:</p>
              <Dropdown
                options={objectVolumeOptions}
                title='Cars'
              />
              <p className="ml-4">Trucks/Large Vehicles:</p>
              <Dropdown
                options={objectVolumeOptions}
                title='Trucks/Large Vehicles'
              />
              <p className="ml-4">Motorcycles/Rickshaws:</p>
              <Dropdown
                options={objectVolumeOptions}
                title='Motorcycles'
              />
            <p className="ml-2">Cyclists:</p>
              <Dropdown
                options={objectVolumeOptions}
                title='Cyclists'
              />
            <p className="ml-2">Pedestrians:</p>
              <Dropdown
                options={objectVolumeOptions}
                title='Pedestrians'
              />
        </form>
      </div>
    </>
  )
}

export default AnnotatorInterface;