/**
 * @file Main component for the application.
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import React, {RefObject, useRef} from 'react'

import styles from './App.module.scss'
import CustomCursor, {T_OnEnterLeave} from "./components/CustomCursor/CustomCursor";
import styled from "styled-components";
import MyButton from "./components/MyButton";
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES
// Style variables
const StyledMyButton = styled(MyButton)`
  padding: 1rem 2rem;
  background: darkblue;
`;

// Types
type T_CursorRef = RefObject<{
  onCursorEnter: T_OnEnterLeave,
  onCursorLeave: T_OnEnterLeave,
}>

// END VARIABLES ======================================================================================= END VARIABLES

// COMPONENT ================================================================================================ COMPONENT
/**
 * @type {React.FC}
 * @returns {React.ReactElement}
 * @constructor
 */
const App = (): React.ReactElement => {
  // State(s)

  // Ref(s)
  const customCursorRef: T_CursorRef = useRef(null);

  // Method(s)

  return (
    <div className={styles.App}>
      <StyledMyButton
        onMouseEnter={() => {
          console.log("hihi");

          customCursorRef.current?.onCursorEnter(null);
        }}

        onMouseLeave={() => {
          console.log("hoho");

          customCursorRef.current?.onCursorLeave(null);
        }}
      >
        <h1>Hihi</h1>
      </StyledMyButton>

      <CustomCursor ref={customCursorRef}/>
    </div>
  )
}
// END COMPONENT ======================================================================================== END COMPONENT
export default App

/**
 * End of file App.tsx
 */
