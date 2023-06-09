/**
 * @file Main component for the application.
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import React, { useState } from 'react'

import styles from './App.module.scss'
import CustomCursor from "./components/CustomCursor/CustomCursor";
// END IMPORTS ==========================================================================================   END IMPORTS

// COMPONENT ================================================================================================ COMPONENT
/**
 * @type {React.FC}
 * @returns {React.ReactElement}
 * @constructor
 */
const App = (): React.ReactElement => {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.App}>
      <h1>custom-cursor</h1>

      <CustomCursor />
    </div>
  )
}
// END COMPONENT ======================================================================================== END COMPONENT
export default App

/**
 * End of file App.tsx
 */
