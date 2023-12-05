
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
    console.log(new FormData(e.target))
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
        (<fieldset id={section_details["section_id"]} className="border-4 p-4 rounded-lg border ring-blue-500">
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
