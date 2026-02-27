import axios from 'axios'

export default {
  command: ['pindl', 'pinterestdl'],
  category: 'download',

  run: async (client, m, args, usedPrefix, command) => {

    if (!args[0])
      return m.reply(`✧ Uso:\n${usedPrefix + command} <url pinterest>`)

    const url = args[0]

    const fetchPin = async () => {
      const api = `https://nexus-light-beryl.vercel.app/download/pindl?url=${encodeURIComponent(url)}`
      const { data } = await axios.get(api, { timeout: 20000 })
      if (!data.status) throw new Error('API Error')
      return data.data
    }

    try {

      await m.reply('⏳ Descargando desde Pinterest...')

      let result

      // 🔥 Intento + reintento automático
      try {
        result = await fetchPin()
      } catch {
        result = await fetchPin()
      }

      const { title, description, author, dl_url, type } = result

      const caption = `📌 *${title}*\n\n👤 ${author}\n📄 ${description}`

      // 🖼 IMAGEN
      if (type === 'image') {

        try {
          await client.sendMessage(m.chat, {
            image: { url: dl_url },
            caption
          }, { quoted: m })

        } catch {

          await client.sendMessage(m.chat, {
            document: { url: dl_url },
            mimetype: 'image/jpeg',
            fileName: `${title}.jpg`
          }, { quoted: m })
        }

      }

      // 🎥 VIDEO
      else if (type === 'video') {

        try {
          await client.sendMessage(m.chat, {
            video: { url: dl_url },
            caption
          }, { quoted: m })

        } catch {

          await client.sendMessage(m.chat, {
            document: { url: dl_url },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`
          }, { quoted: m })
        }

      }

      else {
        m.reply('⚠ Tipo de contenido no soportado')
      }

    } catch (err) {

      console.error(err)
      m.reply('❌ Error al descargar el contenido')

    }
  }
} 