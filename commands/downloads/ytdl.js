import { spawn } from 'child_process';
import fs from 'fs';
import fetch from 'node-fetch';

const yt = {
  static: Object.freeze({
    baseUrl: 'https://cnv.cx',
    headers: {
      'accept-encoding': 'gzip, deflate, br, zstd',
      'origin': 'https://frame.y2meta-uk.com',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
    }
  }),

  async getKey() {
    const res = await fetch(`${this.static.baseUrl}/v2/sanity/key`, {
      headers: this.static.headers
    });
    if (!res.ok) throw new Error('❌ No se pudo obtener la key');
    return res.json();
  },

  resolveConverterPayload(link, f = '128k') {
    const formats = ['128k', '320k', '144p', '240p', '360p', '720p', '1080p'];
    if (!formats.includes(f))
      throw new Error(`Formato inválido (${formats.join(', ')})`);

    const tipo = f.endsWith('k') ? 'mp3' : 'mp4';
    return {
      link,
      format: tipo,
      audioBitrate: tipo === 'mp3' ? f.replace('k', '') : '128',
      videoQuality: tipo === 'mp4' ? f.replace('p', '') : '720',
      filenameStyle: 'pretty',
      vCodec: 'h264'
    };
  },

  sanitizeFileName(name) {
    const ext = name.match(/\.[^.]+$/)?.[0] || '';
    return (
      name
        .replace(ext, '')
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .toLowerCase() + ext
    );
  },

  async convert(url, f) {
    const { key } = await this.getKey();
    const payload = this.resolveConverterPayload(url, f);
    const res = await fetch(`${this.static.baseUrl}/v2/converter`, {
      method: 'POST',
      headers: { ...this.static.headers, key },
      body: new URLSearchParams(payload)
    });
    if (!res.ok) throw new Error('❌ Error en la conversión');
    return res.json();
  }
};

/* =======================
   VIDEO FASTSTART
======================= */
async function convertToFast(buffer) {
  const input = `./in_${Date.now()}.mp4`;
  const output = `./out_${Date.now()}.mp4`;

  fs.writeFileSync(input, buffer);

  const runFF = (args) =>
    new Promise((res, rej) => {
      const ff = spawn('ffmpeg', args);
      ff.on('close', (code) => (code === 0 ? res() : rej(new Error('FFmpeg falló'))));
    });

  try {
    // Intentar copia rápida
    await runFF(['-y', '-i', input, '-c', 'copy', '-movflags', '+faststart', output]);
  } catch {
    // Re-encode si falla
    await runFF([
      '-y',
      '-i', input,
      '-map', '0:v:0',
      '-map', '0:a?',
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-c:a', 'aac',
      '-movflags', '+faststart',
      output
    ]);
  }

  const newBuffer = fs.readFileSync(output);
  fs.unlinkSync(input);
  fs.unlinkSync(output);
  return newBuffer;
}

/* =======================
        PLUGIN
======================= */
export default {
  command: ['yta', 'ytv'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args[0])
        return m.reply(
          `《✧》 Por favor, ingrese un enlace válido.\nEjemplo:\n${usedPrefix}${command} https://youtu.be/xxxx`
        );

      const isAudio = command.toLowerCase() === 'yta';
      const quality = args[1] || (isAudio ? '128k' : '720p');

      const waitMsg = isAudio ? '*🌾 Descargando audio...*' : '*🌱 Descargando video...*';
      const msg = await client.sendMessage(m.chat, { text: waitMsg }, { quoted: m });

      const data = await yt.convert(args[0], quality);
      const fileName = yt.sanitizeFileName(data.filename);

      const r = await fetch(data.url, { headers: { range: 'bytes=0-' } });
      const buffer = Buffer.from(await r.arrayBuffer());

      if (isAudio) {
        // Audio grande → enviar como documento
        if (buffer.length > 80 * 1024 * 1024) {
          await client.sendMessage(
            m.chat,
            { document: { buffer, mimetype: 'audio/mpeg', fileName } },
            { quoted: m }
          );
        } else {
          await client.sendMessage(
            m.chat,
            { audio: buffer, mimetype: 'audio/mpeg', fileName },
            { quoted: m }
          );
        }
      } else {
        const fixed = await convertToFast(buffer);
        await client.sendMessage(
          m.chat,
          { video: fixed, mimetype: 'video/mp4', fileName },
          { quoted: m }
        );
      }

      // Borrar mensaje de espera
      await client.sendMessage(m.chat, { delete: msg.key }).catch(() => {});
    } catch (e) {
      console.error(e);
      m.reply('❌ Ocurrió un error al procesar tu solicitud.\n' + e.message);
    }
  }
};