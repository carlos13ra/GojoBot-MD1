import { gotScraping } from 'got-scraping'
import { writeFileSync, unlinkSync, statSync, readFileSync, mkdirSync, existsSync } from 'fs'
import { createHash } from 'crypto'
import { basename, join } from 'path'

const COOKIE_API = 'https://mfcookies.ryzecodes.xyz/cookies'
const BASE = 'https://www.mediafire.com'

const H = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
  'Referer': 'https://app.mediafire.com/',
  'Accept': 'application/json',
}

let CK = ''
async function getCookies() {
  const r = await gotScraping({ url: COOKIE_API, responseType: 'json' })
  const mf = r.body.filter(c => (c.domain || '').includes('mediafire.com'))
  CK = mf.map(c => `${c.name}=${c.value}`).join('; ')
}

async function getToken() {
  const r = await gotScraping({
    url: `${BASE}/application/get_session_token.php`,
    method: 'POST',
    headers: { ...H, Cookie: CK },
    responseType: 'json'
  })
  return r.body?.response?.session_token
}

function multipart(fields) {
  const b = '----WKB' + Math.random().toString(36).slice(2)
  const body = Object.entries(fields)
    .map(([k, v]) => `--${b}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}`)
    .join('\r\n') + `\r\n--${b}--\r\n`
  return { body, ct: `multipart/form-data; boundary=${b}` }
}

async function uploadToMediaFire(filePath, folder = 'myfiles') {
  const name = basename(filePath)
  const data = readFileSync(filePath)
  const size = statSync(filePath).size
  const hash = createHash('sha256').update(data).digest('hex')

  await getCookies()
  const st = await getToken()
  if (!st) throw 'No session token'

  const m1 = multipart({
    type: 'upload',
    lifespan: '1440',
    response_format: 'json',
    session_token: st
  })

  const r1 = await gotScraping({
    url: `${BASE}/api/1.5/user/get_action_token.php`,
    method: 'POST',
    headers: { ...H, Cookie: CK, 'Content-Type': m1.ct },
    body: m1.body,
    responseType: 'json'
  })

  if (!r1.body?.response?.action_token) throw 'No action token'

  const m2 = multipart({
    uploads: JSON.stringify([{
      filename: name,
      folder_key: folder,
      size,
      hash,
      resumable: 'yes',
      preemptive: 'yes'
    }]),
    response_format: 'json',
    session_token: st
  })

  const r2 = await gotScraping({
    url: `${BASE}/api/1.5/upload/check.php`,
    method: 'POST',
    headers: { ...H, Cookie: CK, 'Content-Type': m2.ct },
    body: m2.body,
    responseType: 'json'
  })

  const ul = r2.body.response?.resumable_upload?.upload_url ||
    `https://ul.mediafireuserupload.com/api/upload/resumable.php?${new URLSearchParams({
      response_format: 'json',
      session_token: st,
      action_on_duplicate: 'keep',
      folder_key: folder,
      source: '54'
    })}`

  const r3 = await gotScraping({
    url: ul,
    method: 'POST',
    headers: {
      ...H,
      Cookie: CK,
      'Content-Type': 'application/octet-stream',
      'x-filename': encodeURIComponent(name),
      'x-filesize': String(size),
      'x-filehash': hash
    },
    body: data,
    responseType: 'json',
    timeout: { request: 300000 }
  })

  const key = r3.body?.response?.doupload?.key
  if (!key) throw 'Upload falló'

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 3000))

    const m3 = multipart({
      key,
      response_format: 'json',
      session_token: st
    })

    const r4 = await gotScraping({
      url: `${BASE}/api/1.5/upload/poll_upload.php`,
      method: 'POST',
      headers: { ...H, Cookie: CK, 'Content-Type': m3.ct },
      body: m3.body,
      responseType: 'json'
    })

    const s = parseInt(r4.body?.response?.doupload?.status || 0)
    if (s >= 99) {
      const qk = r4.body.response.doupload.quickkey
      return `https://www.mediafire.com/file/${qk}/${encodeURIComponent(name)}/file`
    }
  }

  throw 'Timeout al subir'
}

export default {
  command: ['uploadmf'],
  category: 'tools',
  run: async (client, m) => {
    try {
      const q = m.quoted || m
      const mime = q.mimetype || q.msg?.mimetype || ''
      if (!mime) return m.reply('🌾 Responde a un archivo para subir a mediafire.')
      await m.react('🕒')
      const buffer = await q.download()
      if (!buffer) throw 'No se pudo descargar'

      const tmpDir = './tmp'
      if (!existsSync(tmpDir)) mkdirSync(tmpDir)

      const filePath = join(tmpDir, `${Date.now()}`)
      writeFileSync(filePath, buffer)

      const link = await uploadToMediaFire(filePath)

      unlinkSync(filePath)

      await m.reply(`🌾 Subido correctamente :\n${link}`)
      await m.react('✔️')

    } catch (e) {
      console.error(e)
      m.reply(`Error:\n${e}`)
    }
  }
}