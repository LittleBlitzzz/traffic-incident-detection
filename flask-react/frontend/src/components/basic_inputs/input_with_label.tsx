
import React from 'react';

interface InputWithLabelProps { 
  inputElem : React.ReactElement<any>;
  label: string;
  labelClassName?: string;
  indentClass?: string;
  parentWidthClass?: string;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({ 
    inputElem, 
    label,
    labelClassName="w-40",
    indentClass="",
    parentWidthClass="",
  }) => {

  let parentDivClass = `flex items-center py-0.5 ${indentClass} ${parentWidthClass}`;

  return (
    <>
      <div className={parentDivClass}>
        <p className={labelClassName}>{label}</p>
        {inputElem}
      </div>
    </>
  )
}

export default InputWithLabel;