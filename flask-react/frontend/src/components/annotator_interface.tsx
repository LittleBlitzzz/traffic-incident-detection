
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
  
  /** Road Details */
  const refRoadLoc = useRef("");
  const refRoadType = useRef("");
  const refRoadLayout = useRef("");
  const refRoadSurroundings = useRef([]);

  /** Environment Details */
  const refTimeOfDay = useRef("");
  const refWeatherCond = useRef("");
  const refLightingCond = useRef("");
  const refTrafficDensity = useRef("");

  const handleFormSubmission = (e) => {
    e.preventDefault();
    
    console.log({
      environment_details: {
        road_details: {
          location: refRoadLoc.current.value,
          type_of_road: refRoadType.current.value,
          road_layout: refRoadLayout.current.value,
          surroundings: refRoadSurroundings.current.value,
        },
        time_of_day: refTimeOfDay.current.value,
        weather: refWeatherCond.current.value,
        lighting: refLightingCond.current.value,
        traffic_density: refTrafficDensity.current.value,
      }
    });
  };

  const roadDetailsInputs = (
    <>
      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "Urban", "Suburban", "Rural", unableToIdentifyOption ]}
            inputValueName="road_loc"
            inputValueRef={refRoadLoc}
          />
        )}
        label="Road Location"
        indentClass="ml-4"
      />
      
      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "Highway", "Street", "Alley", unableToIdentifyOption ]}
            inputValueName="road_type"
            inputValueRef={refRoadType}
          />
        )}
        label="Road Type"
        indentClass="ml-4"
      />

      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "Straight Road", "Curved Road", "T-Junction", "Y-Juntion", "Four-way Junction", "Roundabout", unableToIdentifyOption ]}
            inputValueName="road_layout"
            inputValueRef={refRoadLayout}
          />
        )}
        label="Road Layout"
        indentClass="ml-4"
      />

      <InputWithLabel 
        inputElem={(
          <MultiSelectDropdown
            options={[ "Traffic Lights", "Pedestrian Crossings", "Road Signs" ]}
            inputValueName="road_surroundings"
            inputValueRef={refRoadSurroundings}
          />
        )}
        label="Road Surroundings"
        indentClass="ml-4"
      />
    </>
  );

  const environmentDetailsInputs = (
    <>
      <div id="road-details-panel">
        <p className="ml-2">Road details:</p>
        {roadDetailsInputs}
      </div>

      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "Dawn/Dusk", "Daytime", "Night", unableToIdentifyOption ]}
            inputValueName="time_of_day"
            inputValueRef={refTimeOfDay}
          />
        )}
        label="Time of Day"
        indentClass="ml-2"
      />

      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "Clear", "Raining", "Snowing", unableToIdentifyOption ]}
            inputValueName="weather_cond"
            inputValueRef={refWeatherCond}
          />
        )}
        label="Weather Condition"
        indentClass="ml-2"
      />
      
      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "Daylight", "Low light", "Street lights", unableToIdentifyOption ]}
            inputValueName="lighting_cond"
            inputValueRef={refLightingCond}
          />
        )}
        label="Lighting Condition"
        indentClass="ml-2"
      />

      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "Empty", "Sparse", "Moderate", "Dense" ]}
            inputValueName="traffic_density"
            inputValueRef={refTrafficDensity}
          />
        )}
        label="Traffic Density"
        indentClass="ml-2"
      />
    </>
  );

  return (
    <>
      <div className="w-10"></div>
      <div className="flex flex-col">
        <form onSubmit={handleFormSubmission} id="Testing">

          <div id="environment-details-panel">
            <p className="text-bold">Environment details:</p>
            {environmentDetailsInputs}
          </div>
          
          <div id="traffic-participants-panel">
          </div>


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