
import React, { useRef, useState, FormEvent } from 'react';
import { TextField, InputWithLabel, ImageFromBackend } from '../components'

interface ModelInterfacePageProps {
}

const ModelInterfacePage: React.FC<ModelInterfacePageProps> = ({ }) => {
  const [imagePath, setImagePath] = useState("")

  const defaultSystemPrompt =
`A chat between a curious human and an artificial intelligence assistant focused on traffic incident detection. 
The assistant gives helpful, detailed, polite and relevant answers to the human's questions.`

  const refDatasetName = useRef("");
  const refVideoName = useRef("");
  const refImageFilename = useRef("");
  const refSystemPrompt = useRef(defaultSystemPrompt);

  const fixedInputsForm = (
    <form id="fixed-inputs-form" className="flex flex-col space-y-4 w-1/2" onSubmit={(e: FormEvent) => {
      e.preventDefault();
      console.log("hi");
      setImagePath([ refDatasetName.current.value, refVideoName.current.value, refImageFilename.current.value].join("/"))
    }}>
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
            placeholder="Enter Image Filename"
            initialValue="0.jpg"
            inputValueName="image_filename"
            inputValueRef={refImageFilename}
          />
      )}
      label="Image Filename"
      labelClassName="w-56 mb-auto"
      />

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

      <button className="p-2 w-1/2 bg-emerald-200 rounded-lg self-end">Refresh</button>
    </form>
  )

  return (
    <>
      <div className="px-36 py-4">
        <p className="text-lg">Welcome to the model interface!</p>
        <div className="flex space-x-8 py-4">
          {fixedInputsForm}
          { refDatasetName.current.value && refVideoName.current.value && refImageFilename.current.value && (<ImageFromBackend
            datasetName={refDatasetName.current.value}
            videoName={refVideoName.current.value}
            imageFileName={refImageFilename.current.value}
            altText={imagePath}
          />)}
        </div>
        <div>
        </div>
      </div>
    </>
  );
}

export default ModelInterfacePage;

