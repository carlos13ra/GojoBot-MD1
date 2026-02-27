import fetch from 'node-fetch';

export default {
  command: ['tiktok', 'tt'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args.length) {
      return m.reply(`\`✿\`︎ Por favor, ingresa un término de búsqueda o *enlace* de *TikTok.*`)
    }

    const text = args.join(" ")
    const isUrl = /(?:https?:\/\/)?(?:www\.|vm\.|vt\.)?tiktok\.com\/[^\s]+/gi.test(text)

    try {

      if (isUrl) {

        const endpoint = `${api.url}/download/tiktok?url=${encodeURIComponent(text)}`
        const res = await fetch(endpoint)

        if (!res.ok) throw new Error(`El servidor respondió con ${res.status}`)

        const json = await res.json()

        if (!json.status || !json.data)
          return m.reply('《✧》 No se encontró contenido válido en TikTok.')

        const data = json.data

        const caption = `∩ ໌ ぃ    🅣︎ikTok  ৴  𓈒   🅓︎꯭o꯭w꯭n꯭lo꯭ad   !    ㌍

ׄ⬭ *Titulo : ›* ${data.title || 'Sin título'}
ׄ⬭ *Autor : ›* ${data.author}
ׄ⬭ *Duracion : ›* ${data.duration || '--'}
ׄ⬭ *Likes : ›* ${(data.likes || '0').toString()}
ׄ⬭ *Comentarios : ›* ${(data.comentarios || '0').toString()}
ׄ⬭ *Vistas : ›* ${(data.vistas || '0').toString()}
ׄ⬭ *Compartidos : ›* ${(data.compartidos || '0').toString()}
ׄ⬭ *Favoritos : ›* ${(data.favoritos || '0').toString()}
ׄ⬭ *Región : ›* ${data.region || '--'}
ׄ⬭ *Tamaño : ›* ${data.size_mb || '--'}
ׄ⬭ *Fecha : ›* ${data.date || '--'}`.trim()

        if (!data.download)
          return m.reply('《✧》 El video no está disponible para descarga.')

        await client.sendMessage(
          m.chat,
          {
            video: { url: data.download },
            caption
          },
          { quoted: m }
        )

      }

      else {

        const endpoint = `${api.url}/search/tiktok?q=${encodeURIComponent(text)}`
        const res = await fetch(endpoint)

        if (!res.ok) throw new Error(`El servidor respondió con ${res.status}`)

        const json = await res.json()

        if (!json.status || !json.data)
          return m.reply('《✧》 No se encontró contenido válido en TikTok.')

        const validResults = json.data.filter(v => v.download)

        if (!validResults.length) {
          return m.reply('《✧》 No hay resultados disponibles.')
        }

        const medias = validResults.map(v => {

          const caption = `∩ ໌ ぃ    🅣︎ikTok  ৴  𓈒   🅢︎︎earch  !    ㌍

ׄ⬭ *Titulo : ›* ${v.title || 'Sin título'}
ׄ⬭ *Autor : ›* ${v.author || 'Desconocido'}
ׄ⬭ *Duración : ›* ${v.duration || '--'}
ׄ⬭ *Likes : ›* ${(v.likes || '0').toString()}
ׄ⬭ *Comentarios : ›* ${(v.comments || '0').toString()}
ׄ⬭ *Vistas : ›* ${(v.views || '0').toString()}
ׄ⬭ *Compartidos : ›* ${(v.shares || '0').toString()}
ׄ⬭ *Región : ›* ${v.region || '--'}
ׄ⬭ *Tamaño : ›* ${v.size_mb || '--'}
ׄ⬭ *Titulo : ›* ${v.date || '--'}`.trim()

          return {
            type: 'video',
            data: { url: v.download },
            caption
          }

        }).slice(0, 10)

        await client.sendAlbumMessage(m.chat, medias, { quoted: m })

      }

    } catch (e) {

      await m.reply(
        `> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`
      )

    }
  },
}