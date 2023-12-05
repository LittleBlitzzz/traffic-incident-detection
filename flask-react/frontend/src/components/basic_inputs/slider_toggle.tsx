import React, { useState, useRef, ChangeEvent, RefObject } from 'react';

interface SliderToggleProps {
  initialValue?: boolean;
  onToggleChanged?: (value: boolean) => void;
  refToggleValue?: RefObject<boolean>;
}

const SliderToggle: React.FC<SliderToggleProps> = ({
  initialValue = false,
  onToggleChanged = null,
  refToggleValue = null,
}) => {
  const [isToggled, setToggled] = useState(initialValue);

  const handleToggle = () => {
    const newValue = !isToggled;
    setToggled(newValue);

    if (onToggleChanged) {
      onToggleChanged(newValue);
    }

    if (refToggleValue) {
      refToggleValue.current = newValue;
    }
  };

  return (
    <div
      className={`relative w-16 h-8 rounded-full ${isToggled ? 'bg-green-500' : 'bg-gray-400'} p-1 cursor-pointer`}
      onClick={handleToggle}
    >
      <div
        className={`absolute left-0 w-6 h-6 bg-white rounded-full shadow-md transform ${isToggled ? 'translate-x-full' : ''} transition-transform`}
      ></div>
    </div>
  );
};

export default SliderToggle;
