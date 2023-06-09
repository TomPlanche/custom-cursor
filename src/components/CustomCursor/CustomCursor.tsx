/**
 * @file src/components/CustomCursor/CustomCursor.tsx
 * @description CustomCursor component.
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import {lerp} from "../../assets/utils";
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES
// Style variables
const cursorConsts = {
  size: '2rem',
  backgroundColor: '#eeeeee50'
}

const Cursor = styled.div`
  position: absolute;
  
  height: ${cursorConsts.size};
  width: ${cursorConsts.size};
  
  top: calc(${cursorConsts.size} / -2);
  left: calc(${cursorConsts.size} / -2);
  
  border-radius: ${cursorConsts.size};
  
  background-color: ${cursorConsts.backgroundColor};
`;

// Types
export type T_LerpableOption = {
  previous: number,
  current: number,
  amount: number,
}

export type T_LerpableOptions = {
  translateX: T_LerpableOption,
  translateY: T_LerpableOption,
  scale: T_LerpableOption,
}

export type T_MousePosition = {
  x: number,
  y: number,
}
// END VARIABLES ======================================================================================= END VARIABLES

// COMPONENENT  ============================================================================================= COMPONENT
/**
 * CustomCursor component
 * @return {JSX.Element}
 * @constructor
 **/
const CustomCursor = () => {
  // State(s)
  const [hasMoved, setHasMoved] = useState<boolean>(false);

  // Ref(s)
  // HTML refs
  const cursorRef = useRef<HTMLDivElement>(null);

  // Other refs
  const lerpableOptionsRef = useRef<T_LerpableOptions>({
    translateX: {previous: 0, current: 0, amount: .05},
    translateY: {previous: 0, current: 0, amount: .05},
    scale: {previous: 0, current: 0, amount: .1},
  });
  const mousePositionRef = useRef<T_MousePosition>({ x: 0, y: 0 });

  // Method(s)
  const render = () => {
    if (cursorRef.current) {
      if (!lerpableOptionsRef.current) {
        console.log(`[CustomCursor] lerpableOptionsRef.current is null!`);
        return 0;
      }

      lerpableOptionsRef.current.translateX.current = mousePositionRef.current.x + window.scrollX;
      lerpableOptionsRef.current.translateY.current = mousePositionRef.current.y + window.scrollY;

      Object.keys(lerpableOptionsRef.current).forEach((key, value) => {
        const keyRef = key as keyof T_LerpableOptions;

        lerpableOptionsRef.current[keyRef].previous = lerp(
          lerpableOptionsRef.current[keyRef].previous,
          lerpableOptionsRef.current[keyRef].current,
          lerpableOptionsRef.current[keyRef].amount
        )
      });

      // Set the cursor style
      cursorRef.current.style.transform = `translate3d(${lerpableOptionsRef.current.translateX.previous}px, ${lerpableOptionsRef.current.translateY.previous}px, 0) scale(${lerpableOptionsRef.current.scale.previous})`;
    } else {
      console.log(`[CustomCursor] cursorRef.current is null!`);
    }

    requestAnimationFrame(render);
  }

  const handleMouseMove = (event: MouseEvent) => {
    !hasMoved && setHasMoved(true);
    mousePositionRef.current = { x: event.clientX, y: event.clientY };
  }

  // Effect(s)
  useEffect(() => {
    render();

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    if (hasMoved) {
      lerpableOptionsRef.current.translateX.previous
        = lerpableOptionsRef.current.translateX.current
        = mousePositionRef.current.x + window.scrollX;

      lerpableOptionsRef.current.translateY.previous
        = lerpableOptionsRef.current.translateY.current
        = mousePositionRef.current.y + window.scrollY;

      lerpableOptionsRef.current.scale.current = 1;
    }
  }, [hasMoved])
  // Render
  return (
    <Cursor ref={cursorRef}>
    </Cursor>
  )
}
// END COMPONENT =======================================================================================  END COMPONENT

export default CustomCursor;

/**
 * End of file src/components/CustomCursor/CustomCursor.tsx
 */
