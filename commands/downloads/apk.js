import axios from 'axios'

export default {
  command: ['apk', 'aptoide', 'apkdl'],
  category: 'download',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args || !args.length) {
      return m.reply('《✧》 Por favor, ingresa el nombre de la aplicación.')
    }
    const query = args.join(' ').trim()

    try {
      const { data } = await axios.get(
        `https://nexus-light-beryl.vercel.app/search/aptoide?q=${encodeURIComponent(query)}`,
        { timeout: 20000 }
      )

      if (!data.status || !data.data) {
        return m.reply('《✧》 No se encontraron resultados.')
      }
      const apkInfo = data.data
      const { name, package: pkg, developer, version, version_code, size, downloads, rating, rating_total, icon, graphic, lastUpdate, download_url } = apkInfo

      const caption =
`➩ *Nombre ›* ${name}

❖ *Paquete ›* ${pkg}
✿ *Última actualización ›* ${lastUpdate}
☆ *Tamaño ›* ${size}

> *ᴜᴘʟᴏᴀᴅɪɴɢ ᴀᴘᴋ ғɪʟᴇ...*`

      await client.sendMessage(m.chat, {
         image: { url: graphic || icon },
         caption },
      { quoted: m })

      await client.sendMessage(m.chat,{
         document: { url: download_url },
         mimetype: 'application/vnd.android.package-archive',
         fileName: `${name.replace(/[\\/:*?"<>|]/g, '')}.apk`},
      { quoted: m })

    } catch (e) {

      console.error(e)
      await m.reply(
`> Error en ${usedPrefix + command}
> ${e.message}`
      )

    }
  },
}