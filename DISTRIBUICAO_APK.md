# Disponibilizar o app para download pelo site (sem Play Store)

> **Status atual (18/07/2026): já está tudo configurado e no ar.** Repositório criado e
> público (`https://github.com/lyoys/lyoys-app`), keystore e secrets cadastrados, workflow
> rodando sem erro, botão do site já ligado ao link fixo de download. Esta seção fica
> registrada como referência de como foi feito e para o caso de precisar refazer algo
> (ex.: keystore perdida, repositório novo). O link fixo que o botão do site usa é:
> `https://github.com/lyoys/lyoys-app/releases/latest/download/app-release.apk`.

Dá para distribuir o app Lyoys direto pelo site institucional (Wix), sem depender da
aprovação nem da conta paga da Google Play. O usuário baixa um arquivo `.apk` e instala
manualmente no Android. Isso pode ser usado como solução imediata, em paralelo com o
processo de publicação na Play Store (veja `PUBLICACAO_PLAY_STORE.md`), que continua
valendo a pena depois por dar mais confiança e permitir atualização automática.

## O que muda para quem baixa

Como o app não vem da Play Store, o Android mostra um aviso de segurança na instalação e
pede para a pessoa autorizar "instalar apps de fontes desconhecidas" para o navegador ou
gerenciador de arquivos usado. É uma etapa a mais, mas não impede a instalação — só exige
uma confirmação manual. Também não há atualização automática: toda nova versão precisa
ser baixada e instalada de novo.

Há duas formas de gerar o `.apk`: manualmente no Android Studio (Opção A), ou automática
via GitHub Actions, sem precisar instalar nada (Opção B, recomendada se você não tem
Android Studio na sua máquina).

## Opção B: gerar o APK automaticamente, sem Android Studio (GitHub Actions)

Já preparei o workflow pronto em `.github/workflows/build-apk.yml` e o script
`scripts/patch-android-signing.js`. Ele compila o app e gera um `.apk` assinado sozinho,
toda vez que o código for atualizado no GitHub — e ainda publica o arquivo com um link de
download fixo (GitHub Releases), sem precisar de Google Drive.

Passo a passo (feito uma vez só):

1. **Criar um repositório no GitHub** (gratuito): crie uma conta em github.com se ainda
   não tiver, crie um repositório novo (pode ser privado) e suba a pasta `lyoys-app/`
   inteira para ele (`git init`, `git add .`, `git commit -m "app lyoys"`,
   `git remote add origin <url-do-repo>`, `git push -u origin main`).

2. **Gerar a keystore de assinatura** (uma vez só — é ela que garante que futuras
   atualizações do app sejam reconhecidas como vindas de vocês). Com Java instalado numa
   máquina qualquer, rode:
   ```
   keytool -genkeypair -v -keystore lyoys-release.keystore -alias lyoys \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
   Vai pedir para criar uma senha e alguns dados (nome, organização). **Guarde a senha e o
   arquivo `lyoys-release.keystore` num lugar seguro** — sem eles, não dá para publicar
   atualizações no futuro (nem na Play Store, nem pelo site).

3. **Converter a keystore para texto** (para poder colar como secret do GitHub):
   ```
   base64 -i lyoys-release.keystore | tr -d '\n' > keystore-base64.txt
   ```
   (No Windows/PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("lyoys-release.keystore")) | Out-File keystore-base64.txt`)

4. **Cadastrar os secrets no GitHub**: no repositório, vá em `Settings > Secrets and
   variables > Actions > New repository secret` e crie quatro:
   - `ANDROID_KEYSTORE_BASE64`: cole o conteúdo de `keystore-base64.txt`.
   - `ANDROID_KEYSTORE_PASSWORD`: a senha que você criou no passo 2.
   - `ANDROID_KEY_ALIAS`: `lyoys` (ou o alias que você usou).
   - `ANDROID_KEY_PASSWORD`: normalmente a mesma senha da keystore.

5. **Rodar o build**: qualquer `git push` na branch `main` já dispara o workflow
   automaticamente. Ou, na aba `Actions` do repositório, escolha "Build APK" →
   "Run workflow" para rodar na hora.

6. **Pegar o link de download**: quando o workflow terminar (ícone verde ✓), vá na aba
   `Releases` do repositório (barra lateral direita da página principal do GitHub). Vai
   ter uma release tipo "Lyoys App — build 3" com o arquivo `app-release.apk` anexado —
   clique com o botão direito nele e copie o link. Esse link já força o download direto e
   pode ir no botão "Baixar para Android (.apk)" da página Download do site.

7. **Atualizações futuras**: sempre que mudar algo no app (nova vaga fixa, ajuste visual,
   etc.), suba as mudanças (`git push`) — o GitHub gera uma nova release com um novo link.
   Atualize o botão do site com o novo link (o antigo continua funcionando, mas fica
   desatualizado).

Sem essa configuração de secrets, o workflow falha na etapa de assinatura — ele não gera
um APK sem chave, de propósito, para nunca publicar uma versão sem assinatura válida.

## Opção A: gerar o APK manualmente com Android Studio

Com a pasta `android/` já criada (`npx cap add android` — veja `README.md`), no Android
Studio:

1. `Build > Generate Signed Bundle / APK`.
2. Escolha **APK** (não App Bundle desta vez).
3. Use a mesma keystore criada para a Play Store, ou crie uma se ainda não tiver — mas se
   pretende publicar na Play Store depois, use a mesma keystore nas duas versões para não
   ter dor de cabeça com assinaturas diferentes.
4. Build type `release`. Isso gera um arquivo tipo
   `android/app/release/app-release.apk`.

## 2. Hospedar o arquivo

O Wix tem limitações para hospedar arquivos executáveis (`.apk`) diretamente e forçar o
download correto. O caminho mais confiável, usando a conta Google que vocês já têm
conectada:

1. Suba o `app-release.apk` para uma pasta do Google Drive.
2. Clique com o botão direito no arquivo → `Compartilhar` → mude para "Qualquer pessoa
   com o link" → copie o link.
3. O link padrão do Drive abre uma tela de visualização, não baixa direto. Para forçar o
   download, pegue o ID do arquivo (a parte entre `/d/` e `/view` no link) e monte a URL:
   ```
   https://drive.google.com/uc?export=download&id=SEU_ID_AQUI
   ```
   Esse é o link que vai no botão do site.

   Alternativa sem Google Drive: serviços como Firebase App Distribution ou GitHub
   Releases também hospedam `.apk` com link direto — mais indicado se a Lyoys já for
   usar Firebase para as notificações push.

## 3. Colocar o botão no site (Wix)

No editor do Wix (lyoysadm.wixstudio.com):

1. Adicione um botão na página inicial, algo como "Baixar o app Lyoys".
2. Nas configurações de link do botão, escolha "Link externo" e cole a URL de download
   montada no passo 2.
3. Marque para abrir em nova aba.
4. Abaixo do botão, vale um texto curto avisando que é preciso permitir "instalar de
   fontes desconhecidas" no Android — evita confusão de quem nunca fez isso.

## 4. Atualizações futuras

Toda vez que gerar uma nova versão do app, repita o passo 1 (gerar `.apk` novo com
`versionCode` maior — mesmo arquivo `android/app/build.gradle` usado para a Play Store),
suba o novo arquivo no Drive substituindo o anterior (mantendo o mesmo ID de
compartilhamento, se possível, para o link do site não mudar).
