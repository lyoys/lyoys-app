// Gera os PNGs de ícone e splash screen a partir da máscara veneziana usada de verdade
// no site institucional da Lyoys (fica hospedada no CDN do Wix). Roda automaticamente no
// workflow do GitHub Actions, antes de aplicar os assets ao projeto Android com
// `npx capacitor-assets generate`.
//
// Por quê baixar do site em vez de usar uma arte própria: a Lyoys ainda não tem uma arte
// oficial de ícone em alta resolução, então usamos a mesma imagem (com fundo transparente)
// que já aparece no cabeçalho do site, recortada e centralizada sobre um fundo escuro.
// Quando a Lyoys tiver uma arte oficial (idealmente um PNG quadrado de 1024x1024), basta
// substituir a constante MASK_URL abaixo por um arquivo local, ou trocar os PNGs gerados
// diretamente em assets/.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '..', 'assets');

// Mesma imagem usada no cabeçalho do site (lyoysadm.wixstudio.com) — máscara veneziana
// com fundo transparente. É a imagem original enviada ao Wix (264x374px, é a resolução
// que a Lyoys tem hoje; fica um pouco suave ao ser ampliada, mas é fiel à marca atual).
const MASK_URL =
  'https://static.wixstatic.com/media/96dfc3_e2c006ebbe004172a171226e4adea14d~mv2.png';

// Mesmo tom de fundo escuro usado no capacitor.config.ts (SplashScreen.backgroundColor)
// e no restante da identidade visual do app.
const BG_COLOR = { r: 11, g: 11, b: 11, alpha: 1 };

async function fetchMask() {
  const res = await fetch(MASK_URL);
  if (!res.ok) {
    throw new Error(`Não consegui baixar a máscara do site (status ${res.status}). Verifique MASK_URL em scripts/generate-icons.cjs.`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function buildIcon(maskBuffer) {
  const CANVAS = 1024;
  // Deixa ~66% do canvas para a máscara, com margem de segurança para o recorte
  // circular/squircle que o Android aplica em ícones adaptativos.
  const maskSize = Math.round(CANVAS * 0.66);
  const maskResized = await sharp(maskBuffer)
    .resize(maskSize, maskSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({ create: { width: CANVAS, height: CANVAS, channels: 4, background: BG_COLOR } })
    .composite([{ input: maskResized, gravity: 'center' }])
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
}

async function buildSplash(maskBuffer) {
  const CANVAS = 2732;
  const maskSize = Math.round(CANVAS * 0.34);
  const maskResized = await sharp(maskBuffer)
    .resize(maskSize, maskSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const textSvg = Buffer.from(`
    <svg width="${CANVAS}" height="260" xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle"
            font-family="Helvetica, Arial, sans-serif" font-size="170"
            letter-spacing="38" fill="#caa14b">LYOYS</text>
    </svg>
  `);

  const maskTop = Math.round(CANVAS * 0.36);
  const maskLeft = Math.round((CANVAS - maskSize) / 2);
  const textTop = maskTop + maskSize + Math.round(CANVAS * 0.03);

  await sharp({ create: { width: CANVAS, height: CANVAS, channels: 4, background: BG_COLOR } })
    .composite([
      { input: maskResized, top: maskTop, left: maskLeft },
      { input: textSvg, top: textTop, left: 0 },
    ])
    .png()
    .toFile(path.join(assetsDir, 'splash.png'));
}

async function main() {
  console.log('Baixando a máscara oficial do site da Lyoys...');
  const maskBuffer = await fetchMask();

  await buildIcon(maskBuffer);
  console.log('assets/icon.png gerado (1024x1024) a partir da máscara do site.');

  await buildSplash(maskBuffer);
  console.log('assets/splash.png gerado (2732x2732) a partir da máscara do site.');
}

main().catch((err) => {
  console.error('Erro ao gerar ícone/splash:', err);
  process.exit(1);
});
