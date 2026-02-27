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

seeCommands();

export default async (client, m) => {
    if (!m.message) return;
    const sender = m.sender;
    const from = m.key.remoteJid;
    const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
    const chat = global.db.data.chats[from] ||= {};
    const settings = global.db.data.settings[botJid] || {};
    const user = global.db.data.users[sender] ||= {};
    const users = chat.users[sender] ||= {};

    // Obtener texto del mensaje
    const body = m.message.conversation || 
                 m.message.extendedTextMessage?.text || 
                 m.message.imageMessage?.caption || 
                 m.message.videoMessage?.caption || 
                 m.message.buttonsResponseMessage?.selectedButtonId || 
                 m.message.listResponseMessage?.singleSelectReply?.selectedRowId || 
                 m.message.templateButtonReplyMessage?.selectedId || '';

    initDB(m, client);
    antilink(client, m);

    // Ejecutar plugin.all
    for (const name in global.plugins) {
        const plugin = global.plugins[name];
        if (plugin && typeof plugin.all === "function") {
            try { await plugin.all.call(client, m, { client }); } 
            catch (err) { console.error(`Error en plugin.all -> ${name}`, err); }
        }
    }

    // ------------------- CONFIGURACIÓN DE PREFIX -------------------
    const rawBotname = settings.namebot || 'GojoBot - MD';
    const tipo = settings.type || 'Sub';
    const isValidBotname = /^[\w\s]+$/.test(rawBotname);
    const namebot = isValidBotname ? rawBotname : 'GojoBot - MD';

    const shortForms = [
        namebot.charAt(0),
        namebot.split(" ")[0],
        tipo.split(" ")[0],
        namebot.split(" ")[0].slice(0,2),
        namebot.split(" ")[0].slice(0,3)
    ];
    const prefixes = shortForms.map(n => `${n}`);
    prefixes.unshift(namebot);

    let prefix;
    if (Array.isArray(settings.prefix) || typeof settings.prefix === 'string') {
        const prefixArray = Array.isArray(settings.prefix) ? settings.prefix : [settings.prefix];
        prefix = new RegExp('^(' + prefixes.join('|') + ')?(' + prefixArray.map(p => p.replace(/[|\\{}()[\]^$+*.\-]/g,'\\$&')).join('|') + ')','i');
    } else if (settings.prefix === true) {
        prefix = new RegExp('^', 'i');
    } else {
        prefix = new RegExp('^(' + prefixes.join('|') + ')?','i');
    }

    const strRegex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g,'\\$&');
    const pluginPrefix = client.prefix ? client.prefix : prefix;
    const matchs = pluginPrefix instanceof RegExp ? [[pluginPrefix.exec(m.text), pluginPrefix]] :
                   Array.isArray(pluginPrefix) ? pluginPrefix.map(p => [p instanceof RegExp ? p.exec(m.text) : new RegExp(strRegex(p)).exec(m.text), p]) :
                   [[new RegExp(strRegex(pluginPrefix)).exec(m.text), new RegExp(strRegex(pluginPrefix))]];

    const match = matchs.find(p => p[0]);
    if (!match) return;
    const usedPrefix = (match[0] || [])[0] || '';
    let args = m.text.slice(usedPrefix.length).trim().split(" ");
    let command = (args.shift() || '').toLowerCase();
    let text = args.join(' ');

    // ------------------- DATOS DE GRUPO -------------------
    let groupMetadata = null;
    let groupAdmins = [];
    let groupName = '';
    if (m.isGroup) {
        groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
        groupName = groupMetadata?.subject || '';
        groupAdmins = groupMetadata?.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin') || [];
    }

    const isBotAdmins = m.isGroup ? groupAdmins.some(p => (p.phoneNumber||p.id) === botJid) : false;
    const isAdmins = m.isGroup ? groupAdmins.some(p => (p.phoneNumber||p.id) === sender) : false;
    const isOwner = [botJid, ...(settings.owner? [settings.owner]: []), ...global.owner.map(n=>n+'@s.whatsapp.net')].includes(sender);

    // ------------------- SISTEMA DE PRIMARIO -------------------
    const getAllSessionBots = () => {
        const sessionDirs = ['./Sessions/Subs'];
        let bots = [];
        for (const dir of sessionDirs) {
            try {
                const subDirs = fs.readdirSync(path.resolve(dir));
                for (const sub of subDirs) {
                    const credsPath = path.resolve(dir, sub, 'creds.json');
                    if (fs.existsSync(credsPath)) bots.push(sub+'@s.whatsapp.net');
                }
            } catch {}
        }
        try {
            const ownerCreds = path.resolve('./Sessions/Owner/creds.json');
            if (fs.existsSync(ownerCreds)) bots.push(botJid);
        } catch {}
        return bots;
    };

    const allBots = getAllSessionBots();
    let primaryBot = chat.primaryBot || botJid;

    // Fallback automático si el primario no está online
    if (!allBots.includes(primaryBot)) {
        const available = allBots[0] || botJid;
        chat.primaryBot = available;
        primaryBot = available;
        if (primaryBot !== botJid) return; // sub-bot no responde
    }

    // Solo responde el primario
    if (primaryBot !== botJid) return;

    // ------------------- COMPROBACIONES -------------------
    if (!isOwner && settings.self) return; // modo self
    if (chat.adminonly && !isAdmins && !isOwner) return;

    // ------------------- STATS -------------------
    const today = new Date().toLocaleDateString('es-CO',{timeZone:'America/Bogota',year:'numeric',month:'2-digit',day:'2-digit'}).split('/').reverse().join('-');
    const userrs = chat.users[sender] ||= {};
    if (!userrs.stats) userrs.stats = {};
    if (!userrs.stats[today]) userrs.stats[today] = {msgs:0,cmds:0};
    userrs.stats[today].msgs++;

    // ------------------- EJECUCIÓN DEL COMANDO -------------------
    const cmdData = global.comandos.get(command);
    if (!cmdData) return m.reply(`ꕤ El comando *${command}* no existe.\n✎ Usa *${usedPrefix}help* para ver los comandos.`);

    if (cmdData.isOwner && !isOwner) return;
    if (cmdData.isAdmin && !isAdmins && !isOwner) return client.reply(m.chat,'Solo admins pueden ejecutar este comando',m);
    if (cmdData.botAdmin && !isBotAdmins) return client.reply(m.chat,'Bot necesita ser admin',m);

    try {
        await client.readMessages([m.key]);
        user.usedcommands = (user.usedcommands||0)+1;
        settings.commandsejecut = (settings.commandsejecut||0)+1;
        users.usedTime = new Date();
        users.lastCmd = Date.now();
        user.exp = (user.exp||0)+Math.floor(Math.random()*100);
        user.name = m.pushName;
        users.stats[today].cmds++;
        await cmdData.run(client,m,args,usedPrefix,command,text);
    } catch (error) {
        await client.sendMessage(m.chat,{text:`《✧》 Error al ejecutar el comando\n${error}`},{quoted:m});
    }

    level(m);
};
