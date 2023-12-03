
import React, { useRef, useState, FormEvent } from 'react';
import { TextField, InputWithLabel, ImageSelector } from '../components'

interface ModelInterfacePageProps {
}

const ModelInterfacePage: React.FC = () => {
  const defaultSystemPrompt =
`A chat between a curious human and an artificial intelligence assistant focused on traffic incident detection. 
The assistant gives helpful, detailed, polite and relevant answers to the human's questions.`

  const btnDefaultClassName = "py-2 px-4 bg-emerald-200 rounded-lg"

  const refDatasetName = useRef("");
  const refVideoName = useRef("");
  const refImageFilename = useRef("");
 
  const refSystemPrompt = useRef("");
  const [promptFields, setPromptFields] = useState<[number, string, string][]>([]);
  const [promptKeyCounter, setPromptKeyCounter] = useState(0);

  const promptTemplateForm = (
    <>
      <form id="prompt-Template-form" className="flex flex-col space-y-4 w-full" onSubmit={(e : FormEvent) => {
        e.preventDefault();
        console.log(promptFields);

        const requestBody = {
          "prompt_framework": {
            "system_prompt": refSystemPrompt.current,
            "prompt_sequence": promptFields.map(([keyIndex, value, llavaOutput]) => value),
          },
          "dataset_name": refDatasetName.current,
          "video_name": refVideoName.current,
          "image_filename": refImageFilename.current,
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
              placeholder="Enter system prompt"
              initialValue={defaultSystemPrompt}
              inputValueName="system_prompt"
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
