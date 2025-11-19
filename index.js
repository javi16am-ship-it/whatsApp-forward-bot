const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const fs = require('fs');

const authFolder = './auth_info';
if (!fs.existsSync(authFolder)) fs.mkdirSync(authFolder);

console.log('>>> GENERANDO QR...');

useMultiFileAuthState(authFolder).then(({ state }) => {
  // creamos el socket pero SIN listeners que usen disco/network
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['Bot', 'Chrome', '112'],
    markOnlineOnConnect: false,
    keepAliveIntervalMs: 30000
  });

  sock.ev.on('connection.update', ({ qr }) => {
    if (qr) {
      console.log('\n>>> QR CODE (escanea con WhatsApp):\n');
      qrcode.generate(qr, { small: true });
    }
  });

  // mantenemos vivo el proceso
  setInterval(() => {}, 10000);
}).catch(err => {
  console.error('>>> ERROR:', err.message || err);
  process.exit(1);
});
