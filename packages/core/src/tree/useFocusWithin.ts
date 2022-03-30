import { useHtmlElementEventListener } from '../useHtmlElementEventListener';
import { useRef, useState } from 'react';
import { useCallSoon } from '../useCallSoon';

export const useFocusWithin = (
  element: HTMLElement | undefined,
  onFocusIn?: () => void,
  onFocusOut?: () => void,
  deps: any[] = []
) => {
  const [focusWithin, setFocusWithin] = useState(false);
  const isLoosingFocusFlag = useRef(false);
  const callSoon = useCallSoon();

  useHtmlElementEventListener(
    element,
    'focusin',
    () => {
      if (!focusWithin) {
        setFocusWithin(true);
        onFocusIn?.();
      }

      if (isLoosingFocusFlag.current) {
        isLoosingFocusFlag.current = false;
      }
    },
    [focusWithin, onFocusIn, ...deps]
  );

  useHtmlElementEventListener(
    element,
    'focusout',
    () => {
      isLoosingFocusFlag.current = true;

      callSoon(() => {
        if (isLoosingFocusFlag.current && !element?.contains(document.activeElement)) {
          onFocusOut?.();
          isLoosingFocusFlag.current = false;
          setFocusWithin(false);
        }
      });
    },
    [element, onFocusOut, callSoon, ...deps]
  );

  return focusWithin;
};
