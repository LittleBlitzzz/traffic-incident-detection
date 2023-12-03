
import React, { useState, useEffect, RefObject, ChangeEvent } from 'react';

interface TextFieldProps {
  inputValueName?: string;
  initialValue?: string;
  placeholder?: string;
  dataType?: 'text' | 'number';
  refInputValue?: RefObject<string | HTMLTextAreaElement>;
  onTextChanged?: (text: string) => void;
  rows?: number;
}

const TextField: React.FC<TextFieldProps> = ({
  inputValueName = "_textfield",
  initialValue = "",
  placeholder = "",
  dataType = "text",
  refInputValue = null,
  onTextChanged = null,
  rows = null,
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
      {rows !== null && rows > 1 ? (
        <textarea
          className="w-full px-3 py-2 text-base border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          name={inputValueName}
          placeholder={placeholder}
          ref={refInputValue as RefObject<HTMLTextAreaElement>}
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
          ref={refInputValue as RefObject<HTMLInputElement>}
          value={text}
          onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
        />
      )}
    </>
  );
};

export default TextField;
