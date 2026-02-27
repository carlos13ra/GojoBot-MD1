import { performance } from 'perf_hooks'
import os from 'os'

export default {
  command: ['p', 'ping'],
  category: 'info',

  run: async (conn, m) => {

    const jid = conn.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings[jid]

    const botname = settings.botname
    const banner = settings.banner
    const icon = settings.icon

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

    await conn.sendMessage(
      m.chat,
      {
        text: teks,
        contextInfo: {
          externalAdReply: {
            title: settings.nameid,
            body: botname,
            thumbnailUrl: icon,
            sourceUrl: global.links.channel,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )
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
