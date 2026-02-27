import moment from 'moment-timezone'

export default {
  command: ['allmenu', 'help', 'menu'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
   try {
     const botId = client.user.id.split(':')[0] + '@s.whatsapp.net';
     const botSettings = global.db.data.settings[botId];
     const botname = botSettings.botname;
     const namebot = botSettings.namebot;
     const banner = botSettings.banner;
     const owner = botSettings.owner;
     const canalId = botSettings.id;
     const canalName = botSettings.nameid;
     const users = Object.keys(global.db.data.users).length;
     const sender = global.db.data.users[m.sender].name;
     const uptimeMs = process.uptime() * 1000;
     const time = formatearMs(uptimeMs);
     const isOficialBot = botId === client.user.id.split(':')[0] + '@s.whatsapp.net';
     const botType = isOficialBot ? 'Principal/Owner' : 'Sub Bot';
     const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB';
     const commds = Object.keys(global.plugins).length;
     const device = process.platform;
     const jam = moment.tz('America/Bogota').locale('id').format('HH:mm:ss');
     const prefix = usedPrefix;
     const ucapan =
        jam < '05:00:00' ? 'Buen día' :
        jam < '11:00:00' ? 'Buen día' :
        jam < '15:00:00' ? 'Buenas tardes' :
        jam < '18:00:00' ? 'Buenas tardes' :
        jam < '19:00:00' ? 'Buenas tardes' :
        jam < '23:59:00' ? 'Buenas noches' :
        'Buenas noches'
        
let xz = {
sh: "⪩ ::", sh2: "᮫　⿻"
}
const res = await fetch('https://nexus-light-beryl.vercel.app/src/commands.js')
const text = await res.text() 
let menu = `*🌱᪶ᩧㅤ  Hׁola @${sender} ${ucapan}ㅤぬ  : Welcome to ${namebot}.*

> ˖⌗⌗.ᐟ 𝐒𝐭𝐚𝐭𝐮𝐬 - 𝐁𝐨𝐭ㅤ𐚁ܻ֮
 
 *🌾 𝚃𝚈𝙿𝙴 »* ${botType}
 *🍓 𝚄𝚂𝙴𝚁𝚂 »* ${users}
 *🍙 𝚄𝙿𝚃𝙸𝙼𝙴 »* ${time}
 *🥦 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 »* ${commds}
 *🍄 𝚁𝙰𝙼 𝚄𝚂𝙰𝙶𝙴 »* ${ramUsage}
 *🍃 𝚂𝚈𝚂𝚃𝙴𝙼/𝙾𝙿𝚁 »* ${device}
 
୨୧━・━・━୨୧━・━・━୨୧━・━・━୨୧

> .     ˖⌗⌗.ᐟ ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs 🎐 :

⪩ ::  ᮫　⌗⌗ *ECONOMY* ᮫　⿻
 ׄ✿ִㅤ${prefix}ᴡ › ᴡᴏʀᴋ › ᴛʀᴀʙᴀᴊᴀʀ
 ׄ✿ִㅤ${prefix}ʙᴀʟᴀɴᴄᴇ › ʙᴀʟ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ғʟɪᴘ › ᴄғ *+ « ᴄᴀɴᴛɪᴅᴀᴅ / ᴄᴀʀᴀ|ᴄʀᴜᴢ »*
 ׄ✿ִㅤ${prefix}ᴄʀɪᴍᴇ › ᴄʀɪᴍᴇɴ
 ׄ✿ִㅤ${prefix}ᴅᴀɪʟʏ › ᴅɪᴀʀɪᴏ
 ׄ✿ִㅤ${prefix}ᴅᴇᴘ › ᴅᴇᴘᴏsɪᴛᴀʀ *+ « ᴄᴀɴᴛɪᴅᴀᴅ|ᴀʟʟ »*
 ׄ✿ִㅤ${prefix}ᴇʙᴏᴀʀᴅ › ʙᴀʟᴛᴏᴘ  *+ « ᴘᴀɢᴇ »*
 ׄ✿ִㅤ${prefix}ᴄᴀsɪɴᴏ › ᴀᴘᴏsᴛᴀʀ › sʟᴏᴛ *+ « ᴀᴍᴏᴜɴᴛ »*
 ׄ✿ִㅤ${prefix}ᴇᴄᴏɴᴏᴍʏɪɴғᴏ › ᴇɪɴғᴏ
 ׄ✿ִㅤ${prefix}ᴘᴀʏ › ᴄᴏɪɴsɢɪᴠᴇ *+ « ᴄᴀɴᴛɪᴅᴀᴅ|ᴀʟʟ / ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʀᴛ › ʀᴜʟᴇᴛᴀ *+ « ᴄᴀɴᴛɪᴅᴀᴅ / ʀᴇᴅ|ʙʟᴀᴄᴋ|ɢʀᴇᴇɴ »*
 ׄ✿ִㅤ${prefix}sʟᴜᴛ › ᴘʀᴏsᴛɪᴛᴜɪʀsᴇ
 ׄ✿ִㅤ${prefix}sᴛᴇᴀʟ › ʀᴏʙᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴡɪᴛʜ › ʀᴇᴛɪʀᴀʀ *+ « ᴄᴀɴᴛɪᴅᴀᴅ/ᴀʟʟ »*
 ׄ✿ִㅤ${prefix}ᴍɪɴᴀʀ › ᴍɪɴᴇ
 ׄ✿ִㅤ${prefix}ᴄᴏғʀᴇ › ᴄᴏғғᴇʀ
 ׄ✿ִㅤ${prefix}ᴡᴇᴇᴋʟʏ › sᴇᴍᴀɴᴀʟ
 ׄ✿ִㅤ${prefix}ᴍᴏɴᴛʜʟʏ › ᴍᴇɴsᴜᴀʟ
 ׄ✿ִㅤ${prefix}ᴀᴠᴇɴᴛᴜʀᴀ › ᴀᴅᴠᴇɴᴛᴜʀᴇ
 ׄ✿ִㅤ${prefix}ᴄᴜʀᴀʀ › ʜᴇᴀʟ
 ׄ✿ִㅤ${prefix}ᴄᴀᴢᴀʀ › ʜᴜɴᴛ
 ׄ✿ִㅤ${prefix}ғɪsʜ › ᴘᴇsᴄᴀʀ
 ׄ✿ִㅤ${prefix}ᴍᴀᴢᴍᴏʀʀᴀ › ᴅᴜɴɢᴇᴏɴ
 ׄ✿ִㅤ${prefix}ᴍᴀᴛʜ › ᴍᴀᴛᴇs *+ « ᴅɪғғɪᴄᴜʟᴛʏ »*
 ׄ✿ִㅤ${prefix}ᴘᴘᴛ *+ « ᴘɪᴇᴅʀᴀ/ᴘᴀᴘᴇʟ/ᴛɪᴊᴇʀᴀ »*
        
⪩ ::  ᮫　⌗⌗ *GACHA* ᮫　⿻
 ׄ✿ִㅤ${prefix}ʙᴜʏᴄʜᴀʀᴀᴄᴛᴇʀ › ʙᴜʏᴄʜᴀʀ › ʙᴜʏᴄ *+ « ᴡᴀɪғᴜ »*
 ׄ✿ִㅤ${prefix}ᴄʜᴀʀɪᴍᴀɢᴇ › ᴡᴀɪғᴜɪᴍᴀɢᴇ › ᴄɪᴍᴀɢᴇ › ᴡɪᴍᴀɢᴇ *+ « ᴡᴀɪғᴜ »*
 ׄ✿ִㅤ${prefix}ᴄʜᴀʀɪɴғᴏ › ᴡɪɴғᴏ › ᴡᴀɪғᴜɪɴғᴏ *+ « ᴡᴀɪғᴜ »*
 ׄ✿ִㅤ${prefix}ᴄʟᴀɪᴍ › ᴄ › ʀᴇᴄʟᴀᴍᴀʀ *+ « ᴄɪᴛᴇ / ᴡᴀɪғᴜ »*
 ׄ✿ִㅤ${prefix}ᴅᴇʟᴄʟᴀɪᴍᴍsɢ
 ׄ✿ִㅤ${prefix}ᴅᴇʟᴇᴛᴇᴡᴀɪғᴜ › ᴅᴇʟᴡᴀɪғᴜ › ᴅᴇʟᴄʜᴀʀ *+ « ᴡᴀɪғᴜ »*
 ׄ✿ִㅤ${prefix}ғᴀᴠᴏʀɪᴛᴇᴛᴏᴘ › ғᴀᴠᴛᴏᴘ
 ׄ✿ִㅤ${prefix}ɢᴀᴄʜᴀɪɴғᴏ › ɢɪɴғᴏ › ɪɴғᴏɢᴀᴄʜᴀ
 ׄ✿ִㅤ${prefix}ɢɪᴠᴇᴀʟʟʜᴀʀᴇᴍ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ɢɪᴠᴇᴄʜᴀʀ › ɢɪᴠᴇᴡᴀɪғᴜ › ʀᴇɢᴀʟᴀʀ *+ « ᴡᴀɪғᴜ / ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʜᴀʀᴇᴍ › ᴡᴀɪғᴜs › ᴄʟᴀɪᴍs *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʜᴀʀᴇᴍsʜᴏᴘ › ᴛɪᴇɴᴅᴀᴡᴀɪғᴜs › ᴡsʜᴏᴘ *+ « ᴘᴀɢᴇ »*
 ׄ✿ִㅤ${prefix}ʀᴇᴍᴏᴠᴇsᴀʟᴇ › ʀᴇᴍᴏᴠᴇʀᴠᴇɴᴛᴀ *+ « ᴡᴀɪғᴜ »*
 ׄ✿ִㅤ${prefix}ʀᴏʟʟᴡᴀɪғᴜ › ʀᴡ › ʀᴏʟʟ
 ׄ✿ִㅤ${prefix}sᴇʟʟ › ᴠᴇɴᴅᴇʀ *+ « ᴠᴀʟᴜᴇ »* <ᴡᴀɪғᴜ »*
 ׄ✿ִㅤ${prefix}sᴇʀɪᴇɪɴғᴏ › ᴀɪɴғᴏ › ᴀɴɪᴍᴇɪɴғᴏ <ɴᴀᴍᴇ »*
 ׄ✿ִㅤ${prefix}sᴇʀɪᴇʟɪsᴛ › sʟɪsᴛ › ᴀɴɪᴍᴇʟɪsᴛ
 ׄ✿ִㅤ${prefix}sᴇᴛᴄʟᴀɪᴍᴍsɢ › sᴇᴛᴄʟᴀɪᴍ *+ « ᴛᴇxᴛ »*
 ׄ✿ִㅤ${prefix}ᴛʀᴀᴅᴇ › ɪɴᴛᴇʀᴄᴀᴍʙɪᴀʀ *+ « ᴛᴜ ᴘᴇʀsᴏɴᴀᴊᴇ / ᴘᴇʀsᴏɴᴀᴊᴇ 2 »*
 ׄ✿ִㅤ${prefix}ᴠᴏᴛᴇ › ᴠᴏᴛᴀʀ *+ « ᴡᴀɪғᴜ »*
 ׄ✿ִㅤ${prefix}ᴡᴀɪғᴜsʙᴏᴀʀᴅ › ᴡᴀɪғᴜsᴛᴏᴘ › ᴛᴏᴘᴡᴀɪғᴜs › ᴡᴛᴏᴘ *+ « ᴘᴀɢᴇ »*

⪩ ::  ᮫　⌗⌗ *DOWNLOADS* ᮫　⿻
 ׄ✿ִㅤ${prefix}ғᴀᴄᴇʙᴏᴏᴋ › ғʙ *+ « ᴜʀʟ »*
 ׄ✿ִㅤ${prefix}ᴍᴇᴅɪᴀғɪʀᴇ › ᴍғ *+ « ᴜʀʟ/ǫᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}ᴘʟᴀʏ › ᴘʟᴀʏᴀᴜᴅɪᴏ *+ « ᴜʀʟ/ǫᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}ᴘɪɴᴛᴇʀᴇsᴛ › ᴘɪɴ *+ « ᴜʀʟ/ǫᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}ᴘʟᴀʏ2 › ᴘʟᴀʏᴠɪᴅᴇᴏ *+ « ᴜʀʟ/ǫᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}ɪɴsᴛᴀɢʀᴀᴍ › ɪɢ *+ « ᴜʀʟ »*
 ׄ✿ִㅤ${prefix}ᴛɪᴋᴛᴏᴋ › ᴛᴛ *+ « ᴜʀʟ/ǫᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}ᴛᴡɪᴛᴛᴇʀ › x *+ « ᴜʀʟ »*
 ׄ✿ִㅤ${prefix}sᴘᴏᴛɪғʏ › sᴘʟᴀʏ *+ « ǫᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}sᴏᴜɴᴅᴄʟᴏᴜᴅ › sᴏᴜɴᴅ *+ « ǫᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}ᴀᴘᴘʟᴇᴍᴜsɪᴄ › ᴀᴘᴘʟᴇ *+ « ǫᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}ɪᴍᴀɢᴇɴ › ɪᴍɢ *+ « ǫᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}ᴀᴘᴋ › ᴀᴘᴋᴅʟ *+ « ǫᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}ᴍᴘ3ᴅᴏᴄ *+ « ᴜʀʟ »*
 ׄ✿ִㅤ${prefix}ᴍᴘ4ᴅᴏᴄ *+ « ᴜʀʟ »*

⪩ ::  ⌗⌗ *PROFILES* ᮫　⿻
 ׄ✿ִㅤ${prefix}ᴘʀᴏғɪʟᴇ › ᴘᴇʀғɪʟ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ › ʟʙᴏᴀʀᴅ › ʟʙ *+ « ᴘᴀɢᴇ »*
 ׄ✿ִㅤ${prefix}ʟᴇᴠᴇʟ › ʟᴠʟ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴇᴛɢᴇɴʀᴇ *+ « ʜᴏᴍʙʀᴇ|ᴍᴜᴊᴇʀ »*
 ׄ✿ִㅤ${prefix}ᴅᴇʟɢᴇɴʀᴇ
 ׄ✿ִㅤ${prefix}sᴇᴛʙɪʀᴛʜ *+ « ᴅɪᴀ/ᴍᴇs/ᴀñᴏ|ᴍᴇs/ᴅɪᴀ »*
 ׄ✿ִㅤ${prefix}ᴅᴇʟʙɪʀᴛʜ
 ׄ✿ִㅤ${prefix}sᴇᴛᴅᴇsᴄʀɪᴘᴛɪᴏɴ › sᴇᴛᴅᴇsᴄ *+ « ᴛᴇxᴛ »*
 ׄ✿ִㅤ${prefix}ᴅᴇʟᴅᴇsᴄʀɪᴘᴛɪᴏɴ › ᴅᴇʟᴅᴇsᴄ
 ׄ✿ִㅤ${prefix}ᴍᴀʀʀʏ › ᴄᴀsᴀʀsᴇ <ᴍᴇɴᴛɪᴏɴ »*
ᴅɪᴠᴏʀᴄᴇ
 ׄ✿ִㅤ${prefix}sᴇᴛғᴀᴠᴏᴜʀɪᴛᴇ › sᴇᴛғᴀᴠ *+ « ᴡᴀɪғᴜ »*
 ׄ✿ִㅤ${prefix}ᴅᴇʟᴇᴛᴇғᴀᴠ › ᴅᴇʟғᴀᴠ *+ « ᴡᴀɪғᴜ »*
 ׄ✿ִㅤ${prefix}sᴇᴛᴘᴀsᴀᴛɪᴇᴍᴘᴏ › sᴇᴛʜᴏʙʙʏ
 ׄ✿ִㅤ${prefix}ᴅᴇʟᴘᴀsᴀᴛɪᴇᴍᴘᴏ › ʀᴇᴍᴏᴠᴇʜᴏʙʙʏ

⪩ ::  ⌗⌗ *SOCKETS* ᮫　⿻
 ׄ✿ִㅤ${prefix}ʙᴏᴛɪɴғᴏ › ɪɴғᴏʙᴏᴛ
 ׄ✿ִㅤ${prefix}ᴊᴏɪɴ *+ « ʟɪɴᴋ »*
 ׄ✿ִㅤ${prefix}ʟᴇᴀᴠᴇ › sᴀʟɪʀ
 ׄ✿ִㅤ${prefix}ʟᴏɢᴏᴜᴛ
 ׄ✿ִㅤ${prefix}sᴇʟғ *+ « ᴏɴ|ᴏғғ »*
 ׄ✿ִㅤ${prefix}ϙʀ › ᴄᴏᴅᴇ
 ׄ✿ִㅤ${prefix}ʀᴇʟᴏᴀᴅ
 ׄ✿ִㅤ${prefix}sᴇᴛɴᴀᴍᴇ › sᴇᴛʙᴏᴛɴᴀᴍᴇ *+ « ᴄᴏʀᴛᴏ / ʟᴀʀɢᴏ »*
 ׄ✿ִㅤ${prefix}sᴇᴛʙᴀɴɴᴇʀ › sᴇᴛʙᴏᴛʙᴀɴɴᴇʀ
 ׄ✿ִㅤ${prefix}sᴇᴛɪᴄᴏɴ › sᴇᴛʙᴏᴛɪᴄᴏɴ
 ׄ✿ִㅤ${prefix}sᴇᴛᴘʀᴇғɪx › sᴇᴛʙᴏᴛᴘʀᴇғɪx *+ « ᴠᴀʟᴜᴇ »*
 ׄ✿ִㅤ${prefix}sᴇᴛᴄᴜʀʀᴇɴᴄʏ › sᴇᴛʙᴏᴛᴄᴜʀʀᴇɴᴄʏ *+ « ᴠᴀʟᴜᴇ »*
 ׄ✿ִㅤ${prefix}sᴇᴛᴏᴡɴᴇʀ › sᴇᴛʙᴏᴛᴏᴡɴᴇʀ *+ « ᴍᴇɴᴛɪᴏɴ|ɴᴜᴍʙᴇʀ »*
 ׄ✿ִㅤ${prefix}sᴇᴛᴄʜᴀɴɴᴇʟ › sᴇᴛʙᴏᴛᴄʜᴀɴɴᴇʟ *+ « ʟɪɴᴋ »*
 ׄ✿ִㅤ${prefix}sᴇᴛᴘғᴘ › sᴇᴛɪᴍᴀɢᴇ
 ׄ✿ִㅤ${prefix}sᴇᴛsᴛᴀᴛᴜs *+ « ᴠᴀʟᴜᴇ »*
 ׄ✿ִㅤ${prefix}sᴇᴛᴜsᴇʀɴᴀᴍᴇ *+ « ᴠᴀʟᴜᴇ »*

⪩ ::  ⌗⌗ *UTILITIES* ᮫　⿻
 ׄ✿ִㅤ${prefix}ᴍᴇɴᴜ › ʜᴇʟᴘ › ᴀʏᴜᴅᴀ *+ « ᴄᴀᴛᴇɢᴏʀʏ »*
 ׄ✿ִㅤ${prefix}ʙᴏᴛs › sᴏᴄᴋᴇᴛs
 ׄ✿ִㅤ${prefix}sᴛᴀᴛᴜs › ᴇsᴛᴀᴅᴏ
 ׄ✿ִㅤ${prefix}ᴘɪɴɢ › ᴘ › sᴘᴇᴇᴅ
 ׄ✿ִㅤ${prefix}ʀᴇᴘᴏʀᴛ › ʀᴇᴘᴏʀᴛᴇ *+ « ᴇʀʀᴏʀ »*
 ׄ✿ִㅤ${prefix}sᴜɢ › sᴜɢɢᴇsᴛ *+ « sᴜɢɢᴇsᴛ »*
 ׄ✿ִㅤ${prefix}ɪɴᴠɪᴛᴀʀ › ɪɴᴠɪᴛᴇ *+ « ʟɪɴᴋ »*
 ׄ✿ִㅤ${prefix}ɪᴀ › ᴄʜᴀᴛɢᴘᴛ *+ « ϙᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}sᴛɪᴄᴋᴇʀ › s *+ « ᴄɪᴛᴇ / ɪᴍᴀɢᴇ|ᴠɪᴅᴇᴏ »*
 ׄ✿ִㅤ${prefix}sᴇᴛsᴛɪᴄᴋᴇʀᴍᴇᴛᴀ › sᴇᴛᴍᴇᴛᴀ *+ « ᴀᴜᴛᴏʀ|ᴘᴀᴄᴋ »*
 ׄ✿ִㅤ${prefix}ɢᴇᴛᴘɪᴄ › ᴘғᴘ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴛᴏɪᴍᴀɢᴇ › ᴛᴏɪᴍɢ *+ « ᴄɪᴛᴇ / sᴛɪᴄᴋᴇʀ »*
 ׄ✿ִㅤ${prefix}ʙʀᴀᴛ › ʙʀᴀᴛᴠ › ϙᴄ › ᴇᴍᴏᴊɪᴍɪx *+ « ᴛᴇxᴛ|ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴛᴏᴜʀʟ *+ « ᴄɪᴛᴇ / ɪᴍᴀɢᴇ|ᴠɪᴅᴇᴏ »*
 ׄ✿ִㅤ${prefix}sᴀʏ › ᴅᴇᴄɪʀ *+ « ᴛᴇxᴛ »*
 ׄ✿ִㅤ${prefix}ᴛʀᴀᴅ › ᴛʀᴀᴅᴜᴄɪʀ › ᴛʀᴀɴsʟᴀᴛᴇ *+ « ʟᴀɴɢᴜᴀɢᴇ / ᴛᴇxᴛ »*
 ׄ✿ִㅤ${prefix}ɢᴇᴛ › ғᴇᴛᴄʜ *+ « ᴜʀʟ »*
 ׄ✿ִㅤ${prefix}ʜᴅ › ᴇɴʜᴀɴᴄᴇ › ʀᴇᴍɪɴɪ *+ « ᴄɪᴛᴇ / ɪᴍᴀɢᴇ »*
 ׄ✿ִㅤ${prefix}ɢɪᴛᴄʟᴏɴᴇ › ɢɪᴛ *+ « ᴜʀʟ|ϙᴜᴇʀʏ »*
 ׄ✿ִㅤ${prefix}ɪɴsᴘᴇᴄᴛ › ɪɴsᴘᴇᴄᴄɪᴏɴᴀʀ *+ « ᴜʀʟ »*
 ׄ✿ִㅤ${prefix}ʀᴇᴀᴅ › ʀᴇᴀᴅᴠɪᴇᴡᴏɴᴄᴇ *+ « ᴄɪᴛᴇ / ɪᴍᴀɢᴇ|ᴠɪᴅᴇᴏ »*
 
⪩ ::  ᮫　⌗⌗ *GROUPS* ᮫　⿻
 ׄ✿ִㅤ${prefix}ᴀʟᴇʀᴛs › ᴀʟᴇʀᴛᴀs *+ « ᴏɴ|ᴏғғ »*
 ׄ✿ִㅤ${prefix}ᴀɴᴛɪʟɪɴᴋs › ᴀɴᴛɪᴇɴʟᴀᴄᴇs *+ « ᴏɴ|ᴏғғ »*
 ׄ✿ִㅤ${prefix}ʙᴏᴛ *+ « ᴏɴ|ᴏғғ »*
 ׄ✿ִㅤ${prefix}ᴄʟᴏsᴇ › ᴄᴇʀʀᴀʀ *+ « ᴛɪᴍᴇ »*
 ׄ✿ִㅤ${prefix}ɢᴘ › ɢʀᴏᴜᴘɪɴғᴏ
 ׄ✿ִㅤ${prefix}ᴅᴇʟᴡᴀʀɴ *+ « ᴍᴇɴᴛɪᴏɴ / ɴᴜᴍʙᴇʀ|ᴀʟʟ »*
 ׄ✿ִㅤ${prefix}ᴅᴇᴍᴏᴛᴇ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴇᴄᴏɴᴏᴍʏ › ᴇᴄᴏɴᴏᴍɪᴀ *+ « ᴏɴ|ᴏғғ »*
 ׄ✿ִㅤ${prefix}ɢᴀᴄʜᴀ › ʀᴘɢ *+ « ᴏɴ|ᴏғғ »*
 ׄ✿ִㅤ${prefix}ɢᴏᴏᴅʙʏᴇ › ᴅᴇsᴘᴇᴅɪᴅᴀ *+ « ᴏɴ|ᴏғғ »*
 ׄ✿ִㅤ${prefix}sᴇᴛɢᴘʙᴀɴᴇʀ *+ « ᴄɪᴛᴇ / ɪᴍᴀɢᴇ »*
 ׄ✿ִㅤ${prefix}sᴇᴛɢᴘɴᴀᴍᴇ *+ « ᴠᴀʟᴜᴇ »*
 ׄ✿ִㅤ${prefix}sᴇᴛɢᴘᴅᴇsᴄ *+ « ᴠᴀʟᴜᴇ »*
 ׄ✿ִㅤ${prefix}ᴋɪᴄᴋ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ɴsғᴡ *+ « ᴏɴ|ᴏғғ »*
 ׄ✿ִㅤ${prefix}ᴏɴʟʏᴀᴅᴍɪɴ › ᴀᴅᴍɪɴᴏɴʟʏ *+ « ᴏɴ|ᴏғғ »*
 ׄ✿ִㅤ${prefix}ᴏᴘᴇɴ › ᴀʙʀɪʀ *+ « ᴛɪᴍᴇ »*
 ׄ✿ִㅤ${prefix}ᴘʀᴏᴍᴏᴛᴇ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴇᴛɢᴏᴏᴅʙʏᴇ *+ « ᴠᴀʟᴜᴇ »*
 ׄ✿ִㅤ${prefix}sᴇᴛᴘʀɪᴍᴀʀʏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴇᴛᴡᴀʀɴʟɪᴍɪᴛ *+ « ɴᴜᴍʙᴇʀ »*
 ׄ✿ִㅤ${prefix}sᴇᴛᴡᴇʟᴄᴏᴍᴇ *+ « ᴠᴀʟᴜᴇ »*
 ׄ✿ִㅤ${prefix}ᴛᴀɢ › ʜɪᴅᴇᴛᴀɢ › ᴛᴀɢᴀʟʟ *+ « ᴛᴇxᴛ »*
 ׄ✿ִㅤ${prefix}ᴍsɢᴄᴏᴜɴᴛ › ᴄᴏᴜɴᴛ › ᴍᴇssᴀɢᴇs › ᴍᴇɴsᴀᴊᴇs *+ « ᴍᴇɴᴛɪᴏɴ / ᴅᴀʏs »*
 ׄ✿ִㅤ${prefix}ᴛᴏᴘᴄᴏᴜɴᴛ › ᴛᴏᴘᴍᴇssᴀɢᴇs › ᴛᴏᴘᴍsɢᴄᴏᴜɴᴛ › ᴛᴏᴘᴍᴇɴsᴀᴊᴇs *+ « ᴅᴀʏs »*
 ׄ✿ִㅤ${prefix}ᴛᴏᴘɪɴᴀᴄᴛɪᴠᴇ › ᴛᴏᴘɪɴᴀᴄᴛɪᴠᴏs › ᴛᴏᴘɪɴᴀᴄᴛɪᴠᴇᴜsᴇʀs *+ « ᴅᴀʏs »*
 ׄ✿ִㅤ${prefix}ᴡᴀʀɴ *+ « ᴍᴇɴᴛɪᴏɴ / ʀᴇᴀsᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴡᴀʀɴs *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴡᴇʟᴄᴏᴍᴇ › ʙɪᴇɴᴠᴇɴɪᴅᴀ *+ « ᴏɴ|ᴏғғ »*
 ׄ✿ִㅤ${prefix}ʟɪɴᴋ › ʀᴇᴠᴏᴋᴇ
 
⪩ ::  ᮫　⌗⌗ *ANIME* ᮫　⿻
 ׄ✿ִㅤ${prefix}ᴡᴀɪғᴜ › ɴᴇᴋᴏ
 ׄ✿ִㅤ${prefix}ᴘᴘᴄᴏᴜᴘʟᴇ › ᴘᴘᴄᴘ
 ׄ✿ִㅤ${prefix}ᴘᴇᴇᴋ › ᴍɪʀᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄᴏᴍғᴏʀᴛ › ᴄᴏɴsᴏʟᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴛʜɪɴᴋʜᴀʀᴅ › ᴘᴇɴsᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄᴜʀɪᴏᴜs › ᴄᴜʀɪᴏsᴏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sɴɪғғ › ᴏʟᴇʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴛᴀʀᴇ › ᴍɪʀᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴛʀɪᴘ › ᴛʀᴏᴘᴇᴢᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʙʟᴏᴡᴋɪss › ʙᴇsɪᴛᴏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sɴᴜɢɢʟᴇ › ᴀᴄᴜʀʀᴜᴄᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴀɴɢʀʏ › ᴇɴᴏᴊᴀᴅᴏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʙʟᴇʜ › ᴍᴇʜ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʙᴏʀᴇᴅ › ᴀʙᴜʀʀɪᴅᴏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄʟᴀᴘ › ᴀᴘʟᴀᴜᴅɪʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄᴏғғᴇᴇ › ᴄᴀғᴇ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄᴏʟᴅ › ғʀɪᴏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sɪɴɢ › ᴄᴀɴᴛᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴛɪᴄᴋʟᴇ › ᴄᴏsϙᴜɪʟʟᴀs *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴄʀᴇᴀᴍ › ɢʀɪᴛᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴘᴜsʜ › ᴇᴍᴘᴜᴊᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ɴᴏᴘᴇ › ɴᴏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴊᴜᴍᴘ › sᴀʟᴛᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʜᴇᴀᴛ › ᴄᴀʟᴏʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ɢᴀᴍɪɴɢ › ᴊᴜɢᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴅʀᴀᴡ › ᴅɪʙᴜᴊᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄᴀʟʟ › ʟʟᴀᴍᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴅʀᴀᴍᴀᴛɪᴄ › ᴅʀᴀᴍᴀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴅʀᴜɴᴋ › ʙᴏʀʀᴀᴄʜᴏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ɪᴍᴘʀᴇɢɴᴀᴛᴇ › ᴇᴍʙᴀʀᴀᴢᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴋɪssᴄʜᴇᴇᴋ › ʙᴇsᴏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʟᴀᴜɢʜ › ʀᴇɪʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʟᴏᴠᴇ › ᴀᴍᴏʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴘᴏᴜᴛ › ᴍᴜᴇᴄᴀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴘᴜɴᴄʜ › ɢᴏʟᴘᴇᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʀᴜɴ › ᴄᴏʀʀᴇʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴀᴅ › ᴛʀɪsᴛᴇ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴄᴀʀᴇᴅ › ᴀsᴜsᴛᴀᴅᴏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴇᴅᴜᴄᴇ › sᴇᴅᴜᴄɪʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sʜʏ › ᴛɪᴍɪᴅᴏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sʟᴇᴇᴘ › ᴅᴏʀᴍɪʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴍᴏᴋᴇ › ғᴜᴍᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴘɪᴛ › ᴇsᴄᴜᴘɪʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴛᴇᴘ › ᴘɪsᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴛʜɪɴᴋ › ᴘᴇɴsᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴡᴀʟᴋ › ᴄᴀᴍɪɴᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʜᴜɢ › ᴀʙʀᴀᴢᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴋɪʟʟ › ᴍᴀᴛᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴇᴀᴛ › ɴᴏᴍ › ᴄᴏᴍᴇʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴋɪss › ᴍᴜᴀᴋ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴡɪɴᴋ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴘᴀᴛ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʜᴀᴘᴘʏ › ғᴇʟɪᴢ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʙᴜʟʟʏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʙɪᴛᴇ › ᴍᴏʀᴅᴇʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʙʟᴜsʜ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴡᴀᴠᴇ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʙᴀᴛʜ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴍᴜɢ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴍɪʟᴇ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʜɪɢʜғɪᴠᴇ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʜᴀɴᴅʜᴏʟᴅ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄʀɪɴɢᴇ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʙᴏɴᴋ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄʀʏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʟɪᴄᴋ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sʟᴀᴘ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴅᴀɴᴄᴇ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄᴜᴅᴅʟᴇ *+ « ᴍᴇɴᴛɪᴏɴ »*

⪩ ::  ᮫　⌗⌗ *NSFW* ᮫　⿻
 ׄ✿ִㅤ${prefix}xɴxx *+ « ϙᴜᴇʀʏ|ᴜʀʟ »*
 ׄ✿ִㅤ${prefix}xᴠɪᴅᴇᴏs *+ « ϙᴜᴇʀʏ|ᴜʀʟ »*
 ׄ✿ִㅤ${prefix}ᴅᴀɴʙᴏᴏʀᴜ › ᴅʙᴏᴏʀᴜ *+ « ᴛᴀɢ »*
 ׄ✿ִㅤ${prefix}ɢᴇʟʙᴏᴏʀᴜ › ɢʙᴏᴏʀᴜ *+ « ᴛᴀɢ »*
 ׄ✿ִㅤ${prefix}ʀᴜʟᴇ34 › ʀ34 *+ « ᴛᴀɢ »*
 ׄ✿ִㅤ${prefix}ʙʟᴏᴡᴊᴏʙ › ʙᴊ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʙᴏᴏʙᴊᴏʙ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄᴜᴍ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄᴜᴍᴍᴏᴜᴛʜ *+ « ᴍᴇɴᴄɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴄᴜᴍsʜᴏᴛ *+ « ᴍᴇɴᴄɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ғᴀᴘ › ᴘᴀᴊᴀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴀɴᴀʟ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ɢʀᴀʙʙᴏᴏʙs *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ғᴏᴏᴛᴊᴏʙ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ɢʀᴏᴘᴇ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ᴜɴᴅʀᴇss › ᴇɴᴄᴜᴇʀᴀʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sɪxɴɪɴᴇ › 69 *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʜᴀɴᴅᴊᴏʙ *+ « ᴍᴇɴᴄɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʟɪᴄᴋᴀss *+ « ᴍᴇɴᴄɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʟɪᴄᴋᴅɪᴄᴋ *+ « ᴍᴇɴᴄɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ʟɪᴄᴋᴘᴜssʏ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴘᴀɴᴋ › ɴᴀʟɢᴀᴅᴀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}ғᴜᴄᴋ › ᴄᴏɢᴇʀ *+ « ᴍᴇɴᴛɪᴏɴ »*
 ׄ✿ִㅤ${prefix}sᴜᴄᴋʙᴏᴏʙs *+ « ᴍᴇɴᴛɪᴏɴ »*
 `

      await client.sendMessage(m.chat,
        banner.includes('.mp4') || banner.includes('.webm')
          ? {
              video: { url: banner },
              gifPlayback: true,
              caption: menu,
              contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: canalId,
                  serverMessageId: '',
                  newsletterName: canalName
                }
              }
            }
          : {
              text: menu,
              contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: canalId,
                  serverMessageId: '',
                  newsletterName: canalName
                },
                externalAdReply: {
                  title: botname,
                  body: `${namebot}, © ⍴᥆ᥕᥱrᥱძ ᑲᥡ 𝙲𝙰𝚁𝙻𝙾𝚂.𝚁𝚅☘︎`,
                  thumbnailUrl: banner,
                  mediaType: 1,
                  renderLargerThumbnail: true,
                  showAdAttribution: false
                }
              }
            },
        { quoted: m }
      )

    } catch (e) {
      await m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*.\n> [Error: *${e.message}*]`)
    }
  }
}

function formatearMs(ms) {
  const segundos = Math.floor(ms / 1000)
  const minutos = Math.floor(segundos / 60)
  const horas = Math.floor(minutos / 60)
  const dias = Math.floor(horas / 24)

  return [dias && `${dias}𝐃`, `${horas % 24}𝐇`, `${minutos % 60}𝐌`, `${segundos % 60}𝐒`]
    .filter(Boolean)
    .join(" ")
}