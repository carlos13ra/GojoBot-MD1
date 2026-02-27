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
import { getGroupAdmins } from './lib/message.js';

seeCommands()

export default async (client, m) => {
  if (!m.message) return;
  const sender = m.sender;
  let body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply?.selectedRowId || m.message.templateButtonReplyMessage?.selectedId || '';

  // Inicializamos la DB
  initDB(m, client);
  antilink(client, m);

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // 🔥 INTERCEPTAMOS TODOS LOS MENSAJES DEL BOT
  const originalSendMessage = client.sendMessage.bind(client);
  client.sendMessage = async (jid, message, options = {}) => {
    try {
      const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
      const settings = global.db.data.settings[botJid] || {};

      // Solo aplica si el mensaje no tiene imagen
      if (!message.image && Array.isArray(settings.banners) && settings.banners.length) {
        const banner = pickRandom(settings.banners);
        const channel = Array.isArray(settings.channels) && settings.channels.length ? pickRandom(settings.channels) : null;

        let caption = message.text || '';
        if (channel) caption += `\n\n📢 Canal:\n${channel.name}\nhttps://whatsapp.com/channel/${channel.id.replace('@newsletter','')}`;

        message = {
          image: { url: banner },
          caption,
          ...message
        };
      }

      return await originalSendMessage(jid, message, options);
    } catch (e) {
      return await originalSendMessage(jid, message, options);
    }
  };

  // Ejecutamos plugin.all
  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (plugin && typeof plugin.all === "function") {
      try {
        await plugin.all.call(client, m, { client });
      } catch (err) {
        console.error(`Error en plugin.all -> ${name}`, err);
      }
    }
  }

  const from = m.key.remoteJid;
  const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
  const chat = global.db.data.chats[m.chat] || {};
  const settings = global.db.data.settings[botJid] || {};
  const user = global.db.data.users[sender] ||= {};
  const users = chat.users[sender] ||= {};

  // Prefijos
  const rawBotname = settings.namebot || 'GojoBot - MD';
  const tipo = settings.type || 'Sub';
  const isValidBotname = /^[\w\s]+$/.test(rawBotname);
  const namebot = isValidBotname ? rawBotname : 'GojoBot - MD';
  const shortForms = [namebot.charAt(0), namebot.split(" ")[0], tipo.split(" ")[0], namebot.split(" ")[0].slice(0, 2), namebot.split(" ")[0].slice(0, 3)];
  const prefixes = shortForms.map(name => `${name}`);
  prefixes.unshift(namebot);

  let prefix;
  if (Array.isArray(settings.prefix) || typeof settings.prefix === 'string') {
    const prefixArray = Array.isArray(settings.prefix) ? settings.prefix : [settings.prefix];
    prefix = new RegExp('^(' + prefixes.join('|') + ')?(' + prefixArray.map(p => p.replace(/[|\\{}()[\]^$+*.\-\^]/g, '\\$&')).join('|') + ')', 'i');
  } else if (settings.prefix === true) {
    prefix = new RegExp('^', 'i');
  } else {
    prefix = new RegExp('^(' + prefixes.join('|') + ')?', 'i');
  }

  const strRegex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  let pluginPrefix = client.prefix ? client.prefix : prefix;
  let matchs = pluginPrefix instanceof RegExp ? [[pluginPrefix.exec(m.text), pluginPrefix]] : Array.isArray(pluginPrefix) ? pluginPrefix.map(p => {
    let regex = p instanceof RegExp ? p : new RegExp(strRegex(p));
    return [regex.exec(m.text), regex];
  }) : typeof pluginPrefix === 'string' ? [[new RegExp(strRegex(pluginPrefix)).exec(m.text), new RegExp(strRegex(pluginPrefix))]] : [[null, null]];
  let match = matchs.find(p => p[0]);

  // plugin.before
  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (!plugin) continue;
    if (plugin.disabled) continue;
    if (typeof plugin.before === "function") {
      try {
        if (await plugin.before.call(client, m, { client })) continue;
      } catch (err) {
        console.error(`Error en plugin.all -> ${name}`, err);
      }
    }
  }

  if (!match) return;

  let usedPrefix = (match[0] || [])[0] || '';
  let args = m.text.slice(usedPrefix.length).trim().split(" ");
  let command = (args.shift() || '').toLowerCase();
  let text = args.join(' ');

  const pushname = m.pushName || 'Sin nombre';
  let groupMetadata = null;
  let groupAdmins = [];
  let groupName = '';
  if (m.isGroup) {
    groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
    groupName = groupMetadata?.subject || '';
    groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || [];
  }
  const isBotAdmins = m.isGroup ? groupAdmins.some(p => (p.phoneNumber === botJid || p.jid === botJid || p.id === botJid || p.lid === botJid )) : false;
  const isAdmins = m.isGroup ? groupAdmins.some(p => (p.phoneNumber === sender || p.jid === sender || p.id === sender || p.lid === sender )) : false;

  // Validaciones de comando y permisos
  const chatData = global.db.data.chats[from];
  const isOwners = [botJid, ...(settings.owner ? [settings.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(sender);
  if (!isOwners && settings.self) return;
  if (!command) return;
  const cmdData = global.comandos.get(command);
  if (!cmdData) return await client.readMessages([m.key]) && m.reply(`ꕤ El comando *${command}* no existe.\n✎ Usa *help*`);

  try {
    await client.readMessages([m.key]);
    user.usedcommands = (user.usedcommands || 0) + 1;
    settings.commandsejecut = (settings.commandsejecut || 0) + 1;
    users.usedTime = new Date();
    users.lastCmd = Date.now();
    user.exp = (user.exp || 0) + Math.floor(Math.random() * 100);
    user.name = m.pushName;
    await cmdData.run(client, m, args, usedPrefix, command, text);
  } catch (error) {
    await client.sendMessage(m.chat, { text: `《✧》 Error al ejecutar el comando\n${error}` }, { quoted: m });
  }

  level(m);
};
