const { fetch } = require('../../features/sound-pad')
const lpSchema = require('../../schemas/lp-schema')

module.exports = {
    name: 'Create',
    aliases: ['create'], 
    category: 'Configuration',
    permissions: ['ADMINISTRATOR'],
    description: 'Sets up text channels',
    callback: async ({ message, client }) => {
        const { guild } = message
        const temp = {}

        guild.channels.create(`LaughPad`, { type: 'category' }).then(category => {
            guild.channels.create(`configuration`, { parent: category.id }).then(async ch => {
                ch.send('lp!add <URL/href> <name> to add new sound')
                ch.send('lp!del <name> to delete sound')
                ch.updateOverwrite(guild.roles.everyone, {
                    VIEW_CHANNEL: false
                })

                temp.config = ch.id
            }).then(() => {
                guild.channels.create(`Sounds`, { parent: category.id }).then(async ch => {
                    ch.updateOverwrite(guild.roles.everyone, {
                        SEND_MESSAGES: false
                    })

                    temp.sounds = ch.id
                    
                    await lpSchema.findOneAndUpdate({ 
                        guildId: guild.id
                    }, {
                        guildId: guild.id,
                        channels: temp
                    },{
                        upsert: true
                    })

                    await fetch(client)
                })
            })
        })
    } 
}