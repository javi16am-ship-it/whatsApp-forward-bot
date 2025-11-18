const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const http = require('http');

let qrUrl = '';
const ORIGIN_ID = 'ORIGIN_GROUP_ID';   // los cambiaremos después
const DEST_ID   = 'DEST_GROUP_ID';

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (up) => {
    const { qr, connection } = up;
    if (qr) {
      qrUrl = await qrcode.toDataURL(qr);
      console.log('QR generado en /qr');
    }
    if (connection === 'open') console.log('✅ Bot conectado');
  });

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;
    if (msg.key.remoteJid !== ORIGIN_ID) return;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '<media>';
    await sock.sendMessage(DEST_ID, { text: `${msg.pushName}: ${text}` });
  });
}

start();

http.createServer((req, res) => {
  if (req.url === '/qr' && qrUrl) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<img src="${qrUrl}" style="width:90%"><br><p>Escanea con WhatsApp</p>`);
  } else {
    res.writeHead(404);
    res.end('QR no listo aún');
  }
}).listen(process.env.PORT || 10000);
