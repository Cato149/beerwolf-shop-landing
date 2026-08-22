import '@fontsource/pacifico/latin-400.css';
import '@fontsource/marck-script/cyrillic-400.css';
import '@fontsource/unbounded/latin-400.css';
import '@fontsource/unbounded/cyrillic-400.css';
import '@fontsource/unbounded/latin-700.css';
import '@fontsource/unbounded/cyrillic-700.css';
import '@fontsource/lora/latin-400.css';
import '@fontsource/lora/cyrillic-400.css';
import '@fontsource/lora/cyrillic-ext-400.css';
import '@fontsource/lora/latin-500.css';
import '@fontsource/lora/cyrillic-500.css';
import '@fontsource/lora/cyrillic-ext-500.css';
import '@fontsource/lora/latin-600.css';
import '@fontsource/lora/cyrillic-600.css';
import '@fontsource/lora/cyrillic-ext-600.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/cyrillic-400.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import '@fontsource/ibm-plex-mono/cyrillic-600.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/composition.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Application root element was not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
