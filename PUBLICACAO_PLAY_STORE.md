# Guia de publicação na Google Play Store

Eu (Claude) posso construir todo o código do app, mas não tenho como publicá-lo por
vocês: isso exige uma conta de desenvolvedor Google Play (pessoa física ou jurídica,
taxa única de US$25) e o envio final precisa ser feito por alguém da Lyoys com acesso a
essa conta e aos meios de pagamento. Abaixo está o passo a passo.

## 1. Preparar o ambiente (uma vez)

- Instalar [Node.js 18+](https://nodejs.org/) e [Android Studio](https://developer.android.com/studio).
- Rodar, na pasta do projeto:
  ```bash
  npm install
  npx cap add android
  npx cap sync
  ```

## 2. Criar a conta de desenvolvedor Google Play

1. Acesse https://play.google.com/console/signup.
2. Pague a taxa única de registro (~US$25).
3. Preencha os dados da Lyoys Entertainment (CNPJ 61.585.516/0001-30, endereço em
   Taguatinga - DF) e aceite os termos.
4. Aguarde a verificação da conta (pode levar de algumas horas a alguns dias).

## 3. Gerar os ícones e a tela de splash

- Substitua os placeholders de ícone em `android/app/src/main/res/` pelas artes finais
  (pode gerar a partir do logo Lyoys no Canva, exportando em alta resolução).
- Ferramenta útil: `npx @capacitor/assets generate` a partir de um ícone 1024x1024 e uma
  splash 2732x2732.

## 4. Gerar o pacote assinado (.aab)

No Android Studio, com a pasta `android/` aberta:

1. `Build > Generate Signed Bundle / APK`.
2. Escolha **Android App Bundle**.
3. Crie uma nova keystore (guarde o arquivo `.jks` e as senhas em local seguro — sem eles
   vocês não conseguem atualizar o app depois).
4. Selecione build type `release` e gere o `.aab`.

## 5. Criar a ficha do app no Play Console

1. `Criar app` → nome "Lyoys", idioma padrão português (Brasil), categoria
   "Estilo de vida" ou "Entretenimento".
2. Preencher a ficha da loja: descrição curta e longa (pode reaproveitar o texto de
   "Quem somos" do app), capturas de tela do app (print do emulador ou celular),
   ícone 512x512 e imagem de destaque.
3. Política de privacidade: obrigatória por causa do upload de fotos/vídeos e dados
   pessoais no formulário de inscrição — precisa de uma URL pública com o texto (pode
   ser uma página simples no próprio site Wix da Lyoys).
4. Classificação de conteúdo: preencher o questionário (provavelmente "Livre").
5. Público-alvo: informar que o app não é direcionado a crianças, mas colhe dados de
   candidatos (idade mínima recomendada: 16+, conforme a chamada de casting).

## 6. Enviar o .aab e publicar

1. `Produção > Criar nova versão`, subir o arquivo `.aab` gerado no passo 4.
2. Preencher notas da versão.
3. Enviar para revisão do Google (normalmente leva de 1 a 7 dias na primeira submissão).
4. Após aprovado, o app fica disponível na Play Store.

## Atualizações futuras

Para lançar uma nova versão: alterar `versionCode`/`versionName` em
`android/app/build.gradle`, rodar `npm run build && npx cap sync`, gerar novo `.aab`
assinado com a **mesma keystore** e subir uma nova versão em `Produção` no Play Console.
