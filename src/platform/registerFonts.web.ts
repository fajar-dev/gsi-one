import featherFont from 'react-native-vector-icons/Fonts/Feather.ttf';
export function registerFonts(): void {
  if (document.getElementById('gsi-icon-font')) return;
  const style = document.createElement('style');
  style.id = 'gsi-icon-font';
  style.textContent = `@font-face { font-family: 'Feather'; src: url('${featherFont}') format('truetype'); font-display: block; }`;
  document.head.appendChild(style);
}
