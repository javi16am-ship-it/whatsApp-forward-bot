const { default: makeWASocket, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

console.log('>>> INICIANDO BOT...');
// auth vacío para generar QR
const auth = { creds: { noiseKey: undefined, signedIdentityKey: undefined, signedPreKey: undefined, registrationId: undefined }, keys: {} };
const sock = makeWASocket({
  auth: makeCacheableSignalKeyStore(auth, pino({ level: 'silent' })),
  logger: pino({ level: 'silent' })
});

sock.ev.on('connection.update', ({ qr, connection }) => {
  if (qr) {
    console.log('>>> QR GENERADO:');
    qrcode.generate(qr, { small: true });
  }
  if (connection === 'open') console.log('>>> BOT CONECTADO');
});
