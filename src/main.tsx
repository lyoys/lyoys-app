import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initPushNotifications } from './services/notifications';

// .catch extra de segurança: mesmo com o try/catch interno, isso garante que uma
// falha aqui nunca impeça o app de abrir e renderizar a tela.
initPushNotifications().catch((err) => {
  console.warn('Falha ao iniciar notificações push (app continua funcionando normalmente):', err);
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
