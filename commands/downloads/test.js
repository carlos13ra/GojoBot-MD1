import axios from 'axios'
import { getBuffer } from '../../lib/message.js'

export default {
  command: ['play1'],
  category: 'downloader',
  run: async (client, m, args) => {
    try {
      if (!args || !args[0]) {
        return m.reply('🌱 Ingrese el *título* de un *vídeo*.')
      }

      await m.reply('🫧 Buscando vídeos en YouTube...')

      const query = args.join(' ')
      const { data } = await axios.get('https://www.youtube.com/results', {
        params: { search_query: query },
        headers: {
          'User-Agent':
            'Mozilla/5.0'
        },
        timeout: 15000
      })

      const match = data.match(/var ytInitialData = (.*?);<\/script>/s)
      if (!match) throw new Error('No se pudo obtener data')

      const json = JSON.parse(match[1])
      const contents =
        json.contents?.twoColumnSearchResultsRenderer?.primaryContents
          ?.sectionListRenderer?.contents

      const section = contents?.find(v => v.itemSectionRenderer)
        ?.itemSectionRenderer?.contents

      if (!section) return m.reply('Sin resultados.')

      const videos = section
        .filter(v => v.videoRenderer)
        .map(v => {
          const r = v.videoRenderer
          return {
            title: r.title?.runs?.[0]?.text || '',
            channel: r.ownerText?.runs?.[0]?.text || 'Desconocido',
            url: 'https://youtu.be/' + r.videoId,
            duration: r.lengthText?.simpleText || '0:00',
            views: r.viewCountText?.simpleText || '0',
            uploaded: r.publishedTimeText?.simpleText || 'Desconocido',
            thumbnail: r.thumbnail?.thumbnails?.slice(-1)[0]?.url || ''
          }
        })

      if (!videos.length) return m.reply('Sin resultados.')

      const firstVideo = videos[0]
      const thumbBuffer = await getBuffer(firstVideo.thumbnail)

      const teks = `*🌿 Título:* ${firstVideo.title}
*🌱 Canal:* ${firstVideo.channel}
*🍄 Duración:* ${firstVideo.duration}
*🌾 Vistas:* ${firstVideo.views}
*🥦 Publicado:* ${firstVideo.uploaded}`

      await client.sendMessage(
        m.chat,
        {
          image: thumbBuffer,
          caption: teks,
          footer: 'YouTube Downloader',
          interactiveButtons: [
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "⬇️ Download Audio",
                id: `.ytmp3 ${firstVideo.url}`
              })
            },
            {
              name: "quick_reply",
              buttonParamsJson: JSON.stringify({
                display_text: "⬇️ Download Video",
                id: `.ytmp4 ${firstVideo.url}`
              })
            }
          ]
        },
        { quoted: m }
      )

    } catch (e) {
      console.error(e)
      m.reply('Error: ' + e.message)
    }
  }
}