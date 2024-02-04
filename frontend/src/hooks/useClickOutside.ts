import React, { useEffect, useLayoutEffect, useRef } from 'react';

const useClickOutside = (action: any) => {
  const ref = useRef(null);
  const refCb = useRef(action);

  useLayoutEffect(() => {
    refCb.current = action;
  });

  useEffect(() => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        refCb.current(e);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, []);

  return ref;
};

export default useClickOutside;
