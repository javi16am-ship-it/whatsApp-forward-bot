const { default: makeWASocket, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

// auth totalmente en RAM (no toca disco)
const auth = {
  creds: {
    noiseKey: undefined,
    signedIdentityKey: undefined,
    signedPreKey: undefined,
    registrationId: undefined,
    me: undefined,
    account: undefined,
    signalIdentities: [],
    lastAccountSyncTimestamp: undefined,
    myAppStateKeyId: undefined
  },
  keys: {}
};

const sock = makeWASocket({
  auth: makeCacheableSignalKeyStore(auth, pino({ level: 'silent' })),
  logger: pino({ level: 'silent' }),
  printQRInTerminal: true
});

sock.ev.on('connection.update', ({ qr, connection }) => {
  if (qr) {
    console.log('\n>>> QR CODE (escanea con WhatsApp):\n');
    qrcode.generate(qr, { small: true });
  }
  if (connection === 'open') console.log('>>> BOT CONECTADO');
});
