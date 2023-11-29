
import React, { useState, useEffect } from 'react';
import { OutsideClickNotifier } from './';

interface MultiSelectDropdownProps {
  options: string[];
  title: string;
  inputValueName: string;
  inputValueRef: RefObject<string[]>;
  initialValue: string[];
  onOptionSelected: (options: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    options = [],
    title = null,
    inputValueName = '_multiselect',
    initialValue = [],
    inputValueRef = null,
    onOptionSelected = null,
  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialValue);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (initialValue !== null && initialValue !== undefined) {
      setSelectedOption(initialValue);
    }
  }, [])
  
  const handleOptionClick = (option: string) => {
    // If the option is "None," clear the selection
    if (option === 'None') {
      setSelectedOptions([]);
    } else {
      const isSelected = selectedOptions.includes(option);

      setSelectedOptions((prevOptions) =>
        isSelected
          ? prevOptions.filter((prevOption) => prevOption !== option)
          : [...prevOptions, option]
      );
    }

    if (onOptionSelected) {
      onOptionSelected(selectedOptions);
    }
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
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        >
          {selectedOptions.length > 0
            ? selectedOptions.join(', ')
            : title || 'Select option(s)'}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.293 7.293a1 1 0 0 1 1.414 0L10 9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"
            />
          </svg>
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
      <input type="hidden" name={inputValueName} value={selectedOptions.join(',')} ref={inputValueRef} />
    </div>
  );
};

export { MultiSelectDropdown, MultiSelectDropdownProps };
