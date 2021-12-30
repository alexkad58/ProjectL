const { cache, updateSoundPad, getSounds } = require('../../features/sound-pad')
const { MessageButton, MessageActionRow } = require('discord-buttons')

const sendSoundsToDelete = (channel, toDelete ) => {
    const components = []

    let row = new MessageActionRow()

    toDelete.forEach((sound, index) => {

        // for (let i = 0; i < 4; i++) {
        
        // }

        let button = new MessageButton()
        .setLabel(sound.name)
        .setStyle("blurple")
        .setID(`${'del'}${sound.url.slice(4)}`)
        row.addComponent(button)
    })

    components.push(row)

    let accPutton = new MessageButton()
        .setLabel('Accept')
        .setStyle("blurple")
        .setID(`accept_delete`)
    let denButton = new MessageButton()
        .setLabel('Cancel')
        .setStyle("blurple")
        .setID(`cancel`)
    
    let acceptRow = new MessageActionRow()
        .addComponent(accPutton)
        .addComponent(denButton)
    components.push(acceptRow)

    if (components[0].components.length) return channel.send('To delete:', { components })
}

module.exports = {
    name: 'Delete sound',
    aliases: ['delete', 'del'], 
    category: 'Configuration',
    permissions: ['ADMINISTRATOR'],
    description: 'Deletes sound from soundpad',
    callback: async ({ message, instance, client, args }) => {
        if (!message.guild) return
        
        const { guild, channel } = message
        if (channel.id != cache[guild.id].config) return message.react('🚫')
        const soundsChannel = message.guild.channels.cache.get(cache[guild.id].sounds)
        toDelete = await getSounds(soundsChannel)
        toDelete = toDelete.sounds
        
        sendSoundsToDelete(message.channel, toDelete).then((msg) => {
            client.on('clickButton', async (button) => {
                const toDeleteCache = []
        
                if (button.id.startsWith('del')) {
                    if (!toDeleteCache.includes(button.label)) toDeleteCache.push(button.label)
                    
                    await button.defer()
                }

                if (button.id.startsWith('accept_delete')) {
                    updateSoundPad({ guildId: message.guild.id, client, deletedSounds: toDeleteCache })
                    await button.defer()
                    return msg.delete()
                }

                if (button.id.startsWith('cancel')) {
                    await button.defer()
                    return msg.delete()
                }
            })
        })

        // updateSoundPad({ deletedSound, guildId: guild.id, client })
    } 
}