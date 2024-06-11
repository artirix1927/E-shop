
import { useEffect } from 'react';

export const useBodyClass = (className) => {
  useEffect(() => {
    // Add the class to the body
    document.body.classList.add(className);

    // Remove the class when the component is unmounted or className changes
    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);
};


