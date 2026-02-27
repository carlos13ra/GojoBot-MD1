import { toAudio, toPTT, toVideo } from '../../lib/converter.js';

export default {
  command: ['tomp3', 'ptt', 'tomp4', 'convert'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      await m.react('🕒');

      const q = m.quoted || m;
      const mime =
        q.mimetype ||
        q.msg?.mimetype ||
        q.message?.imageMessage?.mimetype ||
        q.message?.videoMessage?.mimetype ||
        q.message?.audioMessage?.mimetype ||
        q.message?.documentMessage?.mimetype ||
        '';

      if (!mime)
        return m.reply('🪴 *Responde a cualquier archivo de audio/video para convertir.*');

      const buffer = await q.download();
      if (!buffer) throw 'No se pudo descargar el archivo';

      const ext = mime.split('/')[1] || 'bin';
      let output, mimetype, filename;

      switch (command.toLowerCase()) {
        case 'tomp3':
        case 'convert':
          output = await toAudio(buffer, ext);
          mimetype = 'audio/mpeg';
          filename = `audio_${Date.now()}.mp3`;
          break;

        case 'ptt':
          output = await toPTT(buffer, ext);
          mimetype = 'audio/ogg';
          filename = `ptt_${Date.now()}.ogg`;
          ppt: true;
          break;

        case 'tomp4':
          output = await toVideo(buffer, ext);
          mimetype = 'video/mp4';
          filename = `video_${Date.now()}.mp4`;
          break;

        default:
          return m.reply('❌ Comando de conversión no reconocido.');
      }

      await client.sendMessage(
        m.chat,
        {
          [output.filename.endsWith('.mp4') ? 'video' : 'audio']: output.data,
          mimetype,
          fileName: filename,
        },
        { quoted: m }
      );

      await m.react('✔️');

      await output.delete();

    } catch (e) {
      console.error(e);
      await m.reply(`Error:\n${e}`);
    }
  },
};