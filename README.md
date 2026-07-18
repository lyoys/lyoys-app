# App Lyoys

App mobile oficial da Lyoys Entertainment: site institucional, chamadas de casting
(próprias e de parceiros divulgados) e um perfil de candidato reutilizável — a pessoa
preenche seus dados uma vez e se candidata às vagas com um toque — além de notificações
push. Construído em React + Vite, empacotado como app Android via Capacitor.

Conteúdo replicado a partir do site institucional: https://lyoysadm.wixstudio.com/my-site-1

## Estrutura do projeto

```
lyoys-app/
  src/
    pages/         Home, Sobre, Serviços, Casting, CastingDetalhe, Perfil, Contato
    components/     Header, BottomNav, Footer, ApplyButton (botão de candidatura)
    data/           castingCalls.ts (dados padrão embutidos, campo origem: lyoys | terceiros)
    services/       notifications.ts (push), profile.ts (perfil salvo no aparelho),
                     submission.ts (envio da candidatura ao backend),
                     castingSource.ts (busca as vagas reais numa planilha remota)
    config.ts       endpoints (candidaturas e planilha de vagas) e limites de upload
  capacitor.config.ts
  package.json
```

`src/pages/Inscricao.tsx` foi mantida apenas como redirecionamento para `/perfil`, caso
algum link antigo aponte para o formulário avulso que existia antes.

## Rodar localmente (preview no navegador)

Isso requer Node.js 18+ instalado na sua máquina (não roda dentro do Cowork, pois o app
precisa de um ambiente Android/Node completo que você controla).

```bash
cd lyoys-app
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Gerar o app Android

```bash
npm run build          # gera a pasta dist/
npx cap add android     # só na primeira vez, cria a pasta android/
npx cap sync
npx cap open android    # abre no Android Studio
```

No Android Studio: `Build > Generate Signed Bundle / APK` para gerar o `.aab` que vai
para a Play Store (veja `PUBLICACAO_PLAY_STORE.md`), ou um `.apk` para disponibilizar
direto no site institucional, sem depender da Play Store (veja `DISTRIBUICAO_APK.md`).

Se preferir não instalar o Android Studio, o repositório já tem um workflow do GitHub
Actions (`.github/workflows/build-apk.yml`) que gera o `.apk` assinado automaticamente na
nuvem a cada atualização — configuração em `DISTRIBUICAO_APK.md`, seção "Opção B".

## Como funciona o Perfil e a candidatura em 1 toque

Em vez de preencher um formulário a cada vaga, a pessoa preenche o `Perfil` uma vez
(nome, idade, contato, cidade, uma foto de perfil, e links de portfólio como
Instagram/reels/YouTube). Isso fica salvo só no aparelho dela (`@capacitor/preferences`,
com fallback de `localStorage` no navegador) — nada é enviado até ela tocar em
"Candidatar-se com meu perfil" numa vaga específica (`src/components/ApplyButton.tsx`).
Se o perfil ainda não estiver completo, o toque leva para `/perfil` e, assim que ela
salvar, a candidatura para aquela vaga é enviada automaticamente.

O botão de candidatura em um toque só aparece em vagas com `origem: 'lyoys'`. Vagas com
`origem: 'terceiros'` mostram apenas "Ver mais informações", já que hoje não há contato
direto entre a Lyoys e essas empresas parceiras — a Lyoys apenas divulga a oportunidade.

## Atualizar vagas sem lançar nova versão do app

Importante: quem já instalou o app (pela Play Store ou pelo `.apk` direto) só recebe
código novo quando baixa uma atualização. Por isso as vagas de casting **não** ficam
fixas dentro do app — a lista que aparece de verdade vem de uma planilha Google Sheets,
buscada toda vez que a pessoa abre a tela de Casting ou Perfil
(`src/services/castingSource.ts`). Editar a planilha atualiza o que todo mundo já
instalado vê, sem precisar gerar e distribuir uma nova versão.

Como configurar:

1. Crie uma planilha no Google Sheets com estas colunas na primeira linha (nomes exatos,
   sem acento): `id, titulo, categoria, descricao, requisitos, local, dataLimite, status,
   origem, parceiro`.
   - `requisitos`: itens separados por ponto e vírgula (`;`), ex.: `Maiores de 18
     anos;Disponibilidade em horário comercial`.
   - `status`: `aberta` ou `encerrada`.
   - `origem`: `lyoys` (mostra o botão de candidatura em 1 toque) ou `terceiros` (mostra
     só "Ver mais informações").
   - `parceiro`: nome de quem organiza a vaga, só necessário quando `origem` for
     `terceiros`.
2. No Sheets: `Arquivo > Compartilhar > Publicar na web`, escolha a aba certa, formato
   **CSV**, e publique. Copie o link gerado.
3. Cole esse link em `CASTING_DATA_URL` (`src/config.ts`) e rode `npm run build` de novo.

Depois disso, qualquer edição na planilha (adicionar vaga, mudar status para
`encerrada`, corrigir texto) aparece para quem já tem o app instalado na próxima vez que
abrir. Se o celular estiver sem internet, o app mostra a última versão que conseguiu
buscar (fica salva no aparelho); sem nunca ter buscado nada, mostra os dados padrão de
`src/data/castingCalls.ts`.

## Conectar as candidaturas ao Google Drive/Sheets

`src/services/submission.ts` já está pronto para enviar nome, contato e foto do perfil
para um backend. Falta apontar `SUBMISSION_ENDPOINT` (em `src/config.ts`) para um destino
real. Caminho mais simples, sem precisar de servidor próprio, usando a conta Google que
você já tem conectada:

1. Crie uma planilha no Google Sheets com colunas: `enviadoEm, castingId, nome, idade,
   telefone, email, cidade, instagram, sobre, fotoUrl`.
2. Nela, vá em `Extensões > Apps Script` e cole um script que recebe `doPost(e)`, salva a
   foto numa pasta do Google Drive com `DriveApp.createFile(...)`, grava a URL do arquivo
   e os demais campos numa nova linha da planilha, e retorna `ContentService` com status
   200.
3. Publique como "Implantação > Nova implantação > Aplicativo da Web", acesso "Qualquer
   pessoa", copie a URL gerada.
4. Cole essa URL em `SUBMISSION_ENDPOINT` (`src/config.ts`) e rode `npm run build` de
   novo.

Enquanto `SUBMISSION_ENDPOINT` não for configurado, o app avisa a pessoa que a
candidatura não pôde ser enviada, em vez de fingir sucesso.

## Notificações push

Usa `@capacitor/push-notifications` (Firebase Cloud Messaging no Android). Passos:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Adicione um app Android com o `appId` `com.lyoysentertainment.app` (o mesmo do
   `capacitor.config.ts`).
3. Baixe o `google-services.json` e coloque em `android/app/` depois de rodar
   `npx cap add android`.
4. Rode `npx cap sync`.

Para disparar notificações (ex.: "nova chamada de casting aberta"), use o Firebase
Console ou a API do FCM a partir do backend que você configurar.

## Atualizar o conteúdo do app

- Textos institucionais: editar os arquivos em `src/pages/`.
- Chamadas de casting: editar a planilha do Google Sheets (veja "Atualizar vagas sem
  lançar nova versão do app" acima) — é o que atualiza quem já tem o app instalado.
  `src/data/castingCalls.ts` é só o conteúdo padrão usado antes da primeira busca
  funcionar ou se a planilha nunca tiver sido configurada.
- Cores/identidade visual: `src/index.css` (variáveis no topo do arquivo).
