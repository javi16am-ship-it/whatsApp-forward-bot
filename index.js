const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ qr, connection }) => {
    if (qr) {
      console.log('\n┌-----------------------QR-----------------------┐');
      qrcode.generate(qr, { small: true });
      console.log('└------------------------------------------------┘');
    }
    if (connection === 'open') console.log('✅ Bot conectado');
  });
}

start().catch(err => {
  console.error('Fallo al arrancar:', err);
  process.exit(1);
});
