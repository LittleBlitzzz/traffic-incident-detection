
import React from 'react';

interface ExpandArrowIconProps {
  className?: string;
}

const ExpandArrowIcon: React.FC<ExpandArrowIcon> = ({
    className="",
  }) => {
  const iconClass = "expand-arrow-icon " + className;
  return (
    <svg
      className={iconClass}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M6.293 7.293a1 1 0 0 1 1.414 0L10 9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"
      />
    </svg>
  )
}

export default ExpandArrowIcon;