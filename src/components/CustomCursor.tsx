/**
 * @file src/components/CustomCursor/CustomCursor.tsx
 * @description CustomCursor component.
 * @author Tom Planche
 *
 * @todo Add a way to add a custom cursor
 */

// IMPORTS ===================================================================================================  IMPORTS
import {
  forwardRef,
  ForwardRefExoticComponent,
  ReactElement,
  RefAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";

import {gsap} from "gsap";
import styled from "styled-components";

import {lerp} from "../assets/utils";
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES
// Style variables
const cursorConsts = {
  size: '2rem',
  backgroundColor: '#eeeeee'
}

const Cursor = styled.div`
  position: absolute;

  height: ${cursorConsts.size};
  width: ${cursorConsts.size};

  top: calc(${cursorConsts.size} / -2);
  left: calc(${cursorConsts.size} / -2);

  border-radius: ${cursorConsts.size};

  background-color: ${cursorConsts.backgroundColor};
  opacity: .6;

  z-index: 999999999;

  pointer-events: none;
  
`;

// Object variables
const onEnterBaseOptions: T_OnEnterLeaveOptions = {
  scale: {current: 2},
  opacity: {current: .3},
}

const onLeaveBaseOptions: T_OnEnterLeaveOptions = {
  scale: {current: 1},
  opacity: {current: .6},
}

// Types
type T_LerpableOption = {
  previous: number,
  current: number,
  amount: number,
}

type T_LerpableOptionsOptional = {
  [key in keyof T_LerpableOption]?: T_LerpableOption[key]
}

export type T_LerpableOptions = {
  translateX: T_LerpableOption,
  translateY: T_LerpableOption,
  scale: T_LerpableOption,
  opacity: T_LerpableOption,
}

type T_LerpableOptionsWithOptional = {
  [key in keyof T_LerpableOptions]?: T_LerpableOptionsOptional;
}

type T_StyleOptions = {
  backgroundColor?: string,
}

type T_NonLerpableOptions = {
  block?: boolean,
}

type T_NonLerpableOptionsEnter = (
  | { svg: string; img?: never }
  | { svg?: never; img: string }
) & T_NonLerpableOptions;

type T_NonLerpableOptionsLeave = (
  | { svg?: string; img?: never }
  | { svg?: never; img?: string }
) & T_NonLerpableOptions;

export type T_OnEnterOptions = T_StyleOptions & T_LerpableOptionsWithOptional & T_NonLerpableOptionsEnter;

export type T_OnLeaveOptions = T_StyleOptions & T_LerpableOptionsWithOptional & T_NonLerpableOptionsLeave;

export type T_OnEnterLeaveOptions = T_OnEnterOptions | T_OnLeaveOptions | null;

export type T_OnEnterLeave = (
  options: T_OnEnterLeaveOptions,
  addBaseStyles?: boolean,
  verbose?: boolean,
) => void;

type T_MousePosition = {
  x: number,
  y: number,
}

type T_CustomCursorProps = {
  theme?: 'light' | 'dark',
}

type T_CustomCursor = ForwardRefExoticComponent<T_CustomCursorProps & RefAttributes<unknown>>;
// END VARIABLES ======================================================================================= END VARIABLES

// COMPONENENT  ============================================================================================= COMPONENT
/**
 * CustomCursor component
 * @return {JSX.Element}
 * @constructor
 **/
const CustomCursor: T_CustomCursor = forwardRef((props, ref): ReactElement => {
  // State(s)
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  // Ref(s)
  // HTML refs
  const cursorRef = useRef<HTMLDivElement>(null);

  // Other refs
  const lerpableOptionsRef = useRef<T_LerpableOptions>({
    translateX: {previous: 0, current: 0, amount: .15},
    translateY: {previous: 0, current: 0, amount: .15},
    scale: {previous: 0, current: 0, amount: .1},
    opacity: {previous: .6, current: .6, amount: .1},
  });
  const mousePositionRef = useRef<T_MousePosition>({x: 0, y: 0});

  useImperativeHandle(ref, () => ({
    onCursorEnter,
    onCursorLeave
  }));

  // Method(s)
  const render = () => {
    if (cursorRef.current) {
      if (!lerpableOptionsRef.current) {
        console.log(`[CustomCursor] lerpableOptionsRef.current is null!`);
        return 0;
      }

      if (!isBlocked) {
        lerpableOptionsRef.current.translateX.current = mousePositionRef.current.x + window.scrollX;
        lerpableOptionsRef.current.translateY.current = mousePositionRef.current.y + window.scrollY;
      }

      Object.keys(lerpableOptionsRef.current).forEach((key) => {
        const keyRef = key as keyof T_LerpableOptions;

        lerpableOptionsRef.current[keyRef].previous = lerp(
          lerpableOptionsRef.current[keyRef].previous,
          lerpableOptionsRef.current[keyRef].current,
          lerpableOptionsRef.current[keyRef].amount
        )
      });

      // Set the cursor style
      cursorRef.current.style.transform = `translate3d(${lerpableOptionsRef.current.translateX.previous}px, ${lerpableOptionsRef.current.translateY.previous}px, 0) scale(${lerpableOptionsRef.current.scale.previous})`;
      cursorRef.current.style.opacity = `${lerpableOptionsRef.current.opacity.previous}`;
    }

    requestAnimationFrame(render);
  }

  /**
   * @function handleMouseMove
   * @description To call when the cursor moves
   * @param event {MouseEvent} - The mouse event
   */
  const handleMouseMove = (event: MouseEvent) => {
    !hasMoved && setHasMoved(true);

    if (isBlocked) return;

    mousePositionRef.current = {x: event.clientX, y: event.clientY};
  }

  /**
   * @function onCursorLeave
   * @description To call when the cursor leaves an element
   *
   * @param options {T_OnEnterLeaveOptions} - Options to apply to the cursor
   * @param addBaseStyles {boolean} - Whether to add the base styles or not
   * @param verbose {boolean | undefined} - Whether to log or not
   *
   * @return {void}
   */
  // @ts-ignore
  const onCursorEnter: T_OnEnterLeave = (
    options: T_OnEnterLeaveOptions,
    addBaseStyles: boolean | undefined = true,
    verbose: boolean | undefined = false
  ): void => {
    verbose && console.log("[CustomCursor] onCursorEnter");

    if (!cursorRef.current) {
      verbose && console.log(`[CustomCursor] cursorRef.current is null!`);

      return;
    }

    if (
      options &&
      options.block !== undefined
    ) {
      setIsBlocked(options.block);
    }

    const toApplyStyle: T_StyleOptions = {};
    const toApply: T_LerpableOptionsWithOptional = {};


    if (addBaseStyles) {
      // for each key in onEnterBaseOptions
      Object.keys(onEnterBaseOptions).forEach((key) => {

        verbose && console.log(`[CustomCursor] key: ${key}`);

        // If the key is in lerpableOptionsRef.current
        if (key in lerpableOptionsRef.current) {
          verbose && console.log(`[CustomCursor] key: ${key} is in lerpableOptionsRef.current`);

          const keyRef = key as keyof T_LerpableOptions;

          // If the key is in options
          if (
            options
            && key in options
          ) {
            verbose && console.log(`[CustomCursor] key: ${key} is in options`);

            const keyRef = key as keyof T_LerpableOptions;
            // Set the current value to the previous value
            toApply[keyRef]
              = {
              ...lerpableOptionsRef.current[keyRef],
              ...options[keyRef]
            };

            // go to the next iteration
            return;
          }

          // Set the current value to the previous value
          toApply[keyRef]
            = {
            ...lerpableOptionsRef.current[keyRef],
            ...onEnterBaseOptions[keyRef]
          };
        } else if (key in onEnterBaseOptions) {
          const keyRef = key as keyof T_StyleOptions;
          // Set the current value to the previous value
          toApplyStyle[keyRef] = onEnterBaseOptions[keyRef];
        }
      });

      verbose && console.log(`[CustomCursor] toApplyStyle: ${JSON.stringify(toApplyStyle)}`);
      verbose && console.log(`[CustomCursor] toApply: ${JSON.stringify(toApply)}`);


      // Set the cursor style
      Object.keys(toApplyStyle).forEach((key) => {
        const keyRef = key as keyof T_StyleOptions;
        cursorRef.current!.style[keyRef] = toApplyStyle[keyRef]!;
      });

      // Set the lerping options
      Object.keys(toApply).forEach((key) => {
        const keyRef = key as keyof T_LerpableOptions;

        lerpableOptionsRef.current[keyRef]
          = toApply[keyRef] as T_LerpableOptions[keyof T_LerpableOptions];
      });
    }

    if (options) {
      if (
        options.svg
        || options.img
      ) {
        // svg is the path to the svg file
        cursorRef.current!.innerHTML = `<img src="${options.svg ?? options.img}" alt="cursor"/>`;
      }

      if (options.backgroundColor) {
        cursorRef.current!.style.backgroundColor = options.backgroundColor;
      }

      if (options.opacity) {
        cursorRef.current!.style.opacity = `${options.opacity.current}`;
      }
    }


  }

  /**
   * @function onCursorLeave
   * @description To call when the cursor leaves an element
   *
   * @param options {T_OnEnterLeaveOptions} - Options to apply to the cursor
   * @param addBaseStyles {boolean} - Whether to add the base styles or not
   * @param verbose {boolean} - Whether to log or not
   *
   * @return {void}
   */
  // @ts-ignore
  const onCursorLeave: T_OnEnterLeave = (
    options: T_OnEnterLeaveOptions,
    addBaseStyles: boolean | undefined = true,
    verbose: boolean | undefined = false
  ): void => {
    verbose && console.log("[CustomCursor] onCursorLeave");

    if (!cursorRef.current) {
      verbose && console.log(`[CustomCursor] cursorRef.current is null!`);
      return;
    }

    const toApplyStyle: T_StyleOptions = {};
    const toApply: T_LerpableOptionsWithOptional = {};

    if (
      options &&
      options.block !== undefined
    ) {
      setIsBlocked(options.block);
    }

    if (addBaseStyles) {
      // for each key in onEnterBaseOptions
      Object.keys(onLeaveBaseOptions).forEach((key) => {

        verbose && console.log(`[CustomCursor] key: ${key}`);

        // If the key is in lerpableOptionsRef.current
        if (key in lerpableOptionsRef.current) {

          verbose && console.log(`[CustomCursor] key: ${key} is in lerpableOptionsRef.current`);
          const keyRef = key as keyof T_LerpableOptions;
          // Set the current value to the previous value
          toApply[keyRef]
            = {
            ...lerpableOptionsRef.current[keyRef],
            ...onLeaveBaseOptions[keyRef]
          };
        } else if (key in onLeaveBaseOptions) {
          const keyRef = key as keyof T_StyleOptions;
          // Set the current value to the previous value
          toApplyStyle[keyRef] = onLeaveBaseOptions[keyRef];
        }
      });

      verbose && console.log(`[CustomCursor] toApplyStyle: ${JSON.stringify(toApplyStyle)}`);
      verbose && console.log(`[CustomCursor] toApply: ${JSON.stringify(toApply)}`);


      // Set the cursor style
      Object.keys(toApplyStyle).forEach((key) => {
        const keyRef = key as keyof T_StyleOptions;
        cursorRef.current!.style[keyRef] = toApplyStyle[keyRef]!;
      });

      // Set the lerping options
      Object.keys(toApply).forEach((key) => {
        const keyRef = key as keyof T_LerpableOptions;

        lerpableOptionsRef.current[keyRef]
          = toApply[keyRef] as T_LerpableOptions[keyof T_LerpableOptions];
      });
    }

    if (options) {
      if (options.svg !== undefined && !options.svg) {
        cursorRef.current!.innerHTML = '';
        cursorRef.current!.style.backgroundColor = cursorConsts.backgroundColor;
      }

      if (options.block !== undefined) {
        setIsBlocked(options.block);
      }
    }
  }

  // Effect(s)
  useEffect(() => {
    render();

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [handleMouseMove]);

  useEffect(() => {
    if (hasMoved) {
      lerpableOptionsRef.current.translateX.previous
        = lerpableOptionsRef.current.translateX.current
        = mousePositionRef.current.x + window.scrollX;

      lerpableOptionsRef.current.translateY.previous
        = lerpableOptionsRef.current.translateY.current
        = mousePositionRef.current.y + window.scrollY;

      lerpableOptionsRef.current.scale.current = 1.5;
      setTimeout(() => {
        lerpableOptionsRef.current.scale.current = 1;
      }, 150);
    }
  }, [hasMoved])

  useEffect(() => {
    if (props.theme) {
      gsap.set(cursorRef.current, {
        backgroundColor: props.theme === 'light' ? '#222222' : '#eeeeee',
      })
    }
  }, [props.theme]);

  useEffect(() => {
    console.log(`[CustomCursor] isBlocked: ${isBlocked}`);
  }, [isBlocked]);

  // Render
  return (
    <Cursor ref={cursorRef} />
  )
});
// END COMPONENT =======================================================================================  END COMPONENT

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;

/**
 * End of file src/components/CustomCursor/CustomCursor.tsx
 */
