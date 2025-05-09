module.exports = {
    name: 'xenon',
    description: 'Download video/image from Instagram, Facebook, or YouTube via SaveFrom.net or DownloadGram',
    category: 'media',
  
    async execute(sock, msg, args) {
      const from = msg.key.remoteJid;
      const quoted = msg;
      const url = args[0];
  
      if (!url) {
        return sock.sendMessage(from, { text: '❌ Please send a valid Instagram, Facebook, or YouTube URL.' }, { quoted });
      }
  
      try {
        if (url.includes('instagram.com')) {
          const { XeonIgImg } = require('../lib/xenonHandler');
          const imageUrls = await XeonIgImg(url);
  
          if (imageUrls.length === 0 || imageUrls[0].startsWith('Error')) {
            return sock.sendMessage(from, { text: '⚠️ Could not fetch Instagram media. Try again later.' }, { quoted });
          }
  
          for (const link of imageUrls) {
            await sock.sendMessage(from, { text: `📸 Insta Download: ${link}` }, { quoted });
          }
        } else {
          const { XeonFb } = require('../lib/xenonHandler');
          const videoInfo = await XeonFb(url);
  
          if (videoInfo && videoInfo[0] && videoInfo[0].url) {
            return sock.sendMessage(from, { text: `📥 Video Download: ${videoInfo[0].url}` }, { quoted });
          } else {
            return sock.sendMessage(from, { text: '⚠️ Could not fetch the video. Check the URL or try again later.' }, { quoted });
          }
        }
      } catch (err) {
        console.error('❌ Xenon error:', err);
        return sock.sendMessage(from, { text: '💥 Something went wrong. Please try again later.' }, { quoted });
      }
    }
  };
  