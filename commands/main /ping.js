import { createCanvas, loadImage } from 'canvas'
import { performance } from 'perf_hooks'
import os from 'os'
import { execSync } from 'child_process'

const BANNER_URL =
  'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1770262621481_386847.jpeg'

const THEME = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#facc15',
  danger: '#ef4444',
  text: '#ffffff',
  subtext: '#cbd5f5',
  card: 'rgba(15, 23, 42, 0.75)'
}

const formatSize = b => {
  const u = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  while (b >= 1024 && ++i) b /= 1024
  return `${b.toFixed(2)} ${u[i]}`
}

const formatTime = s => {
  s = Math.floor(s)

  const days = Math.floor(s / 86400)
  s %= 86400
  const hours = Math.floor(s / 3600)
  s %= 3600
  const minutes = Math.floor(s / 60)
  const seconds = s % 60

  const d = days ? `${days}d ` : ''
  const h = hours ? `${hours}h ` : ''
  const m = minutes ? `${minutes}m ` : ''

  return `${d}${h}${m}${seconds}s`.trim()
}

function drawIcon(ctx, x, y, type, color) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2

  switch (type) {
    case 'cpu':
      ctx.strokeRect(x, y, 22, 22)
      ctx.fillRect(x + 6, y + 6, 10, 10)
      break
    case 'ram':
      ctx.strokeRect(x, y, 24, 14)
      ctx.fillRect(x + 4, y + 4, 16, 6)
      break
    case 'disk':
      ctx.beginPath()
      ctx.arc(x + 11, y + 11, 10, 0, Math.PI * 2)
      ctx.stroke()
      break
    case 'net':
      ctx.beginPath()
      ctx.moveTo(x, y + 10)
      ctx.lineTo(x + 22, y + 10)
      ctx.moveTo(x + 11, y)
      ctx.lineTo(x + 11, y + 22)
      ctx.stroke()
      break
  }
}

async function renderDashboard(stats) {
  const W = 1200
  const H = 700
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')

  const bg = await loadImage(BANNER_URL)
  ctx.drawImage(bg, 0, 0, W, H)

  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = THEME.text
  ctx.font = 'bold 38px Arial'
  ctx.fillText('SYSTEM DASHBOARD', 40, 60)

  ctx.fillStyle = THEME.success
  ctx.font = 'bold 28px Arial'
  ctx.textAlign = 'right'
  ctx.fillText(`${stats.ping} ms`, W - 40, 60)

  ctx.fillStyle = THEME.card
  ctx.roundRect(40, 100, W - 80, 520, 25)
  ctx.fill()

  ctx.textAlign = 'left'
  ctx.font = '20px Arial'
  ctx.fillStyle = THEME.text

  const items = [
    ['cpu', 'CPU Load', `${stats.cpuLoad}%`, THEME.primary],
    ['ram', 'RAM Usage', `${formatSize(stats.ramUsed)} / ${formatSize(stats.ramTotal)}`, THEME.success],
    ['disk', 'Disk Usage', `${formatSize(stats.diskUsed)} / ${formatSize(stats.diskTotal)}`, THEME.warning],
    ['net', 'Network RX', formatSize(stats.networkRx), THEME.primary],
    ['net', 'Network TX', formatSize(stats.networkTx), THEME.danger]
  ]

  let y = 160
  for (const [icon, label, value, color] of items) {
    drawIcon(ctx, 80, y - 18, icon, color)
    ctx.fillStyle = THEME.subtext
    ctx.fillText(label, 120, y)
    ctx.fillStyle = THEME.text
    ctx.font = 'bold 22px Arial'
    ctx.fillText(value, 420, y)
    ctx.font = '20px Arial'
    y += 70
  }

  ctx.fillStyle = THEME.subtext
  ctx.font = '16px Arial'
  ctx.fillText(`Bot Uptime: ${stats.uptimeBot}`, 80, y + 20)
  ctx.fillText(`Server Uptime: ${stats.uptimeServer}`, 80, y + 50)

  return canvas.toBuffer('image/png')
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
  command: ['p', 'ping'],
  category: 'info',

  run: async (conn, m) => {
    const wait = await conn.reply(m.chat, '🫧 Generando dashboard...', m)

    const start = performance.now()
    await new Promise(r => setTimeout(r, 15))
    const ping = (performance.now() - start).toFixed(2)

    const cpus = os.cpus()
    const totalMem = os.totalmem()
    const freeMem = os.freemem()

    const cpuLoad = Math.min(
      100,
      (os.loadavg()[0] * 100) / cpus.length
    ).toFixed(1)

    let diskTotal = 0, diskUsed = 0
    try {
      const df = execSync('df -k /').toString().split('\n')[1].trim().split(/\s+/)
      diskTotal = df[0] * 1024
      diskUsed = df[1] * 1024
    } catch {}

    const net = getNetworkStats()

    const uptimeBot = formatTime(process.uptime())
    const uptimeServer = formatTime(os.uptime())

    const img = await renderDashboard({
      ping,
      cpuLoad,
      ramTotal: totalMem,
      ramUsed: totalMem - freeMem,
      diskTotal,
      diskUsed,
      networkRx: net.rx,
      networkTx: net.tx,
      uptimeBot,
      uptimeServer
    })

    await conn.sendMessage(
      m.chat,
      {
        image: img,
        caption: `*'ׄ𐚁ִㅤS T A T U S - PINGׄ ₍ ᐢ..ᐢ ₎'*

*🍄 Bot      : ›* ${botname}
*🌳 Latency : ›* ${latensi.toFixed(3)} ms
*🌱 Uptime  : ›* ${formatTime(uptime)}
*🪷 Sistema  : ›* ${os.platform()} (${os.arch()}) 
*🍙 Node  : ›* ${process.version}
*🌿 Ram usage  : ›* ${ramUso} MB / ${ramTotal} MB`
      },
      { quoted: m }
    )

    await conn.sendMessage(m.chat, { delete: wait.key })
  }
}