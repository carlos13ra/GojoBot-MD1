import fs from 'fs';
import path from 'path';
import moment from 'moment';
import chalk from 'chalk';
import gradient from 'gradient-string';
import seeCommands from './lib/system/commandLoader.js';
import initDB from './lib/system/initDB.js';
import antilink from './commands/antilink.js';
import level from './commands/level.js';

seeCommands();

let cachedBots = null;
function getAllSessionBots() {
    if (cachedBots) return cachedBots;
    const bots = [];
    const sessionDirs = ['./Sessions/Subs'];
    for (const dir of sessionDirs) {
        try {
            for (const sub of fs.readdirSync(path.resolve(dir))) {
                const credsPath = path.resolve(dir, sub, 'creds.json');
                if (fs.existsSync(credsPath)) bots.push(sub + '@s.whatsapp.net');
            }
        } catch {}
    }
    try {
        const ownerCreds = path.resolve('./Sessions/Owner/creds.json');
        if (fs.existsSync(ownerCreds)) bots.push(global.client.user.id.split(':')[0] + '@s.whatsapp.net');
    } catch {}
    cachedBots = bots;
    return bots;
}

export default async (client, m) => {
    if (!m.message) return;
    const sender = m.sender;
    const from = m.key.remoteJid;
    const chat = global.db.data.chats[from] || {};
    const settings = global.db.data.settings[client.user.id.split(':')[0] + '@s.whatsapp.net'] || {};
    const user = global.db.data.users[sender] ||= {};
    const users = chat.users[sender] ||= {};

    initDB(m, client);
    antilink(client, m);

    // Ejecutar plugin global "all"
    for (const name in global.plugins) {
        const plugin = global.plugins[name];
        if (plugin?.all) {
            try { await plugin.all.call(client, m, { client }); } 
            catch (e) { console.error(`Error en plugin.all -> ${name}`, e); }
        }
    }

    // Manejo de grupo
    let groupAdmins = [];
    let groupMetadata = null;
    if (m.isGroup) {
        groupMetadata = await client.groupMetadata(from).catch(() => null);
        groupAdmins = groupMetadata?.participants.filter(p => ['admin','superadmin'].includes(p.admin)) || [];
    }
    const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
    const isBotAdmins = groupAdmins.some(p => p.jid === botJid);
    const isAdmins = groupAdmins.some(p => p.jid === sender);

    // Prefijo y comando
    const rawBotname = settings.namebot || 'GojoBot - MD';
    const prefix = settings.prefix === true ? /^/i :
        new RegExp('^(' + [rawBotname].join('|') + ')[' + (Array.isArray(settings.prefix) ? settings.prefix.join('') : settings.prefix || '') + ']', 'i');
    const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
    const match = body.match(prefix);
    if (!match) return;

    const usedPrefix = match[0];
    const args = body.slice(usedPrefix.length).trim().split(' ');
    const command = (args.shift() || '').toLowerCase();
    const text = args.join(' ');

    const cmdData = global.comandos.get(command);
    if (!cmdData) return await client.sendMessage(from, { text: `El comando ${command} no existe.` }, { quoted: m });

    // Comprobaciones de permisos
    const isOwners = [botJid, ...(settings.owner ? [settings.owner] : []), ...global.owner.map(n => n + '@s.whatsapp.net')].includes(sender);
    if ((cmdData.isOwner && !isOwners) || (cmdData.isAdmin && !isAdmins) || (cmdData.botAdmin && !isBotAdmins)) return;

    // Control C-primary
    const botprimaryId = chat.primaryBot;
    if (botprimaryId && botprimaryId !== botJid) {
        const participants = m.isGroup ? groupMetadata?.participants || [] : [];
        const primaryInGroup = participants.some(p => p.jid === botprimaryId);
        const primaryActive = getAllSessionBots().includes(botprimaryId);
        if (!primaryInGroup || !primaryActive) {
            // Si el primario falla, se puede elegir otro automáticamente
            chat.primaryBot = botJid;
        } else if (botprimaryId !== botJid) return; // No responder si no somos el primario
    }

    // Ejecutar comando
    try {
        await client.readMessages([m.key]);
        user.usedcommands = (user.usedcommands || 0) + 1;
        settings.commandsejecut = (settings.commandsejecut || 0) + 1;
        users.lastCmd = Date.now();
        user.exp = (user.exp || 0) + Math.floor(Math.random() * 100);
        await cmdData.run(client, m, args, usedPrefix, command, text);
    } catch (e) {
        await client.sendMessage(from, { text: `Error al ejecutar el comando:\n${e}` }, { quoted: m });
    }

    level(m);
};
