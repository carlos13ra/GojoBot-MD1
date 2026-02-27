import fs from 'fs';
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'

global.owner = ['51963315293', '51963315293']
global.botNumber = ''

global.sessionName = 'Sessions/Owner'
global.version = '^2.0 - Latest'
global.dev = "© ⍴᥆ᥕᥱrᥱძ ᑲᥡ ɪ'ᴍ ᴄ`ᴀʀʟᴏs.ʀᴠ"
global.links = {
api: 'https://nexus-light-beryl.vercel.app/',
web: 'http://localhost:5010',
channel: "https://whatsapp.com/channel/0029VbBGlokA89MliWWv1x16",
github: "https://github.com/carlos13ra/GojoBot-MD",
gmail: "carlosramirezvillanueva30@gmail.com"
}
global.my = {
ch: '120363421367237421@newsletter',
name: '⋆｡ﾟ☁︎｡⋆ ɢᴏᴊᴏʙᴏᴛ❄️ | ᴄʜᴀɴɴᴇʟ ᴏғɪᴄɪᴀʟ ⋆｡ﾟ☁︎｡⋆',
}

global.mess = {
socket: '《✧》 Este comando solo puede ser ejecutado por un Socket.',
admin: '《✧》 Este comando solo puede ser ejecutado por los Administradores del Grupo.',
botAdmin: '《✧》 Este comando solo puede ser ejecutado si el Socket es Administrador del Grupo.'
}

global.api = {
  url: 'https://nexus-light-beryl.vercel.app',
  key: '....'
}

global.APIs = {
adonix: { url: "https://api-adonix.ultraplus.click", key: "shadow-xyz" },
vreden: { url: "https://api.vreden.web.id", key: null },
nekolabs: { url: "https://api.nekolabs.web.id", key: null },
siputzx: { url: "https://api.siputzx.my.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
ootaizumi: { url: "https://api.ootaizumi.web.id", key: null },
stellar: { url: "https://api.stellarwa.xyz", key: "YukiWaBot", key2: '1bcd4698ce6c75217275c9607f01fd99' },
apifaa: { url: "https://api-faa.my.id", key: null },
xyro: { url: "https://api.xyro.site", key: null },
yupra: { url: "https://api.yupra.my.id", key: null }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  import(`${file}?update=${Date.now()}`)
})
