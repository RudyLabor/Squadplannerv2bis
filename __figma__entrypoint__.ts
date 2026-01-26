import 'figma:foundry-client-api'
import './src/styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './src/app/App.tsx'

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

export const Code0_8 = () => import('./src/app/App.tsx');
