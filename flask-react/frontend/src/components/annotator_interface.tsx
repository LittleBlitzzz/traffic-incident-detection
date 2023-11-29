
import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, DropdownProps, MultiSelectDropdown } from './';

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
  
  const annotationsData = {
    environment_details: {
      road_details: {
        location: '',
        type_of_road: '',
        surroundings: [],
        road_layout: '',
      },
      time_of_day: '',
      weather: '',
      lighting: '',
      traffic_density: '',
    },
    traffic_participants: {
      motor_vehicles: {
        cars: '',
        trucks_large_vehicles: '',
        motorcycles_rickshaws: '',
      },
      cyclists: '',
      pedestrians: '',
    },
    traffic_incident: {
      timing: '',
      collision_with_others: false,
      type_of_collision: {
        type: '',
        involvement: '',
      },
      rollover_accident: false,
      run_off_road_accident: false,
      chain_accident: false,
    },
    potential_cause_of_incident: [],
  };

  const unableToIdentifyOption = "Unknown/Indistinguishable";
  const objectVolumeOptions = [ "None", "At least one", "A few", "Multiple" ];
  
  const roadLocationRef = useRef("d");
  const roadLocationInput = (
    <Dropdown
      options={[ "Urban", "Suburban", "Rural", unableToIdentifyOption ]}
      inputValueName="road_location"
      inputValueRef={roadLocationRef}
    />
  )

  const handleFormSubmission = (e) => {
    e.preventDefault();
    
    console.log(roadLocationRef.current.value);
  };


  return (
    <>
      <div className="w-10"></div>
      <div className="flex flex-col">
        <form onSubmit={handleFormSubmission} id="Testing">

                  <InputWithLabel 
                    inputElem={roadLocationInput}
                    label="Road Location"
                    indentClass="ml-4"
                  />
          <input type="submit" value="Hello "/>
        </form>
      </div>
    </>
  )
}

export default AnnotatorInterface;

const InputWithLabel = ({ inputElem, label, indentClass } : { inputElem : React.ReactElement<any>, label: string, indentClass:string}) => {
  let parentDivClass = "flex items-center py-2 " + indentClass;
  return (
    <>
      <div className={parentDivClass}>
        <p className="w-40">{label}:</p>
        {inputElem}
      </div>
    </>
  )
}