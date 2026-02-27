import { performance } from 'perf_hooks'
import os from 'os'
import { execSync } from 'child_process'

const formatTime = s => {
  s = Math.floor(s)
  const d = Math.floor(s / 86400)
  s %= 86400
  const h = Math.floor(s / 3600)
  s %= 3600
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${d ? d + 'd ' : ''}${h ? h + 'h ' : ''}${m ? m + 'm ' : ''}${sec}s`.trim()
}

function getNetworkStats() {
  let rx = 0, tx = 0
  try {
    const data = execSync('cat /proc/net/dev').toString().split('\n')
    for (const l of data) {
      if (l.includes(':') && !l.includes('lo:')) {
        const p = l.trim().split(/\s+/)
        rx += Number(p[1]) || 0
        tx += Number(p[9]) || 0
      }
    }
  } catch {}
  return { rx, tx }
}

export default {
  command: ['ping', 'p'],
  category: 'info',

  run: async (conn, m) => {
    const start = performance.now()

    const ping = (performance.now() - start).toFixed(2)

    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const ramUso = ((totalMem - freeMem) / 1024 / 1024).toFixed(0)
    const ramTotal = (totalMem / 1024 / 1024).toFixed(0)

    const cpuLoad = Math.min(
      100,
      (os.loadavg()[0] * 100) / os.cpus().length
    ).toFixed(1)

    let diskTotal = 0, diskUsed = 0
    try {
      const df = execSync('df -k /').toString().split('\n')[1].trim().split(/\s+/)
      diskTotal = (df[0] * 1024 / 1024 / 1024).toFixed(1)
      diskUsed = (df[1] * 1024 / 1024 / 1024).toFixed(1)
    } catch {}

    const net = getNetworkStats()

    const uptimeBot = formatTime(process.uptime())

    const teks = `╭─❍ *S T A T U S - P I N G*
│
│ 🍄 *Bot*       : ${botname}
│ 🌳 *Latency*   : ${ping} ms
│ 🌱 *Uptime*    : ${uptimeBot}
│
│ 🪷 *Sistema*   : ${os.platform()} (${os.arch()})
│ 🍙 *NodeJS*    : ${process.version}
│
│ 🌿 *RAM*       : ${ramUso} / ${ramTotal} MB
│ 🌲 *CPU*       : ${cpuLoad}%
│ 💾 *Disco*     : ${diskUsed} / ${diskTotal} GB
│
│ 📡 *Network RX*: ${(net.rx / 1024 / 1024).toFixed(2)} MB
│ 📡 *Network TX*: ${(net.tx / 1024 / 1024).toFixed(2)} MB
╰───────────────❍`

    // ✅ RESPUESTA CON CANAL
    await conn.reply(m.chat, teks, m, rcanal)
  }
}
