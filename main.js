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

// ====================
// FUNCIONES AUXILIARES
// ====================

// Obtener todos los bots activos
function getAllSessionBots() {
  const sessionDirs = ['./Sessions/Subs'];
  let bots = [];
  for (const dir of sessionDirs) {
    try {
      const subDirs = fs.readdirSync(path.resolve(dir));
      for (const sub of subDirs) {
        const credsPath = path.resolve(dir, sub, 'creds.json');
        if (fs.existsSync(credsPath)) bots.push(sub + '@s.whatsapp.net');
      }
    } catch {}
  }
  try {
    const ownerCreds = path.resolve('./Sessions/Owner/creds.json');
    if (fs.existsSync(ownerCreds)) bots.push(global.client.user.id.split(':')[0] + '@s.whatsapp.net');
  } catch {}
  return bots;
}

// Elegir primary BOC para un grupo respetando setprimary
function choosePrimaryBot(groupId, groupParticipants = []) {
  if (!global.db.data.primaryBots) global.db.data.primaryBots = {};
  groupParticipants = Array.isArray(groupParticipants) ? groupParticipants : [];

  const sessionBots = getAllSessionBots();
  const assignedBots = Object.values(global.db.data.primaryBots);

  // Primary definido manualmente
  const currentPrimary = global.db.data.primaryBots[groupId];

  // Mantener primary manual si sigue disponible
  if (currentPrimary && groupParticipants.includes(currentPrimary) && sessionBots.includes(currentPrimary)) {
    return currentPrimary;
  }

  // Bots disponibles en el grupo
  const botsInGroup = sessionBots.filter(bot => groupParticipants.includes(bot));

  // Elegir primer bot disponible que no esté asignado a otro grupo o mantener currentPrimary
  const candidates = botsInGroup.filter(bot => !assignedBots.includes(bot) || currentPrimary === bot);
  if (candidates.length === 0) return null;

  const newPrimary = candidates[0];
  global.db.data.primaryBots[groupId] = newPrimary;
  console.log(`✅ Nuevo primary bot para ${groupId}: ${newPrimary}`);
  return newPrimary;
}

// ====================
// HANDLER PRINCIPAL
// ====================
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
    m.message.templateButtonReplyMessage?.selectedId ||
    '';

  initDB(m, client);
  antilink(client, m);

  // Plugins globales
  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (plugin?.all) {
      try { await plugin.all.call(client, m, { client }); } 
      catch (err) { console.error(`Error en plugin.all -> ${name}`, err); }
    }
  }

  const from = m.key.remoteJid;
  const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
  const chat = global.db.data.chats[m.chat] || {};
  const settings = global.db.data.settings[botJid] || {};
  const user = global.db.data.users[sender] ||= {};
  const users = chat.users?.[sender] || {};

  // Nombre del bot y prefijos
  const rawBotname = settings.namebot || 'GojoBot - MD';
  const tipo = settings.type || 'Sub';
  const namebot = /^[\w\s]+$/.test(rawBotname) ? rawBotname : 'GojoBot - MD';
  const shortForms = [namebot.charAt(0), namebot.split(" ")[0], tipo.split(" ")[0], namebot.split(" ")[0].slice(0,2), namebot.split(" ")[0].slice(0,3)];
  const prefixes = [namebot, ...shortForms];
  const prefix = Array.isArray(settings.prefix)
    ? new RegExp(`^(${prefixes.join('|')})?(${settings.prefix.map(p => p.replace(/[|\\{}()[\]^$+*.\-\^]/g,'\\$&')).join('|')})`, 'i')
    : settings.prefix === true ? new RegExp('^','i') : new RegExp(`^(${prefixes.join('|')})?`, 'i');
  const strRegex = str => str.replace(/[|\\{}()[\]^$+*?.]/g,'\\$&');
  const pluginPrefix = client.prefix || prefix;
  const matchs = pluginPrefix instanceof RegExp
    ? [[pluginPrefix.exec(m.text), pluginPrefix]]
    : Array.isArray(pluginPrefix)
      ? pluginPrefix.map(p => [p instanceof RegExp ? p.exec(m.text) : new RegExp(strRegex(p)).exec(m.text), p])
      : [[new RegExp(strRegex(pluginPrefix)).exec(m.text), new RegExp(strRegex(pluginPrefix))]];
  const match = matchs.find(p => p[0]);
  if (!match) return;

  const usedPrefix = (match[0] || [])[0] || '';
  let args = m.text.slice(usedPrefix.length).trim().split(" ");
  const command = (args.shift() || '').toLowerCase();
  const text = args.join(" ");

  // Metadata de grupo
  const pushname = m.pushName || 'Sin nombre';
  let groupMetadata = null, groupAdmins = [], groupName = '', participantsIds = [];
  if (m.isGroup) {
    groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
    groupName = groupMetadata?.subject || '';
    groupAdmins = groupMetadata?.participants.filter(p => ['admin','superadmin'].includes(p.admin)) || [];
    participantsIds = groupMetadata?.participants?.map(p => p.jid) || [];
  }

  const isBotAdmins = m.isGroup ? groupAdmins.some(p => p.id === botJid || p.jid === botJid) : false;
  const isAdmins = m.isGroup ? groupAdmins.some(p => p.id === sender || p.jid === sender) : false;
  const isOwners = [botJid, ...(settings.owner?[settings.owner]:[]), ...global.owner.map(num=>num+'@s.whatsapp.net')].includes(sender);

  // LOG de mensaje
  const h = chalk.bold.blue('╭────────────────────────────···');
  const t = chalk.bold.blue('╰────────────────────────────···');
  const v = chalk.bold.blue('│');
  console.log(`\n${h}\n${chalk.bold.yellow(`${v} Fecha: ${chalk.whiteBright(moment().format('DD/MM/YY HH:mm:ss'))}`)}
${chalk.bold.blueBright(`${v} Usuario: ${chalk.whiteBright(pushname)}`)}
${chalk.bold.magentaBright(`${v} Remitente: ${gradient('deepskyblue','darkorchid')(sender)}`)}
${m.isGroup ? chalk.bold.cyanBright(`${v} Grupo: ${chalk.greenBright(groupName)}\n${v} ID: ${gradient('violet','midnightblue')(from)}\n`) : chalk.bold.greenBright(`${v} Chat privado\n`)}
${t}`);

  // Estadísticas
  const today = new Date().toLocaleDateString('es-CO', { timeZone:'America/Bogota', year:'numeric', month:'2-digit', day:'2-digit' }).split('/').reverse().join('-');
  if (!users.stats) users.stats = {};
  if (!users.stats[today]) users.stats[today] = { msgs:0, cmds:0 };
  users.stats[today].msgs++;
  user.usedcommands = (user.usedcommands||0) + 1;

  // Permisos y baneos
  if (!isOwners && settings.self) return;
  if (chat?.isBanned && !isOwners) return console.log(`⚠️ Chat ${from} está baneado`);
  if (chat.adminonly && !isAdmins) return console.log(`⚠️ Comando ${command} solo para admins`);

  // =========================
  // PrimaryBot por grupo con setprimary y failover
  // =========================
  const botAssigned = choosePrimaryBot(from, participantsIds);
  if (botAssigned !== botJid) {
    console.log(`🔹 Bot ${botJid} ignora grupo ${from}, primary es ${botAssigned}`);
    return;
  }

  // Ejecutar comando
  const cmdData = global.comandos.get(command);
  if (!cmdData) {
    await client.readMessages([m.key]);
    return m.reply(`ꕤ El comando *${command}* no existe.\n✎ Usa *${usedPrefix}help* para ver la lista de comandos.`);
  }

  if (cmdData.isOwner && !isOwners) return m.reply(`ꕤ El comando *${command}* no existe.`);
  if (cmdData.isAdmin && !isAdmins) return client.reply(m.chat,'⚠️ Este comando requiere ser admin',m);
  if (cmdData.botAdmin && !isBotAdmins) return client.reply(m.chat,'⚠️ Este comando requiere que el bot sea admin',m);

  try {
    await client.readMessages([m.key]);
    users.stats[today].cmds++;
    user.exp = (user.exp||0) + Math.floor(Math.random()*100);
    user.name = m.pushName;

    // Ejecutar banner/canal/ícono si existe
    if (cmdData.runBanner) {
      try {
        await cmdData.runBanner(client, m, args, usedPrefix, command, text, { groupMetadata, settings });
      } catch(e){ console.error('Error en banner/canal:', e); }
    }

    // Ejecutar comando principal
    await cmdData.run(client, m, args, usedPrefix, command, text);
  } catch(error) {
    await client.sendMessage(m.chat,{ text:`《✧》 Error al ejecutar el comando\n${error}` },{ quoted:m });
  }

  level(m);
};
