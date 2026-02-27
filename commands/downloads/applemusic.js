import fetch from 'node-fetch'

export default {
  command: ['applemusic', 'apple'],
  category: 'search',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      if (!text)
        return m.reply(`\`✿\`︎ *Uso correcto:*\n> *» ${usedPrefix + command}* This side of Paradise`)
        
      const res = await fetch(`${api.url}/search/applemusic?q=${encodeURIComponent(text)}&limit=1`)
      const json = await res.json()

      if (!json.status || !json.results?.length)
        throw 'No se encontraron resultados.'

      const data = json.results[0]
      const info = `*◌ Título :* ${data.title}
*◌ Artista :* ${data.artist}
*◌ Álbum :* ${data.album}
*◌ Género :* ${data.genre}
*◌ Duración :* ${data.duration}
*◌ Lanzamiento :* ${data.release_date}
*◌ Precio :* ${data.price} ${data.currency}
*◌ Explícito :* ${data.explicit ? 'Sí' : 'No'}
*◌ País :* ${data.country}
*◌ Link :* ${data.link}`

      await client.sendContextInfoIndex(m.chat, info, {}, m, true, null, {
        banner: data.cover,
        title: '𖹭  ׄ  ְ 🍓 𝐀𝐩𝐩𝐥𝐞𝐦𝐮𝐬𝐢𝐜 - 𝐃𝐋 ✩',
        body: '✰ ᴅᴏᴡɴʟᴏᴀᴅs ғʀᴏᴍ ᴀᴘᴘʟᴇᴍᴜsɪᴄ 🪷',
        redes: data.link
      })

   const dlRes = await fetch(`${api.url}/download/applemusic?url=${encodeURIComponent(data.link)}`)
   const dlJson = await dlRes.json()

   if (!dlJson.status || !dlJson.data?.dl_url)
     throw 'Error al obtener el audio.'

   const audio = dlJson.data.dl_url

   await client.sendMessage( m.chat, { audio: { url: audio }, mimetype: 'audio/mpeg', fileName: `${data.title}.mp3` }, { quoted: m })

   } catch (e) {
     console.error(e)
     m.reply(`🌳 Error:\n${e}`)
   }
 }
}