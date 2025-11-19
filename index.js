const fs = require('fs');
const logFile = fs.createWriteStream('/tmp/bot.log', { flags: 'a' });
console.log = function (...args) {
  logFile.write(new Date().toISOString() + ' ' + args.join(' ') + '\n');
  process.stdout.write(args.join(' ') + '\n');
};
console.error = console.log;

try {
  console.log('>>> CARGANDO MODULOS...');
  const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
  const qrcode = require('qrcode-terminal');
  const pino = require('pino');
  console.log('>>> MODULOS OK');

  const authFolder = './auth_info';
  if (!fs.existsSync(authFolder)) fs.mkdirSync(authFolder);

  console.log('>>> AUTH FOLDER OK');
  useMultiFileAuthState(authFolder).then(({ state, saveCreds }) => {
    console.log('>>> AUTH STATE OK');
    const sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }) });
    console.log('>>> SOCKET CREADO');

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', ({ qr, connection }) => {
      if (qr) {
        console.log('>>> QR CODE:\n');
        qrcode.generate(qr, { small: true });
      }
      if (connection === 'open') console.log('>>> BOT CONECTADO');
    });
  }).catch(err => {
    console.error('>>> ERROR AUTH:', err.message || err);
    console.error(err.stack);
  });
} catch (e) {
  console.error('>>> ERROR REQUIRE:', e.message || e);
  console.error(e.stack);
}
