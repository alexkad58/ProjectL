const { MessageButton, MessageActionRow } = require('discord-buttons')
const lpSchema = require('../schemas/lp-schema')

let cache = {}

const fetchData = async (client) => {
    const results = await lpSchema.find({})
    for (const result of results) {
        const guild = client.guilds.cache.get(result.guildId)
        if (guild) {
            const configChannel = guild.channels.cache.get(result.channels.config)
            const soundsChannel = guild.channels.cache.get(result.channels.sounds)
            if (configChannel && soundsChannel) {
                cache[guild.id] = result.channels
            }
        }
    }
}

const populateCache = async (client) => {

    await fetchData(client)
    
    setTimeout(() => { populateCache(client) }, 1000 * 60 * 10)
}

const getSounds = async (channel) => {
    sounds = []
    toDelete = null

    await channel.messages.fetch().then(messages => {
        messages.forEach((item, index) => {
            if (item.author.bot) {
                toDelete = item

                item.components.forEach(element => {
                    element.components.forEach(e => {
                        sounds.push({ url: e.custom_id, name: e.label })
                    })
                })

                return
            }   return
        })
    }).catch(err => {
        console.log('Error while getting mentions: ')
        console.log(err)
    })

    return { sounds, toDelete }
}

const sendSounds = (channel, { sounds, toDelete }) => {
    if (toDelete) toDelete.delete()
    const components = []

    let row = new MessageActionRow()

    sounds.forEach((sound, index) => {

        // for (let i = 0; i < 4; i++) {
        
        // }
        let tmp = ''
        
        if (!sound.url.startsWith('play')) tmp = 'play'

        let button = new MessageButton()
        .setLabel(sound.name)
        .setStyle("blurple")
        .setID(`${tmp}${sound.url}`)
        row.addComponent(button)
    })

    components.push(row)
    
    if (components[0].components.length) channel.send('Sounds:', { components })
}

const updateSoundPad = async ({ newSound, deletedSound, guildId, client }) => {

    const guild = client.guilds.cache.get(guildId)
    if (!guild) return
    const soundsChannel = guild.channels.cache.get(cache[guildId].sounds)
    if (!soundsChannel) return

    if (newSound) {
        res = await getSounds(soundsChannel)
        sounds.push(newSound)

        sendSounds(soundsChannel, res)
    }

    if (deletedSound) {
        res = await getSounds(soundsChannel)

        res.sounds.forEach((sound, index) => {
            if (sound.name === deletedSound) res.sounds.splice(index, 1)
        })

        sendSounds(soundsChannel, res)
    }
}

function en(c){var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

function de(b){var a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}

module.exports = (client, instance) => {
    populateCache(client)

    client.on('clickButton', async (button) => {
        console.log(button.id)

        if (button.clicker.member.voice.channel && button.id.startsWith('play')) {
            button.clicker.member.voice.channel.join().then(async connection => {
                connection.play(`${de(button.id.slice(4))}`)
            })
            
        await button.defer()
        }
    })
}

module.exports.config = {
    loadDBFirst: true
}

module.exports.fetch = fetchData

module.exports.updateSoundPad = updateSoundPad

module.exports.cache = cache