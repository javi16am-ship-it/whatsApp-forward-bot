const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const fs = require('fs');

const authFolder = './auth_info';

// si no existe la carpeta, la creamos
if (!fs.existsSync(authFolder)) fs.mkdirSync(authFolder);

async function start() {
  console.log('>>> INICIANDO...');
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', ({ qr, connection }) => {
    if (qr) {
      console.log('\n>>> QR CODE (escanea con WhatsApp):\n');
      qrcode.generate(qr, { small: true });
    }
    if (connection === 'open') console.log('>>> BOT CONECTADO');
  });
}

start().catch(err => {
  console.error('>>> ERROR:', err.message || err);
  process.exit(1);
});
