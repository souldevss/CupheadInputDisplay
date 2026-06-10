const { app, BrowserWindow } = require('electron');
const { GlobalKeyboardListener } = require('node-global-key-listener');

let win;
const vLauncher = new GlobalKeyboardListener();

function createWindow () {
  win = new BrowserWindow({
    width: 800,  // Ajuste para o tamanho real do seu layout de Cuphead
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
  
  // IMPORTANTE: Deixei como false para você conseguir clicar na UI e rebindar as teclas.
  // Mude para true quando for jogar para os cliques passarem direto para o jogo.
  win.setIgnoreMouseEvents(false); 
}

// Dicionário universal de tradução: nomes do global-listener -> e.code padrão W3C
const keyTranslationTable = {
  // Setas
  'UP ARROW': 'ArrowUp', 'DOWN ARROW': 'ArrowDown', 'LEFT ARROW': 'ArrowLeft', 'RIGHT ARROW': 'ArrowRight',
  // Teclas de Controle e Edição
  'SPACE': 'Space', 'ENTER': 'Enter', 'ESCAPE': 'Escape', 'BACKSPACE': 'Backspace', 'TAB': 'Tab', 'CAPS LOCK': 'CapsLock',
  'LEFT SHIFT': 'ShiftLeft', 'RIGHT SHIFT': 'ShiftRight', 'LEFT CTRL': 'ControlLeft', 'RIGHT CTRL': 'ControlRight',
  'LEFT ALT': 'AltLeft', 'RIGHT ALT': 'AltRight', 'DELETE': 'Delete', 'INSERT': 'Insert', 'HOME': 'Home', 'END': 'End',
  'PAGE UP': 'PageUp', 'PAGE DOWN': 'PageDown', 'PRINT SCREEN': 'PrintScreen', 'SCROLL LOCK': 'ScrollLock', 'PAUSE': 'Pause',
  // Teclado Numérico (Numpad)
  'NUMPAD 0': 'Numpad0', 'NUMPAD 1': 'Numpad1', 'NUMPAD 2': 'Numpad2', 'NUMPAD 3': 'Numpad3', 'NUMPAD 4': 'Numpad4',
  'NUMPAD 5': 'Numpad5', 'NUMPAD 6': 'Numpad6', 'NUMPAD 7': 'Numpad7', 'NUMPAD 8': 'Numpad8', 'NUMPAD 9': 'Numpad9',
  'NUMPAD DOT': 'NumpadDecimal', 'NUMPAD SLASH': 'NumpadDivide', 'NUMPAD STAR': 'NumpadMultiply', 'NUMPAD MINUS': 'NumpadSubtract',
  'NUMPAD PLUS': 'NumpadAdd', 'NUMPAD ENTER': 'NumpadEnter',
  // Símbolos da linha numérica e pontuação básica
  'MINUS': 'Minus', 'EQUALS': 'Equal', 'SQUARE BRACKET OPEN': 'BracketLeft', 'SQUARE BRACKET CLOSE': 'BracketRight',
  'SEMICOLON': 'Semicolon', 'QUOTE': 'Quote', 'BACKQUOTE': 'Backquote', 'BACKSLASH': 'Backslash', 'COMMA': 'Comma',
  'DOT': 'Period', 'SLASH': 'Slash'
};

vLauncher.addListener(function (e) {
  if (!win) return;
  
  let rawName = e.name; // Ex: "A", "1", "LEFT SHIFT"
  let finalCode = '';

  // 1. Verifica se está na tabela de traduções explícitas
  if (keyTranslationTable[rawName]) {
    finalCode = keyTranslationTable[rawName];
  } 
  // 2. Se for uma única letra de A-Z (ex: "A" -> "KeyA")
  else if (rawName.length === 1 && rawName >= 'A' && rawName <= 'Z') {
    finalCode = `Key${rawName}`;
  } 
  // 3. Se for um número da fileira de cima (ex: "1" -> "Digit1")
  else if (rawName.length === 1 && rawName >= '0' && rawName <= '9') {
    finalCode = `Digit${rawName}`;
  } 
  // 4. Se for uma tecla de função (ex: "F1" -> "F1")
  else if (rawName.startsWith('F' ) && rawName.length <= 3) {
    finalCode = rawName;
  } 
  // 5. Fallback de segurança para não quebrar caso seja uma tecla muito exótica
  else {
    finalCode = rawName; 
  }

  // Envia o código 100% compatível com o seu rebuildKeyMap() do script.js
  win.webContents.send('global-key', {
    code: finalCode,
    isDown: e.state === 'DOWN'
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
