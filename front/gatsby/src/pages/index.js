import React from "react"

import Centered from '../layouts/Centered'

import '../styles/general.scss'

export default () => (
    <Centered title="Hello Stylo">
        <h1>Hello World!</h1>
        <p>
            <a href="http://stylo-doc.ecrituresnumeriques.ca/" target="_blank" rel="noopener noreferrer">Documentation</a><br/>
            <a href="https://github.com/EcrituresNumeriques/stylo/issues" target="_blank" rel="noopener noreferrer">Report an issue</a>
        </p>
                    
    </Centered>
)