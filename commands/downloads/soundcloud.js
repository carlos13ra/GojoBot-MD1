import fetch from 'node-fetch'

export default {
command: ['sound', 'soundcloud'],
category: 'search',
run: async (client, m, args, usedPrefix, command, text) => {
 try {
   if (!text)
     return m.reply(`\`✿\`︎ Escribe el nombre de una *canción o artista* de *soundcloud.*`)

   const searchRes = await fetch(`${api.url}/search/soundcloud?q=${encodeURIComponent(text)}`)
   const searchJson = await searchRes.json()

   if (!searchJson.status || !searchJson.results?.length)
     throw 'No se encontraron resultados.'

   const data = searchJson.results[0]
   const info = `*◌ Título :* ${data.title}
*◌ Artista :* ${data.artist}
*◌ Duración :* ${data.duration}
*◌ likes :* ${data.likes}
*◌ Reproducciones :* ${data.plays}
*◌ Comentarios :* ${data.comments}
*◌ Publicado :* ${data.created}
*◌ Link :* ${data.link}`

      await client.sendContextInfoIndex(m.chat, info, {}, m, true, null, {
        banner: data.image,
        title: '𖹭  ׄ  ְ 🥦 𝐒𝐨𝐮𝐧𝐝𝐂𝐥𝐨𝐮𝐝 - 𝐃𝐋 ✩',
        body: '✰ ᴅᴏᴡɴʟᴏᴀᴅs ғʀᴏᴍ sᴏᴜɴᴅᴄʟᴏᴜᴅ 🪷',
        redes: data.link
      })
      
   const downloadRes = await fetch(`${api.url}/download/soundcloud?url=${encodeURIComponent(data.link)}`)
   const downloadJson = await downloadRes.json()

   if (!downloadJson.status)
     throw 'Error al obtener el audio.'

   const audioUrl = downloadJson.result.download_url
      
   await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', fileName: `${downloadJson.result.title}.mp3` }, { quoted: m })

   } catch (e) {
     console.error(e)
     m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e}*]`)
   }
 }
}