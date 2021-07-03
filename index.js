const Discord = require('discord.js')
const WOKcommands = require('wokcommands')

require('dotenv').config()

const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION'],
	disableEveryone: false
})

require('discord-buttons')(client)

client.on('ready', () => {
    console.log(`\nКлиент запущен!\n`)

    const dbOptions = {
		keepAlive: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	}

    new WOKcommands(client, {
        commandDir: 'commands',
        featuresDir: 'features',
        showWarns: false,
        dbOptions
    })
        .setMongoPath(process.env.MONGO_URI)
        .setDefaultPrefix('lp!')
})

client.login(process.env.DISCORD_TOKEN)
