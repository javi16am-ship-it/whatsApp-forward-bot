const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

async function start() {
  console.log('>>> INICIANDO BOT...');
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', ({ qr, connection }) => {
    if (qr) {
      console.log('>>> QR GENERADO:');
      qrcode.generate(qr, { small: true });
    }
    if (connection === 'open') console.log('>>> BOT CONECTADO');
  });
}

start().catch(err => {
  console.error('>>> ERROR FATAL:', err.message);
  console.error(err.stack);
  process.exit(1);
});
