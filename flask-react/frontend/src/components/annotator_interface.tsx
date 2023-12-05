
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

  const imageFullPath = datasetName + "/" + videoName + "/" + imageFileName;
  const [annotatorVariables, setAnnotatorVariables] = useState(null);
  const [annotationData, setAnnotationData] = useState(null);

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
  
  useEffect(() => {
    fetch("/api/annotator/annotations/" + imageFullPath, {
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "1",
      }),
    })
    .then(response => response.json())
    .then(response_json => {
      const annotationForCurrImage = response_json["existing_annotations"][imageFileName]["annotations"];
      setAnnotationData(annotationForCurrImage);
      console.log(annotationForCurrImage);
    })
    .catch(error => console.error('Error:', error));
  }, []);

  const handleFormSubmission = (e: FormEvent) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    console.log(formData);
    
    const annotationDataToSubmit = {
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
      traffic_incident_details: {
        is_traffic_incident: formData["is_traffic_incident"],
        single_vehicle_incident: formData["single_vehicle_incident"],
        multi_vehicle_incident: formData["multi_vehicle_incident"],
        incident_severity: formData["incident_severity"],
        road_users_involved: formData["road_users_involved"],
        cause_of_incident: formData["cause_of_incident"],
      },
    };

    fetch("/api/annotator/annotations/" + imageFullPath, {
      method: "post",
      headers: new Headers({
        "ngrok-skip-browser-warning": "1",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        annotations: annotationDataToSubmit,
      }),
    })
    .then(response => response.json())
    .then(response_json => {
      console.log(response_json);
    })
    .catch(error => console.error('Error:', error));
    
  };

  return annotatorVariables === null || annotationData === null ? (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
  ) : 
  (<form className="flex flex-col space-y-8 place-content-center" onSubmit={handleFormSubmission} id="annotator_form">
    <fieldset className="flex space-x-8 self-center">
      { interfaceTitle && (<legend>{interfaceTitle}</legend>)}

      { annotatorVariables["sections"].map(section_details => 
        (<fieldset id={section_details["section_id"] + "-fieldset"}>
          <legend>{section_details["section_title"]}</legend>
          {section_details["section_variables"].map(variable => {
            
            if (variable.is_multi_select) {
              let initialValue = annotationData[section_details["section_id"]][variable["input_name"]] 
              if (!initialValue) {
                initialValue = []
              }
              if (initialValue === "none") {
                initialValue = [];
              }

              return (<InputWithLabel 
                inputElem={(
                  <MultiSelectDropdown
                    options={variable.options}
                    inputValueName={variable.input_name}
                    initialValue={annotationData[section_details.section_id][variable.input_name] || []}
                  />
                )}
                label={variable["label"]}
              />)
            } else {
              return (<InputWithLabel 
                inputElem={(
                  <Dropdown
                    options={variable.options}
                    inputValueName={variable.input_name}
                    initialValue={annotationData[section_details.section_id][variable.input_name] || variable.options[0]}
                  />
                )}
                label={variable["label"]}
              />)
            }
          })}
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
