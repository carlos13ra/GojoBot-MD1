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
  if (!m.message) return
  const sender = m.sender 
  let body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply?.selectedRowId || m.message.templateButtonReplyMessage?.selectedId || ''

  // ✅ Inicializamos la DB
  initDB(m, client)
  antilink(client, m)

  // ✅ Ejecutamos plugin.all
  for (const name in global.plugins) {
    const plugin = global.plugins[name]
    if (plugin && typeof plugin.all === "function") {
      try {
        await plugin.all.call(client, m, { client })
      } catch (err) {
        console.error(`Error en plugin.all -> ${name}`, err)
      }
    }
  }

  const from = m.key.remoteJid
  const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net'
  const chat = global.db.data.chats[m.chat] || {}
  const settings = global.db.data.settings[botJid] || {}  
  const user = global.db.data.users[sender] ||= {}
  const users = chat.users[sender] || {}
  const rawBotname = settings.namebot || 'GojoBot - MD'
  const tipo = settings.type || 'Sub'
  const isValidBotname = /^[\w\s]+$/.test(rawBotname)
  const namebot = isValidBotname ? rawBotname : 'GojoBot - MD'
  const shortForms = [namebot.charAt(0), namebot.split(" ")[0], tipo.split(" ")[0], namebot.split(" ")[0].slice(0, 2), namebot.split(" ")[0].slice(0, 3)]
  const prefixes = shortForms.map(name => `${name}`)
  prefixes.unshift(namebot)
  
  let prefix
  if (Array.isArray(settings.prefix) || typeof settings.prefix === 'string') {
    const prefixArray = Array.isArray(settings.prefix) ? settings.prefix : [settings.prefix]
    prefix = new RegExp('^(' + prefixes.join('|') + ')?(' + prefixArray.map(p => p.replace(/[|\\{}()[\]^$+*.\-\^]/g, '\\$&')).join('|') + ')', 'i')
  } else if (settings.prefix === true) {
    prefix = new RegExp('^', 'i')
  } else {
    prefix = new RegExp('^(' + prefixes.join('|') + ')?', 'i')
  }
  const strRegex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
  let pluginPrefix = client.prefix ? client.prefix : prefix
  let matchs = pluginPrefix instanceof RegExp ? [[pluginPrefix.exec(m.text), pluginPrefix]] : Array.isArray(pluginPrefix) ? pluginPrefix.map(p => {
    let regex = p instanceof RegExp ? p : new RegExp(strRegex(p))
    return [regex.exec(m.text), regex]
  }) : typeof pluginPrefix === 'string' ? [[new RegExp(strRegex(pluginPrefix)).exec(m.text), new RegExp(strRegex(pluginPrefix))]] : [[null, null]]
  let match = matchs.find(p => p[0])

  for (const name in global.plugins) {
    const plugin = global.plugins[name]
    if (!plugin) continue
    if (plugin.disabled) continue
    if (typeof plugin.before === "function") {
      try {
        if (await plugin.before.call(client, m, { client })) continue
      } catch (err) {
        console.error(`Error en plugin.all -> ${name}`, err)
      }
    }
  }

  if (!match) return
  let usedPrefix = (match[0] || [])[0] || ''
  let args = m.text.slice(usedPrefix.length).trim().split(" ")
  let command = (args.shift() || '').toLowerCase()
  let text = args.join(' ')

  const pushname = m.pushName || 'Sin nombre'
  let groupMetadata = null
  let groupAdmins = []
  let groupName = ''
  if (m.isGroup) {
    groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
    groupName = groupMetadata?.subject || ''
    groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
  }
  const isBotAdmins = m.isGroup ? groupAdmins.some(p => (p.phoneNumber === botJid || p.jid === botJid || p.id === botJid || p.lid === botJid )) : false
  const isAdmins = m.isGroup ? groupAdmins.some(p => (p.phoneNumber === sender || p.jid === sender || p.id === sender || p.lid === sender )) : false

  const chatData = global.db.data.chats[from]
  const consolePrimary = chatData.primaryBot
  if (!consolePrimary || consolePrimary === botJid) {
    const h = chalk.bold.blue('╭────────────────────────────···')
    const t = chalk.bold.blue('╰────────────────────────────···')
    const v = chalk.bold.blue('│')
    console.log(`\n${h}\n${chalk.bold.yellow(`${v} Fecha: ${chalk.whiteBright(moment().format('DD/MM/YY HH:mm:ss'))}`)}\n${chalk.bold.blueBright(`${v} Usuario: ${chalk.whiteBright(pushname)}`)}\n${chalk.bold.magentaBright(`${v} Remitente: ${gradient('deepskyblue', 'darkorchid')(sender)}`)}\n${m.isGroup ? chalk.bold.cyanBright(`${v} Grupo: ${chalk.greenBright(groupName)}\n${v} ID: ${gradient('violet', 'midnightblue')(from)}\n`) : chalk.bold.greenBright(`${v} Chat privado\n`)}${t}`)
  }

  const hasPrefix = settings.prefix === true ? true : (Array.isArray(settings.prefix) ? settings.prefix : typeof settings.prefix === 'string' ? [settings.prefix] : []).some(p => m.text?.startsWith(p))

  // 🔥 RANDOM GLOBAL PARA TODO EL BOT
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

  m.banner = Array.isArray(settings.banners) && settings.banners.length
    ? pickRandom(settings.banners)
    : null

  m.icon = Array.isArray(settings.icons) && settings.icons.length
    ? pickRandom(settings.icons)
    : null

  m.channel = Array.isArray(settings.channels) && settings.channels.length
    ? pickRandom(settings.channels)
    : null

  // 🔥 INTERCEPTAMOS m.reply PARA QUE TODO MENSAJE SALGA CON BANNER + CANAL
  const originalReply = m.reply.bind(m)

  m.reply = async (text, options = {}) => {
    try {
      if (!m.banner) return originalReply(text, options)

      let caption = `${text || ''}`
      if (m.channel) {
        caption += `\n\n📢 Canal:\n${m.channel.name}\nhttps://whatsapp.com/channel/${m.channel.id.replace('@newsletter','')}`
      }

      return await client.sendMessage(m.chat, {
        image: { url: m.banner },
        caption
      }, { quoted: m, ...options })

    } catch (e) {
      return originalReply(text, options)
    }
  }

  // Aquí sigue tu código normal de verificación de comandos
  if ((m.id.startsWith("3EB0") || (m.id.startsWith("BAE5") && m.id.length === 16) || (m.id.startsWith("B24E") && m.id.length === 20))) return  
  const isOwners = [botJid, ...(settings.owner ? [settings.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(sender)
  if (!isOwners && settings.self) return
  if (m.chat && !m.chat.endsWith('g.us')) {
    const allowedInPrivateForUsers = ['report', 'reporte', 'sug', 'suggest', 'invite', 'invitar', 'setname', 'setbotname', 'setbanner', 'setmenubanner', 'setusername', 'setpfp', 'setimage', 'setbotcurrency', 'setbotprefix', 'setstatus', 'setbotowner', 'reload', 'code', 'qr']
    if (!isOwners && !allowedInPrivateForUsers.includes(command)) return
  }
  if (chat?.isBanned && !(command === 'bot' && text === 'on') && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender)) {
    await m.reply(`ꕥ El bot *${settings.botname}* está desactivado en este grupo.\n\n> ✎ Un *administrador* puede activarlo con el comando:\n> » *${usedPrefix}bot on*`)
    return
  }

  const today = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-')
  const userrs = chatData.users[sender] || {}
  if (!userrs.stats) userrs.stats = {}
  if (!userrs.stats[today]) userrs.stats[today] = { msgs: 0, cmds: 0 }
  userrs.stats[today].msgs++

  if (chat.adminonly && !isAdmins) return
  if (!command) return
  const cmdData = global.comandos.get(command)
  if (!cmdData) {
    if (settings.prefix === true) return
    await client.readMessages([m.key])
    return m.reply(`ꕤ El comando *${command}* no existe.\n✎ Usa *${usedPrefix}help* para ver la lista de comandos disponibles.`)
  }

  const comando = m.text.slice(usedPrefix.length);
  if (cmdData.isOwner && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender)) {
    if (settings.prefix === true) return
    return m.reply(`ꕤ El comando *${command}* no existe.\n✎ Usa *${usedPrefix}help* para ver la lista de comandos disponibles.`)
  }
  if (cmdData.isAdmin && !isAdmins) return client.reply(m.chat, mess.admin, m)
  if (cmdData.botAdmin && !isBotAdmins) return client.reply(m.chat, mess.botAdmin, m)

  try {
    await client.readMessages([m.key])
    user.usedcommands = (user.usedcommands || 0) + 1
    settings.commandsejecut = (settings.commandsejecut || 0) + 1
    users.usedTime = new Date()
    users.lastCmd = Date.now()
    user.exp = (user.exp || 0) + Math.floor(Math.random() * 100)
    user.name = m.pushName
    users.stats[today].cmds++
    await cmdData.run(client, m, args, usedPrefix, command, text)
  } catch (error) {
    await client.sendMessage(m.chat, { text: `《✧》 Error al ejecutar el comando\n${error}` }, { quoted: m })
  }
  level(m)
    }
