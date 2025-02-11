import React, { useRef, useEffect, ReactNode, RefObject } from "react";

/**
 * From https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
 */

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref : RefObject<HTMLElement>, onNotified: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onNotified();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onNotified]);
}

/**
 * Component that alerts if you click outside of it
 */

interface OutsideClickNotifierProps {
  children: ReactNode;
  onNotified: () => void
}

const OutsideClickNotifier : React.FC<OutsideClickNotifierProps> = ({ children, onNotified }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, onNotified);

  return <div ref={wrapperRef}>{children}</div>;
}

export default OutsideClickNotifier;