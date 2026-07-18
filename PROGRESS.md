# Progresso do app Lyoys — checkpoint

Última atualização: 18/07/2026. Este arquivo existe para retomar o trabalho na próxima
sessão sem precisar reexplicar tudo.

## Estado atual (resumo rápido)

O app Lyoys está **no ar e funcional**: qualquer pessoa pode baixar o `.apk` pelo botão
"Baixar para Android (.apk)" na página Download do site institucional
(`https://lyoysadm.wixstudio.com/my-site-1/download`), instalar e usar normalmente. Toda
vez que o código for atualizado no GitHub, um `.apk` novo é gerado e publicado sozinho —
não depende mais de nada manual.

- Repositório: `https://github.com/lyoys/lyoys-app` (público).
- Build automático: `.github/workflows/build-apk.yml` (GitHub Actions) — roda a cada
  `git push` na branch `main`, gera o `.apk` assinado e publica como Release.
- Link de download fixo (sempre a versão mais nova):
  `https://github.com/lyoys/lyoys-app/releases/latest/download/app-release.apk`.
- Build mais recente confirmado funcionando: **build 17**.

## O que foi feito hoje (18/07/2026)

1. **Publicação de ponta a ponta**: criado o repositório no GitHub, gerada a keystore de
   assinatura, cadastrados os 4 secrets (`ANDROID_KEYSTORE_BASE64`,
   `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`), workflow do
   GitHub Actions ajustado até rodar sem erro. Repositório tornado público (necessário
   para o link de download funcionar sem exigir login do visitante).
2. **Site conectado ao app**: botão "Baixar para Android (.apk)" da página Download
   ligado ao link fixo de release; URL da página trocada de `/blank-11` para `/download`;
   site publicado.
3. **Bug crítico corrigido — app travava/fechava ao abrir**: causa raiz era o app tentar
   registrar notificações push (Firebase) automaticamente ao iniciar, sem o Firebase
   estar configurado. Isso gera um erro **nativo** do Android (não é algo que um
   `try/catch` em JavaScript consiga sempre evitar — confirmado em teste real: o app
   travava especificamente ao tocar em "Permitir" no pedido de notificação). A correção
   definitiva foi um interruptor: `PUSH_NOTIFICATIONS_ENABLED` em `src/config.ts`, hoje
   `false`. Enquanto estiver `false`, o app **nem chega a pedir permissão nem a registrar
   push** — elimina o caminho que travava, não só tenta capturar o erro depois. Só mudar
   para `true` depois que o Firebase estiver configurado de verdade (ver seção abaixo).
4. **Ícone e tela de abertura (splash)**: o app usava o ícone genérico do Capacitor. Como
   ainda não existe uma arte oficial de ícone em alta resolução, o ícone/splash agora são
   gerados automaticamente a cada build a partir da **mesma imagem da máscara veneziana
   que já aparece no site** (baixada direto do CDN do Wix por `scripts/generate-icons.cjs`,
   que usa `sharp` para compor a máscara sobre um fundo escuro, e depois
   `npx capacitor-assets generate --android` aplica isso ao projeto Android). Limitação
   conhecida: essa imagem original é pequena (264×374px), então o ícone fica um pouco
   suave ao ser ampliado — assim que a Lyoys tiver uma arte oficial em alta resolução
   (idealmente PNG quadrado 1024×1024), é só substituir e o próximo build já sai
   atualizado (ver "Como trocar o ícone depois", abaixo).

## Como trocar o ícone/splash quando tiverem uma arte oficial

Duas opções, sem precisar mexer no restante do app:

- **Mais simples**: substituir a constante `MASK_URL` em `scripts/generate-icons.cjs`
  pelo link de uma imagem própria (PNG com fundo transparente, de preferência
  quadrada e em alta resolução).
- **Mais direto**: colocar os arquivos prontos `assets/icon.png` (1024×1024) e
  `assets/splash.png` (2732×2732) já editados manualmente e apagar a etapa
  "Gerar ícone e splash screen" do workflow (`.github/workflows/build-apk.yml`), deixando
  só o `npx capacitor-assets generate --android` usar os arquivos fixos.

## O que falta configurar (decisões e contas da Lyoys, não é código)

- **Firebase para notificações push**: criar um projeto no
  [Firebase Console](https://console.firebase.google.com/), adicionar um app Android com
  `appId` `com.lyoysentertainment.app`, baixar o `google-services.json` e commitar em
  `android/app/` (ou ajustar o workflow para gerá-lo a partir de um secret, do mesmo jeito
  que a keystore). Depois disso, mudar `PUSH_NOTIFICATIONS_ENABLED` para `true` em
  `src/config.ts` no README, seção "Notificações push".
- `SUBMISSION_ENDPOINT` (`src/config.ts`): apontar para um Google Apps Script Web App
  que grava as candidaturas numa planilha e salva a foto no Drive. Passo a passo no
  README, seção "Conectar as candidaturas ao Google Drive/Sheets". Ainda não configurado
  (está com placeholder) — sem isso, candidaturas não são enviadas de verdade.
- `CASTING_DATA_URL` (`src/config.ts`): apontar para a planilha de vagas publicada como
  CSV. Passo a passo no README, seção "Atualizar vagas sem lançar nova versão do app".
  Ainda não configurado — hoje o app usa os dados padrão embutidos (3 vagas de exemplo).
- Ícone/splash com arte oficial em alta resolução (ver seção acima — hoje já tem um
  ícone funcional, só não é definitivo).
- Decidir se, além do `.apk` direto pelo site, vale também publicar na Play Store
  (guia pronto em `PUBLICACAO_PLAY_STORE.md`).

## O que já está pronto (código-fonte completo em `lyoys-app/`)

- Site institucional replicado: Home, Sobre, Serviços, Contato — conteúdo tirado do site
  real (lyoysadm.wixstudio.com).
- Casting: lista e detalhe das vagas, com badge diferenciando `Projeto Lyoys` (dourado)
  de `Divulgação · [parceiro]` (cinza, para vagas de terceiros).
- Perfil: a pessoa preenche os dados uma vez (nome, idade, contato, cidade, foto de
  perfil, links de portfólio) e salva no aparelho (`@capacitor/preferences`). Vagas
  próprias da Lyoys ganham botão "Candidatar-se com meu perfil" (1 toque, sem formulário
  de novo); vagas de terceiros mostram só "Ver mais informações".
- Chamadas de casting já preparadas para vir de uma planilha Google Sheets publicada como
  CSV (`src/services/castingSource.ts`), com cache local e fallback para dados padrão.
- Notificações push com `@capacitor/push-notifications`, código pronto mas **desativado**
  por padrão (`PUSH_NOTIFICATIONS_ENABLED = false`) até o Firebase ser configurado.
- Ícone e splash screen gerados automaticamente a cada build a partir da máscara do site.
- Build automático do `.apk` assinado via GitHub Actions, com Release e link de download
  fixo, já publicado e ligado ao site.
- Guias escritos: `README.md` (visão geral e como rodar), `PUBLICACAO_PLAY_STORE.md`
  (passo a passo até a Play Store), `DISTRIBUICAO_APK.md` (alternativa: `.apk` direto
  pelo site, sem Play Store — inclui o passo a passo do GitHub Actions).

## Limitação técnica desta sessão

O terminal do Cowork continua indisponível (erro `HYPERVISOR_VIRT_DISABLED`) — por isso
toda a interação com o GitHub foi feita pelo navegador (upload manual de arquivo por
arquivo via a interface web do GitHub, sem `git` local). Funciona bem, mas é mais lento
para mudanças grandes. Se numa próxima sessão o terminal do Cowork estiver disponível,
usar `git` diretamente será bem mais rápido para commits múltiplos.

## Próximos passos sugeridos

1. Decidir se querem investir em ícone/splash com arte oficial em alta resolução (ver
   "Como trocar o ícone depois" acima).
2. Configurar o Firebase para reativar as notificações push (ver "O que falta
   configurar" acima).
3. Configurar `CASTING_DATA_URL` com uma planilha real de vagas.
4. Configurar `SUBMISSION_ENDPOINT` com o Apps Script, para as candidaturas do Perfil
   serem realmente recebidas.
5. Decidir se vale também publicar na Play Store, em paralelo à distribuição direta
   pelo site.
