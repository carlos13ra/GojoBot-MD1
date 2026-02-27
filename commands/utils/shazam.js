import acrcloud from 'acrcloud'
import ytsearch from 'yt-search'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'

const acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
})

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

export default {
  command: ['whatmusic', 'shazam'],
  category: 'tools',
  run: async (client, m, { usedPrefix, command }) => {
    try {
      const q = m.quoted ? m.quoted : m
      const msg = q.msg ? q.msg : q
      const mime = msg.mimetype || ''

      const isMedia =
        /audio|video/.test(mime) ||
        m.message?.audioMessage ||
        m.message?.videoMessage ||
        m.message?.documentMessage

      if (!isMedia) {
        return m.reply(
`《✧》Etiqueta un audio o video corto con: *${usedPrefix + command}* para intentar reconocer la canción.`
        )
      }

      await m.react('🕓')

      const buffer = await q.download?.()
      if (!buffer) throw 'No se pudo descargar el archivo.'

      let audioBuffer = buffer

      if (/video/.test(mime) || m.message?.videoMessage) {
        const input = `./tmp_${Date.now()}.mp4`
        const output = `./tmp_${Date.now()}.mp3`

        fs.writeFileSync(input, buffer)

        await new Promise((resolve, reject) => {
          ffmpeg(input)
            .noVideo()
            .audioCodec('libmp3lame')
            .save(output)
            .on('end', resolve)
            .on('error', reject)
        })

        audioBuffer = fs.readFileSync(output)

        fs.unlinkSync(input)
        fs.unlinkSync(output)
      }

      const clipSize = formatSize(Buffer.byteLength(audioBuffer))

      const result = await acr.identify(audioBuffer)
      const { status, metadata } = result
      if (status.code !== 0) throw status.msg

      const music = metadata.music?.[0]
      if (!music) throw 'No se encontró información.'

      const title = music.title || 'Desconocido'
      const artist = music.artists?.map(v => v.name).join(', ') || 'Desconocido'
      const album = music.album?.name || 'Desconocido'
      const release = music.release_date || 'Desconocida'

      const genres = music.genres || []
      const genresText = Array.isArray(genres)
        ? genres.map(v => v.name).join(', ')
        : 'Desconocido'

      const yt = await ytsearch(`${title} ${artist}`)
      const video = yt.videos?.[0] || null

      const thumbnail = video?.thumbnail || 'https://i.imgur.com/4M34hi2.png'
      const url = video?.url || ''

      const caption = `*𖹭𖹭ׅ.ᴡ ʜ ᴀ ᴛ ʜ  ᴍ ᴜ s ɪ ᴄ ࣭ 🍃*

\`\`\`
🌱 TITULO :› ${title}
🥦 ARTIST :› ${artist}
🍃 ALBUM  :› ${album}
🍄 DATE   :› ${release}
🍙 GENRE  :› ${genresText}
🌳 TAMAÑO :› ${clipSize}\`\`\`

*﹙ׅ✿﹚ּ  YOUTUBE - INFO ❐*
\`\`\`
❐ Título   :› ${video?.title || 'Desconocido'}
❐ Duration :› ${video?.timestamp || 'Desconocida'}
❐ Vistas   :› ${video?.views?.toLocaleString() || '0'}
❐ Canal    :› ${video?.author?.name || 'Desconocido'}
❐ Enlace   :› ${url || 'No disponible'}\`\`\``.trim()

      await client.sendMessage(
        m.chat,
        {
          text: caption,
          contextInfo: {
            externalAdReply: {
              title: '⑅᳔  ׅ 🥦 ׄ Whatmusic - GojoBot - MD ׄ ⚟',
              body: '﹙ׅᰔ﹚ּ  Identificador musical.',
              thumbnailUrl: thumbnail,
              sourceUrl: global.db.data.settings[client.user.id.split(':')[0] + '@s.whatsapp.net'].link,
              mediaType: 1,
              renderLargerThumbnail: true
            }
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