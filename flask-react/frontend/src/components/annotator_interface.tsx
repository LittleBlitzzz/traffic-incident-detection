
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


  const [annotatorVariables, setAnnotatorVariables] = useState(null);

  useEffect(() => {
    fetch("/annotator_variables.yaml", {
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "1",
      }),
    })
    .then(response => response.text())
    .then(content => {
      const loadedVariables = yaml.load(content);
      console.log(loadedVariables)

      setAnnotatorVariables(loadedVariables);
    })
    .catch(error => console.error('Error:', error));
  }, []);

  const handleFormSubmission = (e: FormEvent) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    console.log(formData);
    
    const annotationData = {
      environment_details: {
        lighting: formData["lighting"],
        road_surface_condition: formData["road_surface_condition"],
        road_layout: formData["road_layout"],
        road_type: formData["road_type"],
        traffic_density: formData["traffic_density"],
        traffic_speed: formData["traffic_speed"],
        surroundings: formData["surroundings"],
      },
      road_user_details: {
        volume_car: formData["volume_car"],
        volume_large_vehicle: formData["volume_large_vehicle"],
        volume_motorcycle: formData["volume_motorcycle"],
        volume_cyclist: formData["volume_cyclist"],
        volume_pedestrian: formData["volume_pedestrian"],
      },
      traffic_incident: {
        is_traffic_incident: formData["is_traffic_incident"],
        single_vehicle_incident: formData["single_vehicle_incident"],
        multi_vehicle_incident: formData["multi_vehicle_incident"],
        incident_severity: formData["incident_severity"],
        road_users_involved: formData["road_users_involved"],
        cause_of_incident: formData["cause_of_incident"],
      },
    };

    fetch("/api/annotator/annotations/" + datasetName + "/" + videoName + "/" + imageFileName, {
      method: "post",
      headers: new Headers({
        "ngrok-skip-browser-warning": "1",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        annotations: annotationData
      }),
    })
  };

  return annotatorVariables === null ? (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
  ) : 
  (<form className="flex flex-col space-y-8 place-content-center" onSubmit={handleFormSubmission} id="annotator_form">
    <fieldset className="flex space-x-8 self-center">
      { interfaceTitle && (<legend>{interfaceTitle}</legend>)}

      { annotatorVariables["sections"].map(section_details => 
        (<fieldset id={section_details["section_id"]}>
          <legend>{section_details["section_title"]}</legend>
          {section_details["section_variables"].map(variable => variable["is_multi_select"] ? 
            (<InputWithLabel 
              inputElem={(
                <MultiSelectDropdown
                  options={variable["options"]}
                  inputValueName={variable["input_name"]}
                />
              )}
              label={variable["label"]}
            />)
            : 
            (<InputWithLabel 
              inputElem={(
                <Dropdown
                  options={variable["options"]}
                  inputValueName={variable["input_name"]}
                />
              )}
              label={variable["label"]}
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
  </form>)
}

export default AnnotatorInterface;
