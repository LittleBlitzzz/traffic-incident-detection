
import React, { useRef, FormEvent } from 'react';
import { Dropdown, MultiSelectDropdown, InputWithLabel } from './';

interface AnnotatorInterfaceProps {
  datasetName: string;
  videoName: string;
  imageFileName: string;
  interfaceTitle?: string;
  readonly?: boolean;
}

const AnnotatorInterface: React.FC<AnnotatorInterfaceProps> = ({ 
    datasetName, 
    videoName, 
    imageFileName,
    interfaceTitle=null,
    readonly=false,
  }) => {

  const unableToIdentifyOption = "Unknown/Indistinguishable";
  const objectVolumeOptions = [ "None", "At least one", "A few", "Multiple" ];
  
  /** Road Details */
  const refRoadLoc = useRef("");
  const refRoadType = useRef("");
  const refRoadLayout = useRef("");
  const refRoadSurroundings = useRef<string[]>([]);

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
  const refCauseOfIncident = useRef<string[]>([]);

  const handleFormSubmission = (e: FormEvent) => {
    e.preventDefault();
    
    let annotationData = {
      annotations: {
        environment_details: {
          road_details: {
            location: refRoadLoc.current,
            type_of_road: refRoadType.current,
            road_layout: refRoadLayout.current,
            surroundings: refRoadSurroundings.current,
          },
          time_of_day: refTimeOfDay.current,
          weather: refWeatherCond.current,
          lighting: refLightingCond.current,
          traffic_density: refTrafficDensity.current,
        },
        traffic_participants: {
          volume_car: refVolumeCar.current,
          volume_large_vehicles: refVolumeLargeVehicles.current,
          volume_motorcycles: refVolumeMotorcycles.current,
          volume_cyclists: refVolumeCyclists.current,
          volume_pedestrians: refVolumePedestrians.current,
        },
        traffic_incident: {
          incident_timing: refIncidentTiming.current,
          incident_type: refIncidentType.current,
          collision_type: refCollisionType.current,
          collision_category: refCollisionCategory.current,
        },
        analysis: {
          cause_of_incident: refCauseOfIncident.current,
        }
      }
    }

    console.log(annotationData);

    if (!readonly) {
      fetch("/api/annotator/annotations/" + datasetName + "/" + videoName + "/" + imageFileName, {
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
    }
  };

  const roadDetailsInputs = (
    <>
      <InputWithLabel 
        inputElem={(
          <Dropdown
            options={[ "Urban", "Suburban", "Rural", unableToIdentifyOption ]}
            inputValueName="road_loc"
            refInputValue={refRoadLoc}
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
            refInputValue={refRoadType}
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
            refInputValue={refRoadLayout}
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
            refInputValue={refRoadSurroundings}
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
            refInputValue={refTimeOfDay}
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
            refInputValue={refWeatherCond}
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
            refInputValue={refLightingCond}
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
            refInputValue={refTrafficDensity}
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
            refInputValue={refVolumeCar}
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
            refInputValue={refVolumeLargeVehicles}
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
            refInputValue={refVolumeMotorcycles}
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
            refInputValue={refVolumeCyclists}
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
            refInputValue={refVolumePedestrians}
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
            refInputValue={refIncidentTiming}
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
            refInputValue={refIncidentType}
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
            refInputValue={refCollisionType}
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
            refInputValue={refCollisionCategory}
          />
        )}
        label="Category of the collision"
        indentClass="ml-8"
      />
      
      <InputWithLabel 
        inputElem={(
          <MultiSelectDropdown
            options={[ "Speeding/Lack of reaction time", 
                       "Rollover Accident", 
                       "Run-off-road Accident", 
                       "Chain Accident" 
                    ]}
            inputValueName="cause_of_incident"
            refInputValue={refCauseOfIncident}
          />
        )}
        label="What were the potential cause of the incident?"
        indentClass="ml-8"
      />

    </>
  )

  const annotatorForm = (
    <>
      <fieldset id="environment-details-fieldset" className="border-4 p-4 rounded-lg border ring-blue-500">
        <legend className="font-bold text-lg px-2">Environment Details</legend>
        {environmentDetailsInputs}
      </fieldset>
      
      <fieldset id="traffic-participants-fieldset" className="border-4 p-4 rounded-lg border ring-blue-500">
        <legend className="font-bold text-lg px-2">Traffic Participants Details</legend>
        {traficParticipantsInputs}
      </fieldset>
      
      <fieldset id="incident-details-fieldset" className="border-4 p-4 rounded-lg border ring-blue-500">
        <legend className="font-bold text-lg px-2">Traffic Incident Details</legend>
        {traficIncidentInputs}
      </fieldset>
    </>
  )

  return (
    <form className="flex flex-col space-y-8 place-content-center" onSubmit={handleFormSubmission} id="annotator_form">

      {interfaceTitle ? (
        <fieldset className="flex space-x-8 self-center">
          <legend className="font-bold text-lg px-2">{interfaceTitle}</legend>
          {annotatorForm}
        </fieldset>
      ) : (
        <div className="flex space-x-8 self-center">
          {annotatorForm}
        </div>
      )}

      {!readonly && (
        <div className="self-end w-80">
          <button type="submit" className="form-submit-btn w-full">Submit</button>
        </div>
      )}
    </form>
  )
}

export default AnnotatorInterface;
