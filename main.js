import fs from 'fs';
import path from 'path';
import moment from 'moment';
import chalk from 'chalk';
import gradient from 'gradient-string';
import seeCommands from './lib/system/commandLoader.js';
import initDB from './lib/system/initDB.js';
import antilink from './commands/antilink.js';
import level from './commands/level.js';
import { getGroupAdmins } from './lib/message.js';

seeCommands();

export default async (client, m) => {
    if (!m.message) return;
    const sender = m.sender;
    const from = m.key.remoteJid;
    const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
    const chat = global.db.data.chats[from] ||= {};
    const settings = global.db.data.settings[botJid] ||= {};
    const user = global.db.data.users[sender] ||= {};
    const users = chat.users[sender] ||= {};

    // Obtener texto del mensaje
    const body = m.message.conversation || m.message.extendedTextMessage?.text || 
                 m.message.imageMessage?.caption || m.message.videoMessage?.caption || 
                 m.message.buttonsResponseMessage?.selectedButtonId || 
                 m.message.listResponseMessage?.singleSelectReply?.selectedRowId || 
                 m.message.templateButtonReplyMessage?.selectedId || '';

    initDB(m, client);
    antilink(client, m);

    // Ejecutar plugin.all
    for (const name in global.plugins) {
        const plugin = global.plugins[name];
        if (plugin?.all) {
            try { await plugin.all.call(client, m, { client }); } 
            catch (err) { console.error(`Error plugin.all -> ${name}`, err); }
        }
    }

    // ----------------- SISTEMA DE PRIMARIO -----------------
    const getAllSessionBots = () => {
        const sessionDirs = ['./Sessions/Subs'];
        let bots = [];
        for (const dir of sessionDirs) {
            try {
                const subDirs = fs.readdirSync(path.resolve(dir));
                for (const sub of subDirs) {
                    const creds = path.resolve(dir, sub, 'creds.json');
                    if (fs.existsSync(creds)) bots.push(sub+'@s.whatsapp.net');
                }
            } catch {}
        }
        // Owner bot
        const ownerCreds = path.resolve('./Sessions/Owner/creds.json');
        if (fs.existsSync(ownerCreds)) bots.push(botJid);
        return bots;
    };

    const allBots = getAllSessionBots();
    chat.primaryBot ||= botJid; // si no existe primario, usamos este bot
    // Si primario no está conectado, fallback a otro sub-bot activo
    if (!allBots.includes(chat.primaryBot)) chat.primaryBot = allBots[0] || botJid;

    // Solo responde el primario
    if (chat.primaryBot !== botJid) return;

    // ----------------- PERMISOS -----------------
    let groupAdmins = [];
    if (m.isGroup) {
        const groupMetadata = await client.groupMetadata(m.chat).catch(()=>({participants:[]}));
        groupAdmins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id || p.jid || p.phoneNumber);
    }
    const isAdmins = m.isGroup ? groupAdmins.includes(sender) : false;
    const isOwner = [botJid, ...(settings.owner||[]), ...global.owner.map(n=>n+'@s.whatsapp.net')].includes(sender);

    if (!isOwner && settings.self) return;
    if (chat.adminonly && !isAdmins && !isOwner) return;

    // ----------------- COMANDOS -----------------
    const usedPrefix = settings.prefix || '';
    const args = body.slice(usedPrefix.length).trim().split(' ');
    const command = (args.shift() || '').toLowerCase();
    const text = args.join(' ');

    if (!command) return; // Mensajes sin comandos se ignoran aquí, solo plugins.all los procesan

    const cmdData = global.comandos.get(command);
    if (!cmdData) return;

    if ((cmdData.isOwner && !isOwner) || 
        (cmdData.isAdmin && !isAdmins && !isOwner) ||
        (cmdData.botAdmin && !(await client.isBotAdmin(from)))) return;

    try {
        await client.readMessages([m.key]);
        user.usedcommands = (user.usedcommands || 0)+1;
        settings.commandsejecut = (settings.commandsejecut || 0)+1;
        users.usedTime = new Date();
        users.lastCmd = Date.now();
        user.exp = (user.exp || 0) + Math.floor(Math.random()*100);
        user.name = m.pushName;
        await cmdData.run(client, m, args, usedPrefix, command, text);
    } catch (err) {
        await client.sendMessage(m.chat, { text: `Error al ejecutar comando:\n${err}` }, { quoted: m });
    }

    level(m);
};
