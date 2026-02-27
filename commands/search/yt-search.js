import axios from 'axios'
import { getBuffer } from '../../lib/message.js'

export default {
  command: ['yts', 'ytsearch', 'search'],
  category: 'search',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply('🌱 Ingresa el *nombre del video* a buscar.')
      }

      const query = args.join(' ')
      await m.reply('🫧 Buscando en YouTube...')

      const { data } = await axios.get(
        `${api.url}/search/yts`,
        {
          params: { q: query },
          timeout: 15000
        }
      )

      if (!data.status || !data.result?.length) {
        return m.reply('❌ Sin resultados.')
      }
      
      const results = data.result.slice(0, 15)
      const first = results[0]

      const thumb = await getBuffer(first.thumbnail)

      let teks = results.map((v, i) => {
        return `*${i + 1}. ${v.title}*
> 🥦 Duración: ${v.duration}
> 🌱 Vistas: ${v.views}
> 🌿 Subido: ${v.uploaded}
> 🌾 link: ${v.url}`
      }).join('\n\n╾۪〬─ ┄۫╌ ׄ┄┈۪ ─〬 ׅ┄╌ ۫┈ ─ׄ─۪〬 ┈ ┄۫╌ ┈┄۪ ─ׄ〬╼\n\n')

      await client.sendMessage(
        m.chat,
        {
          image: thumb,
          caption: teks
        },
        { quoted: m }
      )

    } catch (e) {
      console.error(e)
      m.reply('⚠️ Error al buscar videos:\n' + e.message)
    }
  }
}