import { useEffect } from 'react';

type Ref = React.RefObject<HTMLElement>;
type Func = () => void;

export const useClickOutside = (ref: Ref, func: Func) => {
  useEffect(() => {
    const listener = (e: Event) => {
      if (!ref.current || ref.current.contains(e.target as Node)) {
        return;
      }
      // This seems like a hack. Ask somewhere about two listeners on the same event. be specific about the case.
      // setTimeout(() => {
      //   func();
      // }, 200);
      func();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, func]);
};
