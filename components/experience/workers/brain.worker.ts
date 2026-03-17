// Worker entry — sem JSX aqui
// Webpack compila este arquivo como um Web Worker separado
import { render } from '@react-three/offscreen'
import React from 'react'
import { BrainScene } from './brain-scene'

render(React.createElement(BrainScene))
