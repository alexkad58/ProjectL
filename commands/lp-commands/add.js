const { cache, updateSoundPad } = require('../../features/sound-pad')

function en(c){var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

function de(b){var a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}

module.exports = {
    name: 'Add sound',
    aliases: ['add'], 
    category: 'Configuration',
    description: 'Adds new sound to soundpad',
    expectedArgs: '<URL> <name>',
    minArgs: 2,
    callback: async ({ message, instance, client, args }) => {
        if (!message.guild) return
        
        const { guild, channel } = message
        if (channel.id != cache[guild.id].config) return message.react('🚫')

        const enUrl = en(args[0])
        if (enUrl.length > 95) return message.reply('URL is too big')
        
        const newSound = { url: enUrl, name: args[1] }

        updateSoundPad({ newSound, guildId: guild.id, client })
    } 
}