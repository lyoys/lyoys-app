# Progresso do app Lyoys — checkpoint

Última atualização: 17/07/2026. Este arquivo existe para retomar o trabalho na próxima
sessão sem precisar reexplicar tudo.

## O que já está pronto (código-fonte completo em `lyoys-app/`)

- Site institucional replicado: Home, Sobre, Serviços, Contato — conteúdo tirado do site
  real (lyoysadm.wixstudio.com).
- Home com hero mais limpo (parágrafo institucional e estatísticas jogados mais para
  baixo, bloco de serviços removido por enquanto).
- Casting: lista e detalhe das vagas, com badge diferenciando `Projeto Lyoys` (dourado)
  de `Divulgação · [parceiro]` (cinza, para vagas de terceiros).
- Perfil: a pessoa preenche os dados uma vez (nome, idade, contato, cidade, foto de
  perfil, links de portfólio) e salva no aparelho (`@capacitor/preferences`). Vagas
  próprias da Lyoys ganham botão "Candidatar-se com meu perfil" (1 toque, sem formulário
  de novo); vagas de terceiros mostram só "Ver mais informações", já que hoje não há
  contato direto entre a Lyoys e essas empresas parceiras.
- Chamadas de casting já preparadas para vir de uma planilha Google Sheets publicada como
  CSV (`src/services/castingSource.ts`), com cache local e fallback para dados padrão —
  ou seja, dá para atualizar as vagas sem lançar nova versão do app, uma vez configurado.
- Notificações push com `@capacitor/push-notifications` (Firebase), scaffolding pronto.
- Guias escritos: `README.md` (visão geral e como rodar), `PUBLICACAO_PLAY_STORE.md`
  (passo a passo até a Play Store), `DISTRIBUICAO_APK.md` (alternativa: `.apk` direto
  pelo site, sem Play Store).

## O que falta configurar (decisões e contas da Lyoys, não é código)

- `SUBMISSION_ENDPOINT` (`src/config.ts`): apontar para um Google Apps Script Web App
  que grava as candidaturas numa planilha e salva a foto no Drive. Passo a passo no
  README, seção "Conectar as candidaturas ao Google Drive/Sheets". Ainda não configurado
  (está com placeholder) — sem isso, candidaturas não são enviadas de verdade.
- `CASTING_DATA_URL` (`src/config.ts`): apontar para a planilha de vagas publicada como
  CSV. Passo a passo no README, seção "Atualizar vagas sem lançar nova versão do app".
  Ainda não configurado — hoje o app usa os dados padrão embutidos (3 vagas de exemplo).
- Projeto no Firebase Console para as notificações push funcionarem de fato
  (`google-services.json`).
- Ícone e splash screen do app (hoje usam os placeholders padrão do Capacitor).
- Decidir caminho de distribuição: só Play Store, só `.apk` pelo site, ou os dois em
  paralelo (guias prontos para ambos).
- Página "Download" já foi montada no editor do Wix (título, botão, aviso de segurança),
  mas ainda **não publicada** — falta decidir quando publicar e falta o link real do APK
  no botão.
- Workflow do GitHub Actions pronto (`.github/workflows/build-apk.yml` +
  `scripts/patch-android-signing.js`) para gerar o `.apk` assinado automaticamente na
  nuvem, sem precisar de Android Studio. Falta: criar o repositório no GitHub, gerar a
  keystore e cadastrar os 4 secrets — passo a passo completo em `DISTRIBUICAO_APK.md`,
  "Opção B".

## Limitação desta sessão

O terminal do Cowork ficou indisponível o tempo todo (erro `HYPERVISOR_VIRT_DISABLED`) —
todo o código foi escrito diretamente nos arquivos, mas nunca rodei `npm install`,
`npm run build` nem testei a compilação de verdade. Isso precisa ser validado na sua
máquina (ou numa sessão com o terminal funcionando) antes de gerar o `.apk`/`.aab` final.

## Próximos passos sugeridos para amanhã

1. Testar se o terminal do Cowork voltou; se sim, rodar `npm install` e `npm run dev`
   para validar que o projeto builda sem erro.
2. Configurar `CASTING_DATA_URL` com uma planilha real de vagas.
3. Configurar `SUBMISSION_ENDPOINT` com o Apps Script.
4. Gerar ícone/splash e decidir o caminho de distribuição (Play Store e/ou `.apk` no
   site).
