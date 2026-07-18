import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

// Inicializa notificações push no Android via Capacitor + Firebase Cloud Messaging (FCM).
// Pré-requisito: colocar o arquivo google-services.json (baixado do Firebase Console)
// dentro de android/app/. Veja README.md, seção "Notificações push".
//
// IMPORTANTE: enquanto o Firebase não estiver configurado (sem google-services.json e
// sem o plugin com.google.gms.google-services aplicado no build.gradle), chamar
// PushNotifications.register() no Android pode lançar uma exceção nativa ("Default
// FirebaseApp is not initialized") e derrubar o app inteiro ao abrir. Por isso, toda a
// função roda dentro de um try/catch: se o Firebase não estiver pronto, o app continua
// funcionando normalmente, só sem notificações push.
export async function initPushNotifications() {
  if (!Capacitor.isNativePlatform()) {
    // No navegador (modo dev/preview) não há push nativo; não faz nada.
    return;
  }

  try {
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
  } catch (err) {
    // Não deixa um erro de push notifications (ex.: Firebase não configurado) derrubar
    // o app inteiro. O app continua funcionando normalmente sem notificações.
    console.warn('Notificações push não puderam ser iniciadas (provavelmente Firebase ainda não configurado):', err);
  }
}
