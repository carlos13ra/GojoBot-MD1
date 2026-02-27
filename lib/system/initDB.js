let isNumber = (x) => typeof x === 'number' && !isNaN(x)

// 🔥 RANDOM
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

function initDB(m, client) {
  if (!m?.sender) return

  const jid = client?.user?.id?.split(':')[0] + '@s.whatsapp.net'
  if (!jid) return

  const settings = global.db.data.settings[jid] ||= {}

  settings.self ??= false
  settings.prefix ??= ['/', '!', '.', '#']
  settings.commandsejecut = isNumber(settings.commandsejecut) ? settings.commandsejecut : 0

  // 🔥 MULTI CANALES
  if (!Array.isArray(settings.channels)) {
    settings.channels = [
      {
        id: '120363421367237421@newsletter',
        name: '⋆｡ﾟ☁︎｡⋆ ɢᴏᴊᴏʙᴏᴛ❄️ | ᴄʜᴀɴɴᴇʟ ᴏғɪᴄɪᴀʟ ⋆｡ﾟ☁︎｡⋆'
      },
      {
        id: '120363405880253341@newsletter',
        name: '☃️ 𝑮𝒐𝒋𝒐𝑩𝒐𝒕 - 𝑴𝑫 | 𝑪𝒉𝒂𝒏𝒏𝒆𝒍 2'
      }
    ]
  }

  // 🔥 MULTI BANNERS
  if (!Array.isArray(settings.banners)) {
    settings.banners = [
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1770990983633_176241.jpeg',
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1770262621481_386847.jpeg'
    ]
  }

  // 🔥 MULTI ICONOS
  if (!Array.isArray(settings.icons)) {
    settings.icons = [
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1770989037458_297377.jpeg',
      'https://raw.githubusercontent.com/Dev-lxyz/upload/main/uploads/swahw.jpeg',
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/k6gy7.jpeg',
      'https://raw.githubusercontent.com/Dev-lxyz/upload/main/uploads/kid11.jpeg',
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/rf12r.jpeg',
      'https://raw.githubusercontent.com/Dev-lxyz/upload/main/uploads/bz6z7.jpeg',
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/uoxyc.jpeg',
      'https://raw.githubusercontent.com/Dev-lxyz/upload/main/uploads/41wub.jpeg',
      'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/2a7rx.jpeg',
      'https://raw.githubusercontent.com/Dev-lxyz/upload/main/uploads/yi0zw.jpeg'
    ]
  }

  // 🔥 DEFAULT
  settings.link ??= 'https://nexus-light-beryl.vercel.app'
  settings.currency ??= 'g᥆𝗍іᥴᥲs'
  settings.namebot ??= 'ׄ𖹭  ׄ  ְ 🌱 𝐆𝐨𝐣𝐨𝐁𝐨𝐭-𝐌𝐃 ✩'
  settings.botname ??= '𖹭  ׄ  ְ 🌱 𝐆𝐨𝐣𝐁𝐨𝐭-𝐌𝐃 ✩'
  settings.owner = settings.owner || m.sender

  // 🔥 AQUI ESTA LA MAGIA (SE ACTUALIZA SOLO)
  settings.bannerActual = pickRandom(settings.banners)
  settings.iconActual = pickRandom(settings.icons)
  settings.channelActual = pickRandom(settings.channels)

  const user = global.db.data.users[m.sender] ||= {}

  user.name ??= m.pushName
  user.exp = isNumber(user.exp) ? user.exp : 0
  user.level = isNumber(user.level) ? user.level : 0
  user.usedcommands = isNumber(user.usedcommands) ? user.usedcommands : 0
  user.pasatiempo ??= ''
  user.description ??= ''
  user.marry ??= ''
  user.genre ??= ''
  user.birth ??= ''
  user.metadatos ??= null
  user.metadatos2 ??= null

  const chat = global.db.data.chats[m.chat] ||= {}

  chat.users ||= {}
  chat.isBanned ??= false
  chat.welcome ??= false
  chat.goodbye ??= false
  chat.sWelcome ??= ''
  chat.sGoodbye ??= ''
  chat.nsfw ??= false
  chat.alerts ??= true
  chat.gacha ??= true
  chat.economy ??= true
  chat.adminonly ??= false
  chat.primaryBot ??= jid
  chat.antilinks ??= true

  chat.users[m.sender] ||= {}
  chat.users[m.sender].stats ||= {}
  chat.users[m.sender].usedTime ??= null
  chat.users[m.sender].lastCmd = isNumber(chat.users[m.sender].lastCmd) ? chat.users[m.sender].lastCmd : 0
  chat.users[m.sender].coins = isNumber(chat.users[m.sender].coins) ? chat.users[m.sender].coins : 0
  chat.users[m.sender].bank = isNumber(chat.users[m.sender].bank) ? chat.users[m.sender].bank : 0
  chat.users[m.sender].afk = isNumber(chat.users[m.sender].afk) ? chat.users[m.sender].afk : -1
  chat.users[m.sender].afkReason ??= ''
  chat.users[m.sender].characters = Array.isArray(chat.users[m.sender].characters) ? chat.users[m.sender].characters : []
}

export default initDB
