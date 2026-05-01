import React from 'react'
import styles from './weekstoggle.module.css'

const weekstoggle = () => {
  return (
    <div className={styles.shell}>
        <div className={styles.pageHeader}>
                      <h1>My logs</h1>
                      <p>Your industrial attachment logs can be found here.</p>
                    </div>
    </div>
  )
}

export default weekstoggle