
import React, { useRef, useState, FormEvent } from 'react';
import { TextField, InputWithLabel, ImageFromBackend } from '../components'

interface ModelInterfacePageProps {
}

const ModelInterfacePage: React.FC<ModelInterfacePageProps> = ({ }) => {
  const [imagePath, setImagePath] = useState("")

  const defaultSystemPrompt =
`A chat between a curious human and an artificial intelligence assistant focused on traffic incident detection. 
The assistant gives helpful, detailed, polite and relevant answers to the human's questions.`

  const btnDefaultClassName = "py-2 px-4 bg-emerald-200 rounded-lg"

  const refDatasetName = useRef("");
  const refVideoName = useRef("");
  const refImageFilename = useRef("");

  const inputContextForm = (
    <form id="input-context-form" className="flex flex-col space-y-4 w-1/2" onSubmit={(e: FormEvent) => {
      e.preventDefault();
      setImagePath([ refDatasetName.current.value, refVideoName.current.value, refImageFilename.current.value].join("/"))
    }}>
      <fieldset className="border-4 p-4 rounded-lg border ring-blue-500">
        <legend>Input image</legend>
        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter dataset name"
              initialValue="extracted_frames"
              inputValueName="dataset_name"
              inputValueRef={refDatasetName}
            />
          )}
          label="Dataset Name"
          labelClassName="w-56 mb-auto"
        />
        
        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter video name"
              initialValue="000000"
              inputValueName="video_name"
              inputValueRef={refVideoName}
            />
          )}
          label="Video Name"
          labelClassName="w-56 mb-auto"
        />
        
        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter image filename"
              initialValue="0.jpg"
              inputValueName="image_filename"
              inputValueRef={refImageFilename}
            />
          )}
          label="Image Filename"
          labelClassName="w-56 mb-auto"
        />
      </fieldset>

      <button className={btnDefaultClassName + " self-end"} type="submit">Update context</button>
    </form>
  )

  const refSystemPrompt = useRef(defaultSystemPrompt);
  const [promptFields, setPromptFields] = useState([]);
  const [promptKeyCounter, setPromptKeyCounter] = useState(0);

  const promptTemplateForm = (
    <>
      <form id="prompt-Template-form" className="flex flex-col space-y-4 w-full" onSubmit={(e) => {
        e.preventDefault();
        console.log(promptFields);

        const requestBody = {
          "prompt_framework": {
            "system_prompt": refSystemPrompt.current.value,
            "prompt_sequence": promptFields.map(([keyIndex, value, llavaOutput]) => value),
          },
        };

        fetch('api/model/ask-llava', {
          method: "POST",
          headers: new Headers({
            "ngrok-skip-browser-warning": "1",
          }),
          body: JSON.stringify(requestBody),
        })
        .then(response => response.json())
        .then(response_json => {
          console.log(response_json);
          const model_output = response_json.get("model_output");

          setPromptFields(promptFields.map(([keyIndex, value, llavaOutput], index) => {
            return [keyIndex, value, `model_output[index]`]
          }));
        });

      }}>
        <InputWithLabel
          inputElem={(
            <TextField 
              placeholder="Enter system prompt"
              initialValue={defaultSystemPrompt}
              inputValueName="system_prompt"
              inputValueRef={refSystemPrompt}
              dataType="textarea"
              rows="4"
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
                    dataType="text"
                    onTextChanged={(text) => {
                      promptFields[index][1] = text;
                    }}
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
            
            {llavaOutput !== null &&(
              <div className="flex space-x-4 self-end">
                <p className="self-center">{llavaOutput}</p>
                <p className="p-1 bg-slate-100 rounded-md">LLaVA</p>
              </div>
            )}
          </>
        ))}

        <div className="flex space-x-4 self-end">
          <button className={btnDefaultClassName} type="button" onClick={() => {
            setPromptFields([...promptFields, [promptKeyCounter, '', null ]]);
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
        <div className="flex space-x-8 py-4">
          {inputContextForm}
          { refDatasetName.current.value && refVideoName.current.value && refImageFilename.current.value && (<ImageFromBackend
            datasetName={refDatasetName.current.value}
            videoName={refVideoName.current.value}
            imageFileName={refImageFilename.current.value}
            altText={imagePath}
          />)}
        </div>
        <div className="flex space-x-8 py-4">
          {promptTemplateForm}
        </div>
      </div>
    </>
  );
}

export default ModelInterfacePage;
