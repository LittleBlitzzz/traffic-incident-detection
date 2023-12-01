
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Dropdown, DropdownProps, MultiSelectDropdown, InputWithLabel } from './';

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

  /** Traffic Participants */
  const refVolumeCar = useRef("");
  const refVolumeLargeVehicles = useRef("");
  const refVolumeMotorcycles = useRef("");
  const refVolumeCyclists = useRef("");
  const refVolumePedestrians = useRef("");

  /** Traffic Incident */
  const refIncidentTiming = useRef("");
  const refIncidentType = useRef("");
  const refCollisionType = useRef("");
  const refCollisionCategory = useRef("");

  /** Potential Cause of Incident */
  const refCauseOfIncident = useRef([]);

  const handleFormSubmission = (e: FormEvent) => {
    e.preventDefault();
    
    let annotationData = {
      annotations: {
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
        },
        traffic_participants: {
          volume_car: refVolumeCar.current.value,
          volume_large_vehicles: refVolumeLargeVehicles.current.value,
          volume_motorcycles: refVolumeMotorcycles.current.value,
          volume_cyclists: refVolumeCyclists.current.value,
          volume_pedestrians: refVolumePedestrians.current.value,
        },
        traffic_incident: {
          incident_timing: refIncidentTiming.current.value,
          incident_type: refIncidentType.current.value,
          collision_type: refCollisionType.current.value,
          collision_category: refCollisionCategory.current.value,
        },
        analysis: {
          cause_of_incident: refCauseOfIncident.current.value,
        }
      }
    }

    console.log(annotationData);

    fetch("/api/annotator/save-annotations/" + datasetName + "/" + videoName + "/" + imageFileName, {
      method: "post",
      headers: new Headers({
        "ngrok-skip-browser-warning": "1",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(annotationData),
    })
    .then(response => response.json())
    .then(response_json => {
      console.log(response_json);
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
        indentClass="ml-16"
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
        indentClass="ml-16"
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
        indentClass="ml-16"
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
        indentClass="ml-16"
      />
    </>
  );

  const environmentDetailsInputs = (
    <>
      <div id="road-details-panel">
        <p className="ml-8">Road details:</p>
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
        indentClass="ml-8"
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
        indentClass="ml-8"
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
        indentClass="ml-8"
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
        indentClass="ml-8"
      />
    </>
  );

  const traficParticipantsInputs = (
    <>
      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={objectVolumeOptions}
            inputValueName="volume_car"
            inputValueRef={refVolumeCar}
          />
        )}
        label="Car Volume"
        indentClass="ml-8"
      />

      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={objectVolumeOptions}
            inputValueName="volume_large_vehicles"
            inputValueRef={refVolumeLargeVehicles}
          />
        )}
        label="Trucks/Large Vehicles Volume"
        indentClass="ml-8"
      />

      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={objectVolumeOptions}
            inputValueName="volume_motorcycles"
            inputValueRef={refVolumeMotorcycles}
          />
        )}
        label="Motorcycles Volume"
        indentClass="ml-8"
      />

      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={objectVolumeOptions}
            inputValueName="volume_cyclists"
            inputValueRef={refVolumeCyclists}
          />
        )}
        label="Cyclists Volume"
        indentClass="ml-8"
      />

      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={objectVolumeOptions}
            inputValueName="volume_pedestrians"
            inputValueRef={refVolumePedestrians}
          />
        )}
        label="Pedestrians Volume"
        indentClass="ml-8"
      />
    </>
  )

  const traficIncidentInputs = (
    <>
      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "No incident", "Potential", "Happening", "Aftermath" ]}
            inputValueName="incident_timing"
            inputValueRef={refIncidentTiming}
          />
        )}
        label="Is there a traffic incident?"
        indentClass="ml-8"
      />

      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "N/A", "Collision with Others", "Rollover Accident", "Run-off-road Accident", "Chain Accident" ]}
            inputValueName="incident_type"
            inputValueRef={refIncidentType}
          />
        )}
        label="What type of incident?"
        indentClass="ml-8"
      />

      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "N/A", "T-Bone", "Rear end", "Front end", "Side Swipe Collision", "Run-off-road", "Chain Collision" ]}
            inputValueName="collision_type"
            inputValueRef={refCollisionType}
          />
        )}
        label="What type of collision?"
        indentClass="ml-8"
      />

      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "N/A", "Car-on-car", "Car-on-motorcycle", "Car-on-truck/bus/etc", "Truck/bus/etc-on-motorcycle",
                      "Vehicle on pedestrians", "Vehicle on cyclists", "Multiple" ]}
            inputValueName="collision_category"
            inputValueRef={refCollisionCategory}
          />
        )}
        label="Category of the collision"
        indentClass="ml-8"
      />
    </>
  )

  const causeOfIncidentInputs = (
    <>
      <InputWithLabel 
        inputElem={(
          <MultiSelectDropdown
            options={[ "Speeding/Lack of reaction time", 
                       "Rollover Accident", 
                       "Run-off-road Accident", 
                       "Chain Accident" 
                    ]}
            inputValueName="cause_of_incident"
            inputValueRef={refCauseOfIncident}
          />
        )}
        label="What were the potential cause of the incident?"
        indentClass="ml-8"
      />
    </>
  )

  return (
    <>
      <div className="w-10"></div> 
      <form className="flex space-x-4" onSubmit={handleFormSubmission} id="annotator_form">
      
        <div className="flex flex-col">
          <div id="environment-details-panel">
            <p className="font-bold">Environment details:</p>
            {environmentDetailsInputs}
          </div>

          <div id="traffic-details-panel">
            <p className="font-bold">Traffic details:</p>
            {traficParticipantsInputs}
          </div>
        </div>

        <div className="flex flex-col">
          <div id="environment-details-panel">
            <p className="font-bold">Environment details:</p>
            {traficIncidentInputs}
          </div>

          <div id="traffic-details-panel">
            <p className="font-bold">Traffic details:</p>
            {causeOfIncidentInputs}
          </div>

          <button type="submit" className="bg-slate-100 p-2 rounded-lg">Submit</button>
        </div>
        
      </form> 
    </>
  )
}

export default AnnotatorInterface;
