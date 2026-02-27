import { performance } from 'perf_hooks'
import os from 'os'
import fetch from 'node-fetch'

export default {
  command: ['p', 'ping'],
  category: 'info',

  run: async (conn, m) => {

    const jid = conn.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings[jid]

    const botname = settings.botname
    const banner = settings.banner

    const start = performance.now()

    let totalMem = (os.totalmem() / 1024 / 1024).toFixed(0)
    let freeMem = (os.freemem() / 1024 / 1024).toFixed(0)
    let ramUso = totalMem - freeMem
    let uptime = process.uptime()

    const latensi = (performance.now() - start).toFixed(3)

    let teks = `*'ׄ𐚁ִㅤS T A T U S - PINGׄ ₍ ᐢ..ᐢ ₎'*

*🍄 Bot      : ›* ${botname}
*🌳 Latency : ›* ${latensi} ms
*🌱 Uptime  : ›* ${formatTime(uptime)}
*🪷 Sistema  : ›* ${os.platform()} (${os.arch()}) 
*🍙 Node  : ›* ${process.version}
*🌿 Ram usage  : ›* ${ramUso} MB / ${totalMem} MB`

    // 🔥 Convertir banner a buffer (PRO)
    let buffer = null
    try {
      const res = await fetch(banner)
      buffer = await res.buffer()
    } catch {
      buffer = null
    }

    const rcanal = {
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: settings.id,
          newsletterName: settings.nameid
        }
      }
    }

    // 🔥 Enviar con imagen si carga, sino solo texto
    if (buffer) {
      await conn.sendMessage(m.chat, {
        image: buffer,
        caption: teks,
        ...rcanal
      }, { quoted: m })
    } else {
      await conn.reply(m.chat, teks, m, rcanal)
    }
  }
}

function formatTime(seconds) {
  seconds = Number(seconds)
  let d = Math.floor(seconds / (3600 * 24))
  let h = Math.floor(seconds % (3600 * 24) / 3600)
  let m = Math.floor(seconds % 3600 / 60)
  let s = Math.floor(seconds % 60)

  return [
    d ? `${d}d` : '',
    h ? `${h}h` : '',
    m ? `${m}m` : '',
    s ? `${s}s` : ''
  ].filter(Boolean).join(' ')
}
