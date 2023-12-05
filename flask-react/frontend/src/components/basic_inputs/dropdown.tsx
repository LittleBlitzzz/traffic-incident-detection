
import React, { useState, useEffect, RefObject } from 'react';
import { OutsideClickNotifier, ExpandArrowIcon } from '../';

interface DropdownProps {
  options?: string[];
  title?: string;
  initialValue?: string;
  inputValueName?: string;
  refInputValue?: RefObject<string>;
  onOptionSelected?: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ 
    options = [], 
    title = null,
    initialValue = null,
    inputValueName = "_dropdown",
    refInputValue = null,
    onOptionSelected = null,
  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  if ( (title === null || title === undefined) && options.length > 0) {
    initialValue = options[0];
  }

  useEffect(() => {
    if (initialValue !== null && initialValue !== undefined) {
      setSelectedOption(initialValue);
    }
  }, [initialValue])

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);

    if (onOptionSelected) {
      onOptionSelected(option);
    }
    if (refInputValue) {
      refInputValue.current = option;
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  }

  return (
    <div className="inline-block text-left">
      <button
        type="button"
        onClick={toggleDropdown}
        className="dropdown-btn"
      >
        <p className="truncate">
          {selectedOption || title || "Select an Option"}
        </p>
        <ExpandArrowIcon
        />
      </button>

      {isOpen && (
        <div className="relative">
          <OutsideClickNotifier
            children = {(
              <div className="origin-top-right absolute max-h-80 right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div
                  className="py-1 overflow-y-auto max-h-80"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionClick(option)}
                      className="block text-left px-8 py-2 text-sm w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
            onNotified={closeDropdown}
          />
        </div>
      )}
      <input type="hidden" name={inputValueName} value={selectedOption || ''} />
    </div>
  );
};

interface MultiSelectDropdownProps {
  options?: string[];
  title?: string;
  inputValueName?: string;
  refInputValue?: RefObject<string[]>;
  initialValue?: string[];
  onOptionSelected?: (options: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    options = [],
    title = null,
    inputValueName = '_multiselect',
    refInputValue = null,
    initialValue = null,
    onOptionSelected = null,
  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    if (initialValue !== null && initialValue !== undefined) {
      setSelectedOptions(initialValue);
    }
  }, [initialValue])

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  
  const handleOptionClick = (selectedOption: string) => { 
    setSelectedOptions((prevOptions) => {
      if (selectedOption === 'None') {
        return [];
      } else {
        const isSelected = prevOptions.includes(selectedOption);
        const newOptions = isSelected
        ? prevOptions.filter((option) => option !== selectedOption)
        : [...prevOptions, selectedOption];

        if (onOptionSelected) {
          onOptionSelected(newOptions);
        }
        if (refInputValue) {
          refInputValue.current = newOptions;
        }
        return newOptions;
      }
    });
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="dropdown-btn"
        >
          <p className="truncate">
            {selectedOptions.length > 0
              ? selectedOptions.join(', ')
              : title || 'Select option(s)'}
          </p>
          <ExpandArrowIcon
          />
        </button>
      </div>

      {isOpen && (
        <OutsideClickNotifier
          children={
            <div className="origin-top-right absolute max-h-80 right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div
                className="py-1 overflow-y-auto max-h-80"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  key="None"
                  type="button"
                  onClick={() => handleOptionClick('None')}
                  className={`block text-left px-8 py-2 text-sm w-full ${
                    selectedOptions.includes('None')
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  role="menuitem"
                >
                  None
                </button>
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionClick(option)}
                    className={`block text-left px-8 py-2 text-sm w-full ${
                      selectedOptions.includes(option)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    role="menuitem"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          }
          onNotified={closeDropdown}
        />
      )}
      <input type="hidden" name={inputValueName} value={selectedOptions.join(',')} />
    </div>
  );
};

export { Dropdown, MultiSelectDropdown };
