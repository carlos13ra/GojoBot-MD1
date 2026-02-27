import fetch from 'node-fetch'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import { proto } from '@whiskeysockets/baileys'

const CONFIGS = [
  {
    token: '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',
    user: 'AkiraDevX',
    repo: 'uploads'
  },
  {
    token: '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',
    user: 'Dev-lxyz',
    repo: 'upload'
  }
]

let currentIndex = 0
function getConfig() {
  const config = CONFIGS[currentIndex]
  currentIndex = (currentIndex + 1) % CONFIGS.length
  return config
}

function formatSize(bytes) {
  if (!bytes || isNaN(bytes)) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function toMp3(input) {
  return new Promise((resolve, reject) => {
    const output = input.replace(/\.\w+$/, '.mp3')
    ffmpeg(input)
      .audioBitrate(128)
      .toFormat('mp3')
      .save(output)
      .on('end', () => resolve(output))
      .on('error', reject)
  })
}

function shortId() {
  return Math.random().toString(36).substring(2, 7)
}

export default {
  command: ['upload', 'subir', 'url'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      await m.react('🕒')
      const q = m.quoted || m
      const mime =
        q.mimetype ||
        q.msg?.mimetype ||
        q.message?.imageMessage?.mimetype ||
        q.message?.videoMessage?.mimetype ||
        q.message?.audioMessage?.mimetype ||
        q.message?.documentMessage?.mimetype ||
        ''

      if (!mime)
        return m.reply('🪴 *Responde a cualquier archivo para subirlo a GitHub.*')

      let media
      try {
        media = await q.download()
      } catch (err) {
        console.error('Error descargando archivo:', err)
        return m.reply('❌ No se pudo descargar el archivo.')
      }
      if (!media || !media.length) return m.reply('❌ Archivo vacío.')

      const type = mime.split('/')[0]
      const ext = mime.split('/')[1] || 'bin'

      const id = shortId()
      const filename = `${id}`
      const tempInput = `./tmp_${filename}.${ext}`
      fs.writeFileSync(tempInput, media)

      let uploadFile = tempInput
      let uploadExt = ext

      if (type === 'audio') {
        try {
          uploadFile = await toMp3(tempInput)
          uploadExt = 'mp3'
          fs.unlinkSync(tempInput)
        } catch (err) {
          console.error('Error convirtiendo a mp3:', err)
          uploadFile = tempInput // fallback
          uploadExt = ext
        }
      }

      const base64 = fs.readFileSync(uploadFile, { encoding: 'base64' })
      const pathGit = `uploads/${filename}.${uploadExt}`
      const { token, user, repo } = getConfig()
      const apiURL = `https://api.github.com/repos/${user}/${repo}/contents/${pathGit}`

      const res = await fetch(apiURL, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Upload (Shadow Bot)',
          content: base64
        })
      })

      const json = await res.json()
      fs.unlinkSync(uploadFile)

      if (!json.content) {
        console.error('GitHub Response:', json)
        throw 'Error al subir a GitHub'
      }

      const url = json.content.download_url

      let preview
      if (type === 'image') {
        preview = { imageMessage: { mimetype: mime, jpegThumbnail: media } }
      } else if (type === 'video') {
        preview = { videoMessage: { mimetype: mime, jpegThumbnail: media } }
      }

      const info = `
🍄 Tipo       : › ${mime}
🌳 Nombre  : › ${filename}.${uploadExt}
🌱 Tamaño  : › ${formatSize(media.length)}

🍙 Link  : › \`\`\`${url}\`\`\``

      await client.sendMessage(
        m.chat,
        {
          text: info,
          title: "*'ׄ𐚁ִㅤU P L O A D - GITHUBׄ ₍ ᐢ..ᐢ ₎'*",
          footer: dev,
          interactiveButtons: [
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify({
                display_text: 'Copy link',
                copy_code: url
              })
            },
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: 'Abrir',
                url: url
              })
            }
          ],
          header: {
            hasMediaAttachment: !!preview,
            ...(type === 'image'
              ? { imageMessage: preview?.imageMessage }
              : type === 'video'
              ? { videoMessage: preview?.videoMessage }
              : {})
          }
        },
        { quoted: m }
      )
      await m.react('✔️')
    } catch (e) {
      console.error(e)
      await m.reply(`Error:\n${e}`)
    }
  }
}
