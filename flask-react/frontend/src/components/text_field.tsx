
import React, { useState, useEffect, RefObject, ChangeEvent } from 'react';

interface TextFieldProps {
  inputValueName: string;
  inputValueRef?: RefObject<string | HTMLTextAreaElement>;
  initialValue?: string;
  placeholder?: string;
  dataType?: 'text' | 'textarea';
  onTextChanged?: (text: string) => void;
  rows?: number;
}

const TextField: React.FC<TextFieldProps> = ({
  inputValueName = "_textfield",
  inputValueRef = null,
  initialValue = "",
  placeholder = "",
  dataType = "text",
  onTextChanged = null,
  rows = 3,
}) => {
  const [text, setText] = useState(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText(newText);

    if (onTextChanged) {
      onTextChanged(newText);
    }
  };

  return (
    <>
      {dataType === 'textarea' ? (
        <textarea
          className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          name={inputValueName}
          placeholder={placeholder}
          ref={inputValueRef as RefObject<HTMLTextAreaElement>}
          value={text}
          onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          rows={rows}
        />
      ) : (
        <input
          className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          type="text"
          name={inputValueName}
          placeholder={placeholder}
          ref={inputValueRef as RefObject<HTMLInputElement>}
          value={text}
          onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
        />
      )}
    </>
  );
};

export default TextField;
