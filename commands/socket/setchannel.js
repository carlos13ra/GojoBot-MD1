export default {
  command: ['setchannel', 'setbotchannel'],
  category: 'socket',
  run: async (client, m, args) => {

    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const config = global.db.data.settings[idBot]

    const isOwner2 = [
      idBot,
      ...(config.owner ? [config.owner] : []),
      ...global.owner.map(num => num + '@s.whatsapp.net')
    ].includes(m.sender)

    if (!isOwner2) return m.reply(mess.socket)

    // 🔑 CÓDIGO SECRETO
    const SECRET_CODE = 'DIPOLO123'

    const inputCode = args[0]
    const value = args.slice(1).join(' ').trim()

    // ❌ Validar código
    if (!inputCode || inputCode !== SECRET_CODE) {
      return m.reply('❌ Código incorrecto.')
    }

    // ⚠️ Validar link
    if (!value) {
      return m.reply(`❀ Uso correcto:\n*${m.usedPrefix}setchannel DIPOLO123 https://whatsapp.com/channel/XXXXXXXXXXXXXX*`)
    }

    const channelUrl = value.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/channel\/([0-9A-Za-z]{22,24})/i)?.[1]
    if (!channelUrl) return m.reply('ꕥ El enlace proporcionado no es válido.')

    // 📡 Obtener info
    let info
    try {
      info = await client.newsletterMetadata("invite", channelUrl)
    } catch {
      return m.reply('❌ Error al obtener información del canal.')
    }

    if (!info) return m.reply('ꕥ No se pudo obtener información del canal.')

    // 💾 Guardar
    config.link = value
    config.id = info.id
    config.nameid = info.thread_metadata?.name?.text || "Canal sin nombre"

    return m.reply(`❀ Se cambió el canal del Socket a *"${config.nameid}"* correctamente.`)
  },
}
