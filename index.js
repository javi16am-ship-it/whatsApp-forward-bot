const { default: makeWASocket } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

console.log('>>> INICIANDO BOT...');
const sock = makeWASocket({
  logger: pino({ level: 'silent' })
});

sock.ev.on('connection.update', ({ qr, connection }) => {
  if (qr) {
    console.log('>>> QR GENERADO:');
    qrcode.generate(qr, { small: true });
  }
  if (connection === 'open') console.log('>>> BOT CONECTADO');
});
