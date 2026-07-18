// Adiciona a configuração de assinatura (signingConfig) de release ao projeto Android
// gerado pelo Capacitor. Roda automaticamente no workflow do GitHub Actions, depois de
// `npx cap add android`, para que o `assembleRelease` gere um .apk assinado usando a
// keystore vinda dos secrets do GitHub (nunca fica gravada no código).
//
// Extensão .cjs (em vez de .js) de propósito: o package.json do projeto tem
// "type": "module" (ESM), e este script usa require()/CommonJS, então precisa manter a
// extensão .cjs para o Node tratá-lo como CommonJS.
//
// Não precisa rodar isso manualmente — o build-apk.yml chama este script sozinho.

const fs = require('fs');
const path = require('path');

const buildGradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');

if (!fs.existsSync(buildGradlePath)) {
  console.error('Não encontrei android/app/build.gradle. Rode "npx cap add android" antes.');
  process.exit(1);
}

let content = fs.readFileSync(buildGradlePath, 'utf8');

if (content.includes('signingConfigs.release')) {
  console.log('Assinatura de release já configurada, nada a fazer.');
  process.exit(0);
}

const signingConfigBlock = `
    signingConfigs {
        release {
            storeFile file(System.getenv("ANDROID_KEYSTORE_PATH") ?: "release.keystore")
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }
    }
`;

// Insere o bloco signingConfigs logo depois da linha "android {"
content = content.replace(/android\s*\{/, (match) => `${match}\n${signingConfigBlock}`);

// Faz o buildType "release" usar essa assinatura
content = content.replace(
  /(buildTypes\s*\{\s*release\s*\{)/,
  `$1\n            signingConfig signingConfigs.release`
);

fs.writeFileSync(buildGradlePath, content, 'utf8');
console.log('signingConfig de release adicionado a android/app/build.gradle.');
