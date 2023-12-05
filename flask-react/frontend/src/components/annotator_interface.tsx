
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Dropdown, MultiSelectDropdown, InputWithLabel } from './';
import * as yaml from 'js-yaml';

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


  let annotatorVariables = []
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/annotator_variables.yaml' + datasetName, {
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "1",
      }),
    })
    .then(response => response.text())
    .then(content => {
      annotatorVariables = yaml.load(content);
      console.log(annotatorVariables)

      setLoading(false);
    })
    .catch(error => console.error('Error:', error));
  });

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

  return loading ? (

  ) : (
    <form className="flex flex-col space-y-8 place-content-center" onSubmit={handleFormSubmission} id="annotator_form">
      <fieldset className="flex space-x-8 self-center">
        { interfaceTitle && (<legend>{interfaceTitle}</legend>)}

        { annotatorVariables.map((section_details, index) => (
          <fieldset id={section_details["section_id"]} className="border-4 p-4 rounded-lg border ring-blue-500">
            <legend>{section_details["section_title"]}</legend>
            {section_variables.map((variable, index) => variable["is_multi_select"] ? (
                
              ) : (
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
              />)
            )}
          </fieldset>
        )) }

      </fieldset>

      {!readonly && (
        <div className="self-end w-80">
          <button type="submit" className="form-submit-btn w-full">Submit</button>
        </div>
      )}
    </form>
  )
}

export default AnnotatorInterface;
