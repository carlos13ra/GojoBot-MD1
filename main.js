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
  const from = m.key.remoteJid;
  const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';

  initDB(m, client);
  antilink(client, m);

  // Ejecutar plugins "all" ligeros
  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (plugin?.all) {
      try { await plugin.all.call(client, m, { client }); }
      catch (err) { console.error(`Error en plugin.all -> ${name}`, err); }
    }
  }

  // Datos de usuario, chat y bot
  const chat = global.db.data.chats[from] || {};
  const settings = global.db.data.settings[botJid] || {};
  const user = global.db.data.users[sender] ||= {};
  const users = chat.users?.[sender] ||= {};

  // Prefijos
  const namebot = settings.namebot || 'GojoBot - MD';
  const prefixList = Array.isArray(settings.prefix) ? settings.prefix : typeof settings.prefix === 'string' ? [settings.prefix] : ['/', '!', '.'];
  const prefix = new RegExp(`^(${namebot}|${prefixList.join('|')})`, 'i');
  const text = m.message.conversation || m.message.extendedTextMessage?.text || '';

  if (!text.match(prefix)) return;

  const args = text.replace(prefix, '').trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (!command) return;

  // Datos de grupo
  let groupAdmins = [], groupName = '';
  if (m.isGroup) {
    const meta = await client.groupMetadata(from).catch(() => ({ participants: [] }));
    groupName = meta.subject || '';
    groupAdmins = meta.participants.filter(p => ['admin', 'superadmin'].includes(p.admin));
  }

  const isAdmins = m.isGroup && groupAdmins.some(p => [p.jid, p.id, p.phoneNumber].includes(sender));
  const isBotAdmins = m.isGroup && groupAdmins.some(p => [p.jid, p.id, p.phoneNumber].includes(botJid));

  // Manejo Primary/Sub-Bots
  function getAllBots() {
    const bots = [];
    const dirs = ['./Sessions/Subs', './Sessions/Owner'];
    dirs.forEach(dir => {
      try {
        fs.readdirSync(path.resolve(dir)).forEach(sub => {
          if (fs.existsSync(path.join(dir, sub, 'creds.json'))) bots.push(sub + '@s.whatsapp.net');
        });
      } catch {}
    });
    return bots;
  }

  const botPrimary = chat.primaryBot;
  if (botPrimary && botPrimary !== botJid) {
    const activeBots = getAllBots();
    if (!activeBots.includes(botPrimary)) chat.primaryBot = botJid; // Si primary cae, elegir este bot
    if (chat.primaryBot !== botJid) return; // Solo responde primary
  } else {
    chat.primaryBot ||= botJid;
  }

  // Comprobaciones de comando
  const cmdData = global.comandos.get(command);
  if (!cmdData) {
    await client.readMessages([m.key]);
    return m.reply(`El comando *${command}* no existe. Usa *${prefixList[0]}help* para ver la lista.`);
  }

  if (cmdData.isOwner && !global.owner.map(o => o + '@s.whatsapp.net').includes(sender)) return;
  if (cmdData.isAdmin && !isAdmins) return m.reply('Solo administradores pueden usar este comando.');
  if (cmdData.botAdmin && !isBotAdmins) return m.reply('El bot debe ser administrador.');

  // Stats y nivel
  const today = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' }).split('/').reverse().join('-');
  user.stats ||= {};
  user.stats[today] ||= { msgs: 0, cmds: 0 };
  user.stats[today].msgs++;
  users.stats ||= {};
  users.stats[today] ||= { cmds: 0 };
  users.stats[today].cmds++;

  user.usedcommands = (user.usedcommands || 0) + 1;
  settings.commandsejecut = (settings.commandsejecut || 0) + 1;

  try {
    await client.readMessages([m.key]);
    await cmdData.run(client, m, args, prefixList[0], command, text);
  } catch (err) {
    await client.sendMessage(m.chat, { text: `Error al ejecutar comando:\n${err}` }, { quoted: m });
  }

  level(m);
};
