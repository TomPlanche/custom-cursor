/**
 * @file src/components/CustomCursor/CustomCursor.tsx
 * @description CustomCursor component.
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import styled from "styled-components";
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES
const cursorConsts = {
  size: '2rem',
  backgroundColor: '#eeeeee50'
}

const Cursor = styled.div`
  height: ${cursorConsts.size};
  width: ${cursorConsts.size};
  
  border-radius: ${cursorConsts.size};
  
  background-color: ${cursorConsts.backgroundColor};
`;
// END VARIABLES ======================================================================================= END VARIABLES

// COMPONENENT  ============================================================================================= COMPONENT
/**
 * CustomCursor component
 * @return {JSX.Element}
 * @constructor
 **/
const CustomCursor = () => {

  // Render
  return (
    <Cursor />
  )
}
// END COMPONENT =======================================================================================  END COMPONENT

export default CustomCursor;

/**
 * End of file src/components/CustomCursor/CustomCursor.tsx
 */
