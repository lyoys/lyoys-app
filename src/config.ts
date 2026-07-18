// Endpoint que recebe as inscrições de casting (nome, contato, foto, vídeo).
// Recomendado: um Google Apps Script Web App que grava os dados numa planilha
// Google Sheets e salva os arquivos numa pasta do Google Drive.
// Veja o passo a passo em README.md, seção "Conectar as inscrições ao Google Drive/Sheets".
export const SUBMISSION_ENDPOINT = 'https://SEU-APPS-SCRIPT-URL/exec';

// Tamanho máximo de upload aceito pelo formulário (em MB) para foto e vídeo.
export const MAX_PHOTO_MB = 8;
export const MAX_VIDEO_MB = 80;

// URL de uma planilha Google Sheets publicada na web como CSV (Arquivo > Compartilhar >
// Publicar na web > CSV). É de onde o app busca as chamadas de casting toda vez que
// abre — assim, atualizar a planilha atualiza o app de quem já instalou, sem precisar
// lançar uma nova versão. Veja README.md, seção "Atualizar vagas sem lançar nova versão".
export const CASTING_DATA_URL = 'https://SUA-PLANILHA-PUBLICADA/pub?output=csv';

// Notificações push (Firebase Cloud Messaging) só devem ser ativadas depois que o
// projeto do Firebase estiver criado e o arquivo google-services.json estiver dentro de
// android/app/ (veja README.md, seção "Notificações push"). Enquanto isso, deixe como
// `false`: tentar registrar push sem o Firebase configurado pode travar o app ao abrir
// (é um erro nativo do Android, não algo que o try/catch em JavaScript consiga evitar).
// Depois de configurar o Firebase, mude para `true` e gere uma nova versão do app.
export const PUSH_NOTIFICATIONS_ENABLED = false;
