const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

const ORIGIN_ID   = 'ORIGIN_GROUP_ID';   // lo cambiarás después
const DEST_ID     = 'DEST_GROUP_ID';     // lo cambiarás después

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ qr, connection }) => {
    if (qr) qrcode.generate(qr, { small: true });
    if (connection === 'open') console.log('✅ Bot conectado');
  });

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    if (from !== ORIGIN_ID) return;

    const text = msg.message.conversation ||
                 msg.message.extendedTextMessage?.text || '<media>';

    await sock.sendMessage(DEST_ID, { text: `${msg.pushName}: ${text}` });
  });
}

start();
