
import React, { useRef, useState, FormEvent } from 'react';
import { TextField, InputWithLabel, ImageSelector } from '../components'

interface ModelInterfacePageProps {
}

const ModelInterfacePage: React.FC = () => {
  const defaultSystemPrompt =
`
A chat between a curious human and an artificial intelligence assistant focused on traffic incident detection. The assistant gives helpful, detailed, polite and relevant answers to the human's questions.

The assistant is tasked with classifying traffic incidents (if any) in the given footage. The user will describe each section, and the assistant will analyse the image and output the variables in JSON format.
`.trim().replace(/^\s+|\s+$/g, '');

  const btnDefaultClassName = "py-2 px-4 bg-emerald-200 rounded-lg"

  const refDatasetName = useRef("extracted_frames");
  const refVideoName = useRef("000000");
  const refImageFilename = useRef("0.jpg");
  const refModelTemperature = useRef(0.2);
  const refResultsSavePath = useRef("/content/drive/MyDrive/Projects/FYP_Sunway/Results/test.txt");
 
  const refSystemPrompt = useRef(defaultSystemPrompt);
  const [promptFields, setPromptFields] = useState<[number, string, string][]>([
    [0, 
`
environment:
  lighting: (day, night, dawn/dusk)
  road_surface_condition: (dry, wet, icy, snowy, potholes)
  road_layout: (straight, curved, intersection, roundabout)
  road_type: (alley, street, dirt_road)
  road_location: (urban, rural)
  traffic_density: (empty, sparse, congested)
  traffic_speed: (not_moving_or_slow, fast)
  surroundings (multi-choice list): (traffic_lights, road_signs, pedestrian_crosswalk, sidewalk, overhead_bridge, bicycle_lanes, speed_bumps, construction_work, street_lights, electric_polls, trees/nature, animals_crossing, others)
`.trim().replace(/^\s+|\s+$/g, ''),
    ""
    ],
    [1, 
`
road_users:
  car: (none, at_least_one, a_few, many)
  truck_or_large_vehicle: (none, at_least_one, a_few, many)
  motorcycle: (none, at_least_one, a_few, many)
  bicycle: (none, at_least_one, a_few, many)
  pedestrian: (none, at_least_one, a_few, many)
  other: (none, at_least_one, a_few, many)
`.trim().replace(/^\s+|\s+$/g, ''),
    ""
    ],
    [2, 
`
incident_details:
  is_traffic_incident: (true, false)
  type_of_incident: (run_off_road, roll_over, single_car_collision, multicar_collision)
  type_of_collision: (rear-end, side_impact, rollover, sideswipe, head-on, single_car, multiple_vehicle_pile-up)
  types_of_road_users_involved: [car, truck_or_large_vehicle, motorcycle, bicycle, pedestrian]
  severity_of_incident: (none, light_injuries, serious_injuries, fatal)
  causes (multi-choice list):
    human_behavior: (driver_error, impairment_or_distraction, behavior_or_inexperience, pedestrian_causes)
    injudicious_actions: (jaywalking, speeding_red_light)
    vehicle_defects
    road_conditions
    obstructed_vision
    animals_crossing
`.trim().replace(/^\s+|\s+$/g, ''),
    ""
    ]
  ]);
  const [promptKeyCounter, setPromptKeyCounter] = useState(3);

  const promptTemplateForm = (
    <>
      <form id="prompt-Template-form" className="flex flex-col space-y-4 w-full" onSubmit={(e : FormEvent) => {
        e.preventDefault();
        console.log(refModelTemperature.current);
        console.log(refSystemPrompt.current);
        console.log(promptFields);

        const requestBody = {
          "prompt_framework": {
            "system_prompt": refSystemPrompt.current,
            "prompt_sequence": promptFields.map(([keyIndex, value, llavaOutput]) => value),
            "temperature": refModelTemperature.current,
          },
          "dataset_name": refDatasetName.current,
          "video_name": refVideoName.current,
          "image_filename": refImageFilename.current,
          "save_path_name": refResultsSavePath.current,
        };

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
        
        {promptFields.map(([keyIndex, value, llavaOutput], index) => (
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
              <div className="flex space-x-4 self-end">
                <p className="self-center">{llavaOutput}</p>
                <p className="p-1 bg-slate-100 rounded-md">LLaVA</p>
              </div>
            )}
          </>
        ))}

        <div className="flex space-x-4 self-end">
          <button className={btnDefaultClassName} type="button" onClick={() => {
            setPromptFields([...promptFields, [promptKeyCounter, '', '' ]]);
            setPromptKeyCounter(promptKeyCounter + 1);
          }}>Add prompt</button>
          <button className={btnDefaultClassName} type="submit">Update prompt template</button>
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
