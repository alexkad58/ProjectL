const { cache, updateSoundPad } = require('../../features/sound-pad')

module.exports = {
    name: 'Delete sound',
    aliases: ['delete', 'del'], 
    category: 'Configuration',
    permissions: ['ADMINISTRATOR'],
    description: 'Deletes sound from soundpad',
    expectedArgs: '<name>',
    minArgs: 1,
    callback: async ({ message, instance, client, args }) => {
        if (!message.guild) return
        
        const { guild, channel } = message
        if (channel.id != cache[guild.id].config) return message.react('🚫')
        
        const deletedSound = args[0]

        updateSoundPad({ deletedSound, guildId: guild.id, client })
    } 
}