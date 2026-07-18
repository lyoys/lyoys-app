// Gera os PNGs de ícone e splash screen a partir dos SVGs em assets/ usando `sharp`.
// Roda automaticamente no workflow do GitHub Actions, antes de aplicar os assets ao
// projeto Android com `npx capacitor-assets generate`.
//
// Por quê: não temos uma arte oficial da Lyoys em alta resolução ainda, então o ícone
// usa a mesma máscara de teatro que já aparece no site institucional (versão simplificada
// em SVG), só para o app parar de usar o ícone genérico do Capacitor. Quando a Lyoys tiver
// uma arte oficial (idealmente um PNG quadrado de 1024x1024), é só substituir
// assets/icon.svg e assets/splash.svg (ou os PNGs gerados) por ela.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '..', 'assets');

async function main() {
  const iconSvg = fs.readFileSync(path.join(assetsDir, 'icon.svg'));
  const splashSvg = fs.readFileSync(path.join(assetsDir, 'splash.svg'));

  await sharp(iconSvg, { density: 384 })
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
  console.log('assets/icon.png gerado (1024x1024).');

  await sharp(splashSvg, { density: 384 })
    .resize(2732, 2732)
    .png()
    .toFile(path.join(assetsDir, 'splash.png'));
  console.log('assets/splash.png gerado (2732x2732).');
}

main().catch((err) => {
  console.error('Erro ao gerar ícone/splash:', err);
  process.exit(1);
});
