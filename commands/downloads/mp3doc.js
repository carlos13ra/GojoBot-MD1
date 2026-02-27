import fetch from 'node-fetch'

export default {
  command: ['ytmp3doc', 'mp3doc'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0] || !/youtu\.?be/.test(args[0])) {
      return m.reply('《✧》 Ingrese un enlace válido de YouTube.')
    }

    try {
      const url = args[0]
      const res = await fetch(
        `https://nexus-light-beryl.vercel.app/download/ytaudio?url=${encodeURIComponent(url)}`
      )
      const json = await res.json()

      if (!json.status) {
        return m.reply('《✧》 Error al procesar el enlace.')
      }

      const data = json.result

      const caption = 
`*YTMP3 - DOCUMENT*

» Título   : ${data.title}
» Duración : ${Math.floor(data.duration / 60)}:${Math.floor(data.duration % 60).toString().padStart(2, '0')} min
» Tamaño   : ${(data.filesize / (1024 * 1024)).toFixed(2)} MB
» Tipo     : ${data.type}

> Enviando audio...`

      if (data.thumbnail) {
        await client.sendMessage(
          m.chat,
          { image: { url: data.thumbnail }, caption },
          { quoted: m }
        )
      } else {
        await m.reply(caption)
      }

      await client.sendMessage(
        m.chat,
        {
          document: { url: data.download },
          mimetype: 'audio/mpeg',
          fileName: `${data.title.replace(/[\\/:*?"<>|]/g, '')}.mp3`
        },
        { quoted: m }
      )

    } catch (e) {
      await m.reply(
`Error en ${usedPrefix + command}
${e.message}`
      )
    }
  }
}