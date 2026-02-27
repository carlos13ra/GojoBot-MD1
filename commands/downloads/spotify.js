import axios from 'axios'
import cheerio from 'cheerio'

export default {
  command: ['spotify', 'splay', 'spdl'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    const text = args.join(' ').trim()

    if (!text)
      return m.reply('\`✿\`︎ Escribe el *nombre* de una *canción o artista.*')

    try {
 
      const res = await axios.get(
        `${api.url}/search/spotify?q=${encodeURIComponent(text)}&limit=1`
      )

      const data = res.data
      if (!data?.status || !data.results?.length)
        return m.reply('《✧》 No se encontraron resultados.')

      const track = data.results[0]

      await client.sendMessage(
        m.chat,
        {
          text: `*➩ Descargando ›* ${track.title}
 
*◌ Artista:* ${track.artist}
*◌ Autor:* ${track.autor}
*◌ Álbum:* ${track.album}
*◌ Tipo:* ${track.tipo}
*◌ Album:* ${track.tipo_album}
*◌ Duración:* ${track.duration}
*◌ Popularidad:* ${track.popularidad}
*◌ Publicado:* ${track.publicado}
*◌ Link:* ${track.spotify_url}`,
          contextInfo: {
            externalAdReply: {
              title: '⑅᳔  ׅ 🥦 ׄ sᴘᴏᴛɪғʏ  ᴍᴜsɪᴄ ׅ   ׄ ⚟',
              body: 'Spotify Downloader',
              thumbnailUrl: track.thumbnail,
              sourceUrl: track.spotify_url,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: m }
      )

      const scraped = await spotifyDl(track.spotify_url)

      if (!scraped?.downloadLink)
        return m.reply('《✧》 No se pudo obtener el audio.')
        
      await client.sendMessage(
        m.chat,
        {
          audio: { url: scraped.downloadLink },
          mimetype: 'audio/mpeg',
          fileName: `${scraped.title}.mp3`
        },
        { quoted: m }
      )

    } catch (e) {
      return m.reply(
        `> Error ejecutando *${usedPrefix + command}*\n> [ ${e.message} ]`
      )
    }
  }
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'

let _cookie = null
let _token = null
let _sessionTime = 0

async function visit() {
  const res = await axios.get('https://spotmate.online/', {
    headers: { 'User-Agent': UA }
  })

  const setCookie = res.headers['set-cookie']
  if (setCookie) {
    _cookie = setCookie.map(c => c.split(';')[0]).join('; ')
  }

  const $ = cheerio.load(res.data)
  _token = $('meta[name="csrf-token"]').attr('content') || ''
  _sessionTime = Date.now()
}

async function session() {
  if (!_cookie || !_token || (Date.now() - _sessionTime) > 600000) {
    await visit()
  }
}

async function spotifyDl(url) {
  if (!url) throw new Error('URL requerida')

  await session()

  const infoRes = await axios.post(
    'https://spotmate.online/getTrackData',
    { spotify_url: url },
    { headers: headers() }
  )

  const convertRes = await axios.post(
    'https://spotmate.online/convert',
    { urls: url },
    { headers: headers() }
  )

  const info = infoRes.data
  const converted = convertRes.data

  if (!info?.id) throw new Error('Info inválida')
  if (!converted?.download_url && !converted?.url)
    throw new Error('Download no encontrado')

  return {
    title: info.name || 'audio',
    downloadLink: converted.download_url || converted.url
  }
}

function headers() {
  return {
    'content-type': 'application/json',
    'cookie': _cookie || '',
    'origin': 'https://spotmate.online',
    'referer': 'https://spotmate.online/',
    'x-csrf-token': _token || '',
    'user-agent': UA
  }
}