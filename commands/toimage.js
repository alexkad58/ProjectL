const { GameOverEmitter } = require('../server/server')
const path = require('path')
const djs = require('discord.js')

module.exports = {
    callback: async ({ message, args, text, client, prefix, instance }) => {
        getName = () => {
            if (message.member.nickname) {
                return message.member.nickname 
            } else {
                return message.author.username
            }
        }

        sendMessages = (party, roomName) => {
            party.forEach((partyMember, i) => {
                i == 0 ? isHost = true : isHost = false 
                partyMember.send(`http://localhost:3000/?roomName=${roomName}&ishost=${isHost}`)
            })
        }
        let party = []
        party[0] = message.author
        message.delete()
        message.channel.send(`
            **${getName()}** хочет поиграть\nИгроки:\n>>> ${party[0]}`)
        .then(msg => {
        msg.react('▶')
        client.on('messageReactionAdd', async (reaction, user) => {
            // When we receive a reaction we check if the reaction is partial or not
            if (reaction.partial) {
                // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
                try {
                    await reaction.fetch();
                } catch (error) {
                    console.error('Something went wrong when fetching the message: ', error);
                    // Return as `reaction.message.author` may be undefined/null
                    return;
                }
            }
            if (reaction.emoji.name === '▶') {
                if (user == client.user  || party.length === 3) return
                party.push(user)
                await msg.edit(`${msg.content}\n${user}`)
                if (party.length === 3) {
                    
                    sendMessages
                    msg.edit(`${msg.content}\nИгра началась...`)
                    sendMessages(party, msg.id)
                }
                
            }
        });

        GameOverEmitter.on('gayOver', handleGameOver)  
                function handleGameOver(images) {
                    let toJoin = []
                    if (images[msg.id]) {
                        console.log(images[msg.id].length)
                        for (i = 0; i < images[msg.id].length; i++) {
                            console.log('yes')
                            
                            const sfbuff = new Buffer.from(images[msg.id][i].split(",")[1], "base64");
                            toJoin[i] = sfbuff
                            const resultImg = new djs.MessageAttachment(sfbuff, `out${i}.png`);
                            msg.channel.send(resultImg)
                        }
                        msg.edit(`${msg.content}\nи закончилась.`)
                    } else {
                        return
                    }
                }
    })   
    }
}