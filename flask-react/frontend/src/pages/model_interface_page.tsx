
import React, { useRef, useState, FormEvent } from 'react';
import { TextField, InputWithLabel, ImageSelector, FetchButton } from '../components'

interface ModelInterfacePageProps {
}

const ModelInterfacePage: React.FC = () => {
  const defaultSystemPrompt =
`
A chat between a curious human and an artificial intelligence assistant focused on traffic incident detection. The assistant gives helpful, detailed, polite and relevant answers to the human''s questions.
Return the output in YAML format, and only use the options provided.
`.trim().replace(/^\s+|\s+$/g, '');

  const refDatasetName = useRef("extracted_frames");
  const refVideoName = useRef("000000");
  const refImageFilename = useRef("0.jpg");

  const refModelTopP = useRef(0.2);
  const refModelTemperature = useRef(0.2);
  const refResultsSavePath = useRef("prompts/ultra_basic.txt");
 
  const refSystemPrompt = useRef(defaultSystemPrompt);
  const [promptFields, setPromptFields] = useState<[number, string, string][]>([
    [0, 
`
Answer this section about the traffic incident.

is_traffic_incident:
-options: (true, false)
incident_type:
-options: (none, single_vehicle, multi_vehicle, others)
single_vehicle_incident: 
-options: (none, run_off_road, rollover, collision_with_surroundings, collision_with_pedestrian, vehicle_lost_control, others)
incident_severity
-options: (none, light_injuries, serious_injuries)
`.trim().replace(/^\s+|\s+$/g, ''),
    ""
    ],
    [1, 
`
multi_vehicle_incident: 
-options: (none, rear_end_collision, head_on_collision, side_collision, multi_vehicle_pileup, others)
`.trim().replace(/^\s+|\s+$/g, ''),
    ""
    ],
    [2, 
`
Answer this section about the road users are involved.

cars_involved_in_incident:
-options: (true, false)
large_vehicles_involved_in_incident:
-options: (true, false)
motorcycles_involved_in_incident:
-options: (true, false)
cyclists_involved_in_incident:
-options: (true, false)
pedestrians_involved_in_incident:
-options: (true, false)
`.trim().replace(/^\s+|\s+$/g, ''),
    ""
    ],
    [3, 
`
Answer this section about the potential cause of the incident.

is_caused_by_human_behaviour:
-options: (true, false)
is_caused_by_injudicious_actions:
-options: (true, false)
is_caused_by_vehicle_malfunction
-options: (true, false)
is_caused_by_road_conditions
-options: (true, false)
`.trim().replace(/^\s+|\s+$/g, ''),
    ""
    ]
  ]);

  const [promptKeyCounter, setPromptKeyCounter] = useState(promptFields.length);

  const promptTemplateForm = (
    <>
      <form id="prompt-Template-form" className="flex flex-col space-y-4 w-full" onSubmit={(e : FormEvent) => {
        e.preventDefault();
        const requestBody = {
          "prompt_framework": {
            "system_prompt": refSystemPrompt.current,
            "prompt_sequence": promptFields.map(([keyIndex, value, llavaOutput]) => value),
            "temperature": Number(refModelTemperature.current),
            "top_p": Number(refModelTopP.current),
          },
          "dataset_name": refDatasetName.current,
          "video_name": refVideoName.current,
          "image_filename": refImageFilename.current,
          "save_path_name": refResultsSavePath.current,
        };

        console.log(requestBody)

        fetch('api/model/ask-llava', {
          method: "POST",
          headers: new Headers({
            "ngrok-skip-browser-warning": "1",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(requestBody),
        })
        .then(response => response.json())
        .then(response_json => {
          const model_output = response_json["model_output"];
          console.log(model_output)
          setPromptFields(promptFields.map(([keyIndex, value, llavaOutput], index) => {
            return [keyIndex, value, `${model_output[0][index]}`]
          }));
        });

      }}>
        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter results save path"
              initialValue={refResultsSavePath.current}
              inputValueName="results-safe-path"
              refInputValue={refResultsSavePath}
            />
          )}
          label="Results Save Path"
          labelClassName="w-56 mb-auto"
        />

        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter model top-p"
              initialValue={0.2}
              inputValueName="model-top-p"
              refInputValue={refModelTopP}
              dataType="number"
            />
          )}
          label="Model Top P"
          labelClassName="w-56 mb-auto"
        />

        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter model temperature"
              initialValue={0.2}
              inputValueName="model-temperature"
              refInputValue={refModelTemperature}
              dataType="number"
            />
          )}
          label="Model Temperature"
          labelClassName="w-56 mb-auto"
        />

        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter system prompt"
              initialValue={defaultSystemPrompt}
              inputValueName="system-prompt"
              refInputValue={refSystemPrompt}
              rows={2}
            />
          )}
          label="System Prompt"
          labelClassName="w-56 mb-auto"
        />
        
        {promptFields.map(([keyIndex, value, llavaOutput], index) => {
          return(
          <>
            <div className="flex space-x-4">
              <InputWithLabel
                inputElem={(
                  <TextField
                    inputValueName={`prompt-index-${index}`}
                    initialValue={value}
                    placeholder={`Prompt ${index + 1}`}
                    onTextChanged={(text) => {
                      promptFields[index][1] = text;
                    }}
                    rows={2}
                  />
                )}
                key={`prompt-field-${keyIndex}`}
                parentWidthClass="w-full"
                label={`Prompt ${index + 1}`}
                labelClassName="w-56 mb-auto"
              />
              <button type="button" onClick={() => {
                setPromptFields(promptFields.filter( (prompt, i) => i !== index ));
              }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="red"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {llavaOutput !== null && llavaOutput !== "" &&(
              <div className="flex space-x-4 self-end w-full">
                <p className="self-center" dangerouslySetInnerHTML={{ __html: llavaOutput.replace(/(\r\n|\n|\r)/gm, "<br>") }} ></p>
                <div className="grow"></div>
                <p className="p-1 bg-slate-100 rounded-md">LLaVA</p>
              </div>
            )}
          </>
        )})}

        <div className="flex space-x-4 self-end">
          <button className="form-submit-btn" type="button" onClick={() => {
            setPromptFields([...promptFields, [promptKeyCounter, '', '' ]]);
            setPromptKeyCounter(promptKeyCounter + 1);
          }}>
            Add prompt
          </button>
          
          <button className="form-submit-btn" type="button" onClick={() => {
            const requestBody = {
              "prompt_framework": {
                "system_prompt": refSystemPrompt.current,
                "prompt_sequence": promptFields.map(([keyIndex, value, llavaOutput]) => value),
                "temperature": Number(refModelTemperature.current),
                "top_p": Number(refModelTopP.current),
              },
              "dataset_name": refDatasetName.current,
              "save_directory": "llava_test",
              "annotation_path": "annotations_compiled_20231206122224.csv",
            };

            fetch('api/model/test-on-annotated-data', {
              method: "POST",
              headers: new Headers({
                "ngrok-skip-browser-warning": "1",
                "Content-Type": "application/json",
              }),
              body: JSON.stringify(requestBody),
            })
            .then(response => response.json())
            .then(response_json => {
              console.log(response_json);
            });

          }}>
            Test prompt
          </button>

          <FetchButton className="form-submit-btn" type="submit">
            Update prompt template
          </FetchButton>
        </div>

      </form>
    </>
  )

  return (
    <>
      <div className="px-36 py-4">
        <p className="text-lg">Welcome to the model interface!</p>
        <ImageSelector 
          refDatasetName={refDatasetName}
          refVideoName={refVideoName}
          refImageFilename={refImageFilename}
        />
        <div className="flex space-x-8 py-4">
          {promptTemplateForm}
        </div>
      </div>
    </>
  );
}

export default ModelInterfacePage;
