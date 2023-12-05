
import React, { useState, RefObject, ChangeEvent } from 'react';

interface TextFieldProps {
  inputValueName?: string;
  initialValue?: string;
  placeholder?: string;
  dataType?: 'text' | 'number';
  refInputValue?: RefObject<string>;
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

    if (refInputValue) {
      refInputValue.current = newText;
    }
  };
 
  return (
    <>
      {rows !== null && rows > 1 ? (
        <textarea
          name={inputValueName}
          placeholder={placeholder}
          value={text}
          onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          rows={rows}
        />
      ) : (
        <input
          type={dataType}
          name={inputValueName}
          placeholder={placeholder}
          value={text}
          onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
        />
      )}
    </>
  );
};

export default TextField;
