import axios from 'axios'
import fs from 'fs'
import path from 'path'

export default {
  command: ['ge'],
  category: 'tools',
  run: async (client, m, args) => {

    const url = args[0]

    if (!url) {
      return m.reply(
        '⚠️ Ingresa un link directo.\n\nEjemplo:\n.get https://example.com/video.mp4'
      )
    }

    if (!/^https?:\/\/.+/i.test(url)) {
      return m.reply('❌ Link inválido.')
    }

    try {
      await m.react('⏳')

      const tmpName = `${Date.now()}`
      const tmpPath = path.join('/tmp', tmpName)

      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Referer': url
        }
      })

      const contentType = response.headers['content-type'] || ''

      let ext = 'mp4'

      if (contentType.includes('audio')) ext = 'mp3'
      if (contentType.includes('video')) ext = 'mp4'

      // Si no detecta tipo pero es vidpig
      if (url.includes('vidpig')) ext = 'mp4'

      const filePath = `${tmpPath}.${ext}`

      const writer = fs.createWriteStream(filePath)
      response.data.pipe(writer)

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })

      await client.sendMessage(
        m.chat,
        {
          document: fs.readFileSync(filePath),
          mimetype: contentType || 'video/mp4',
          fileName: `file.${ext}`
        },
        { quoted: m }
      )

      fs.unlinkSync(filePath)

      await m.react('✔️')

    } catch (err) {
      console.error(err)
      m.reply('❌ Error descargando el archivo.\nPuede que el token haya expirado.')
    }
  }
}