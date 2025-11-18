const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

async function start() {
  console.log('>>> INICIANDO BOT...');
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  console.log('>>> Auth cargado');
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' })
  });
  console.log('>>> Socket creado');

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
  console.error('>>> ERROR CAPTURADO:', err.message || err);
  console.error(err.stack);
  process.exit(1);
});
