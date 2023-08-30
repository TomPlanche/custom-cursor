/**
 * @file Main component for the application.
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import React, {RefObject, useRef} from 'react'

import CustomCursor, {T_OnEnterLeave} from "./components/CustomCursor/CustomCursor";
import styled from "styled-components";
import MyButton from "./components/MyButton";
import MagnetikContainer from "./components/MagnetikContainer";
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES
export const variables = {
  blueFontColor: '#679fc5',
}

// Style variables
const StyledApp = styled.div`
  height: 100vh;
  width: 100vw;
  
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  
  padding: 2rem;
`;

const StyledTitle = styled.h1`
  font-size: 5rem;
  font-family: "Mondwest", sans-serif;
  justify-self: center;
  
  color: ${variables.blueFontColor};
`;

const StyledParagraph = styled.p`
  font-size: 1.5rem;
  font-family: "Editorial New", sans-serif;
  
  text-align: justify;
  
  padding: 0 5rem;
  margin-top: 5rem;
  
  line-height: 2rem;
`;

const StyledBottomLink = styled.div<{$left: boolean}>`
  font-size: 2rem;
  font-family: "Mondwest", sans-serif;
  
  position: absolute;
  
  bottom: 2rem;
  left: ${props => props.$left ? '2rem' : 'auto'};
  right: ${props => props.$left ? 'auto' : '2rem'};
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
const App: React.FC = (): React.ReactElement => {
  // State(s)

  // Ref(s)
  const customCursorRef: T_CursorRef = useRef(null);
  const magnetikContainersLeftRef = useRef<HTMLDivElement>();
  const magnetikContainersRightRef = useRef<HTMLDivElement>();

  // Method(s)

  return (
    <StyledApp>
      <CustomCursor ref={customCursorRef}/>

      <StyledTitle>
        Tom's custom cursor.
      </StyledTitle>

      <StyledParagraph>
        I made this custom cursor for my <MyButton href={'https://tomplanche.fr'} customCursor={customCursorRef}>portfolio website</MyButton>. It is a simple circle that follows the mouse cursor.
        I learned a lot about React and Typescript while making this project. I also learned basic animation tools
        such as lerping and easing and GSAP animations.
      </StyledParagraph>

      <StyledBottomLink
        $left={true}
      >
        <MagnetikContainer
          ref={magnetikContainersLeftRef}
          recentred={{
            value: true,
            verticalUp: true,
            horizontalLeft: true,
          }}
        >
          <MyButton
            href={"https://tomplanche.fr"}
            customCursor={customCursorRef}
          >Tom Planche
          </MyButton>
        </MagnetikContainer>
      </StyledBottomLink>
      <StyledBottomLink
        $left={false}
      >
        <MagnetikContainer
          ref={magnetikContainersRightRef}
          recentred={{
            value: true,
            verticalUp: true,
            horizontalLeft: false,
          }}


        >
          <MyButton
            href={"https://github.com/tomplanche"}
            linkStyle={false}
            customCursor={{
              cursorRef: customCursorRef,

              onEnterOptions: {
                options: {
                  svg: '/github-mark-white.svg',
                  backgroundColor: 'transparent',
                  opacity: {current: 1},
                },
                addBaseStyles: true,
              },
              onLeaveOptions: {
                options: {
                  svg: false
                },
                addBaseStyles: true,
              }
            }}
          >
            GitHub
          </MyButton>
        </MagnetikContainer>
      </StyledBottomLink>
    </StyledApp>
  )
}
// END COMPONENT ======================================================================================== END COMPONENT
export default App

/**
 * End of file App.tsx
 */
