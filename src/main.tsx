import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from './components/ui/sonner.tsx'
import './index.css'
import App from './App.tsx'
import {Provider} from 'react-redux';
import Store from './Store/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={Store}>
    <Toaster/>
    <App/>
    </Provider>
  </StrictMode>,
)
