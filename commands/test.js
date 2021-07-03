const { MessageButton, MessageActionRow } = require('discord-buttons')

module.exports = {
    aliases: 'test',
    permissions: ['ADMINISTRATOR'],
    callback: async ({ message, client }) => {
        let button = new MessageButton()
        .setLabel("test_name")
        .setStyle("blurple")
        .setID('test_id1')
        let button2 = new MessageButton()
        .setLabel("test_name")
        .setStyle("blurple")
        .setID('test_id2')
        let button3 = new MessageButton()
        .setLabel("test_name")
        .setStyle("blurple")
        .setID('test_id3')
        let button4 = new MessageButton()
        .setLabel("test_name")
        .setStyle("blurple")
        .setID('test_id4')
        let button5 = new MessageButton()
        .setLabel("test_name")
        .setStyle("blurple")
        .setID('test_id5')

        let row = new MessageActionRow()
            .addComponent(button)
            .addComponent(button2)
        let row2 = new MessageActionRow()
            .addComponent(button3)
            .addComponent(button4)
        let row3 = new MessageActionRow()
            .addComponent(button5)

        message.channel.send('test_text', { components: [ row, row2, row3 ] }).then(msg => {
            msg.components.forEach(element => {
                element.components.forEach(e => {
                    console.log(e.custom_id)
                })
            })
        })
    } 
}