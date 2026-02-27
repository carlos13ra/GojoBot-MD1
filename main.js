import ws from 'ws';
import moment from 'moment';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import gradient from 'gradient-string';
import seeCommands from './lib/system/commandLoader.js';
import initDB from './lib/system/initDB.js';
import antilink from './commands/antilink.js';
import level from './commands/level.js';

seeCommands();

export default async (client, m) => {
  if (!m.message) return;

  const sender = m.sender;
  const body = 
    m.message.conversation ||
    m.message.extendedTextMessage?.text ||
    m.message.imageMessage?.caption ||
    m.message.videoMessage?.caption ||
    m.message.buttonsResponseMessage?.selectedButtonId ||
    m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m.message.templateButtonReplyMessage?.selectedId || '';

  // Inicialización DB y plugins
  initDB(m, client);
  try { antilink(client, m); } catch {}

  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (plugin?.all) {
      try { await plugin.all.call(client, m, { client }); } catch {}
    }
  }

  // Variables de entorno
  const from = m.key.remoteJid;
  const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
  const chat = global.db.data.chats[m.chat] ||= {};
  const settings = global.db.data.settings[botJid] ||= {};
  const user = global.db.data.users[sender] ||= {};

  // Prefijos y detección de comando
  const namebot = settings.namebot || 'GojoBot - MD';
  const tipo = settings.type || 'Sub';
  const shortForms = [namebot.charAt(0), namebot.split(' ')[0], tipo.split(' ')[0]];
  const prefixes = [namebot, ...shortForms, '/', '!', '.', '#'];

  const prefixRegex = new RegExp(`^(${prefixes.map(p => p.replace(/[|\\{}()[\]^$+*.\-?]/g,'\\$&')).join('|')})`, 'i');
  const match = prefixRegex.exec(body);
  if (!match) return;

  const usedPrefix = match[0];
  const args = body.slice(usedPrefix.length).trim().split(/ +/);
  const command = (args.shift() || '').toLowerCase();
  const text = args.join(' ');

  // Información del grupo
  let groupAdmins = [];
  let groupName = '';
  if (m.isGroup) {
    const metadata = await client.groupMetadata(m.chat).catch(() => null);
    groupName = metadata?.subject || '';
    groupAdmins = metadata?.participants.filter(p => ['admin','superadmin'].includes(p.admin)) || [];
  }

  const isAdmins = m.isGroup ? groupAdmins.some(p => p.jid === sender) : true;
  const isBotAdmins = m.isGroup ? groupAdmins.some(p => p.jid === botJid) : true;

  // Validación de comando
  const cmdData = global.comandos.get(command);
  if (!cmdData) return m.reply(`El comando *${command}* no existe. Usa *${usedPrefix}help*`);

  if (cmdData.isOwner && !global.owner.map(o => o+'@s.whatsapp.net').includes(sender)) return;
  if (cmdData.isAdmin && !isAdmins) return m.reply('❌ Necesitas ser admin');
  if (cmdData.botAdmin && !isBotAdmins) return m.reply('❌ Necesito ser admin');

  // Actualizar estadísticas
  const today = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' }).split('/').reverse().join('-');
  user.stats ||= {};
  user.stats[today] ||= { msgs: 0, cmds: 0 };
  user.stats[today].msgs++;
  user.usedcommands = (user.usedcommands || 0) + 1;

  try {
    await cmdData.run(client, m, args, usedPrefix, command, text);
    user.stats[today].cmds++;
    level(m);
  } catch (err) {
    console.error(err);
    m.reply(`❌ Error al ejecutar el comando: ${err.message}`);
  }
};
