import axios from 'axios'

export default {
  command: ['ytdl', 'ytvideo'],
  category: 'download',

  run: async (client, m, args, usedPrefix, command) => {

    if (!args[0]) 
      return m.reply(`✧ Uso:\n${usedPrefix + command} <url youtube>`)

    try {

      await m.reply('⏳ Descargando...')
      const { data } = await axios.get(
        `https://nexus-light-beryl.vercel.app/download/ytvideo?url=${encodeURIComponent(args[0])}`,
        { timeout: 20000 }
      )

      if (!data.status) 
        throw new Error('API Error')

      const { title, download, quality } = data.result

      try {

        await client.sendMessage(m.chat, {
          video: { url: download },
          caption: `🎬 ${title}\n📺 Calidad: ${quality}`
        }, { quoted: m })

      } catch {
        await client.sendMessage(m.chat, {
          document: { url: download },
          mimetype: 'video/mp4',
          fileName: `${title.replace(/[\\/:*?"<>|]/g, '')}.mp4`
        }, { quoted: m })
      }

    } catch (err) {

      console.error(err)
      m.reply('❌ Error al descargar el video')

    }
  }
}