import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (e?: MediaQueryListEvent) => {
      // Prefer matchMedia result for accuracy
      setIsMobile(mql.matches);
    };
    // Safari fallback: addListener/removeListener
    if ('addEventListener' in mql) {
      mql.addEventListener('change', onChange as EventListener);
    } else {
      (mql as any).addListener(onChange);
    }
    // Initialize from media query
    setIsMobile(mql.matches);
    return () => {
      if ('removeEventListener' in mql) {
        mql.removeEventListener('change', onChange as EventListener);
      } else {
        (mql as any).removeListener(onChange);
      }
    };
  }, []);

  return isMobile;
}
