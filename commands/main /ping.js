import { performance } from 'perf_hooks'
import os from 'os'

export default {
  command: ['p', 'ping'],
  category: 'info',

  run: async (conn, m) => {
    try {
      const start = performance.now()

      // 🔹 CONFIG GLOBAL SEGURA
      const botname = global.db?.data?.botname || global.botname || '𖹭  ׄ  ְ 🌱 𝐆𝐨𝐣𝐨𝐁𝐨𝐭-𝐌𝐃 ✩'
      const rcanal = global.db?.data?.rcanal || global.rcanal || {}

      // 🔹 MEDICIONES
      await new Promise(r => setTimeout(r, 10))
      const latensi = performance.now() - start

      const totalMem = os.totalmem() / 1024 / 1024
      const freeMem = os.freemem() / 1024 / 1024
      const ramUso = (totalMem - freeMem).toFixed(0)
      const ramTotal = totalMem.toFixed(0)

      const uptime = process.uptime()

      // 🔹 TEXTO ESTILO BONITO + CANAL
      const teks = `╭━〔 ✦ 𝐒𝐓𝐀𝐓𝐔𝐒 - 𝐏𝐈𝐍𝐆 ✦ 〕━⬣
┃ 🍄 𝐁𝐨𝐭 : ${botname}
┃ 🌳 𝐋𝐚𝐭𝐞𝐧𝐜𝐢𝐚 : ${latensi.toFixed(2)} ms
┃ 🌱 𝐔𝐩𝐭𝐢𝐦𝐞 : ${formatTime(uptime)}
┃ 🪷 𝐒𝐢𝐬𝐭𝐞𝐦𝐚 : ${os.platform()} (${os.arch()})
┃ 🍙 𝐍𝐨𝐝𝐞 : ${process.version}
┃ 🌿 𝐑𝐀𝐌 : ${ramUso} MB / ${ramTotal} MB
╰━━━━━━━━━━━━━━━━⬣`

      await conn.reply(m.chat, teks, m, rcanal)

    } catch (e) {
      console.error(e)
      await conn.reply(m.chat, '❌ Error en el comando ping', m)
    }
  }
}

// 🔹 FORMATO TIEMPO PRO
function formatTime(seconds) {
  seconds = Number(seconds)

  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  return [
    d ? `${d}d` : '',
    h ? `${h}h` : '',
    m ? `${m}m` : '',
    s ? `${s}s` : ''
  ].filter(Boolean).join(' ')
}
