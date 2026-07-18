import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

// Inicializa notificações push no Android via Capacitor + Firebase Cloud Messaging (FCM).
// Pré-requisito: colocar o arquivo google-services.json (baixado do Firebase Console)
// dentro de android/app/. Veja README.md, seção "Notificações push".
export async function initPushNotifications() {
  if (!Capacitor.isNativePlatform()) {
    // No navegador (modo dev/preview) não há push nativo; não faz nada.
    return;
  }

  const permStatus = await PushNotifications.checkPermissions();

  let granted = permStatus.receive === 'granted';
  if (permStatus.receive === 'prompt') {
    const req = await PushNotifications.requestPermissions();
    granted = req.receive === 'granted';
  }

  if (!granted) {
    console.warn('Permissão de notificações não concedida.');
    return;
  }

  await PushNotifications.register();

  PushNotifications.addListener('registration', (token) => {
    // Envie este token para o seu backend/planilha para poder mandar notificações
    // segmentadas (ex.: "nova chamada de casting aberta").
    console.log('Push registration token:', token.value);
  });

  PushNotifications.addListener('registrationError', (err) => {
    console.error('Erro no registro de push notifications:', err);
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Notificação recebida em primeiro plano:', notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Usuário tocou na notificação:', action.notification);
  });
}
