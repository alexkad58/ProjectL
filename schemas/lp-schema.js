const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const lpSchema = mongoose.Schema({
    guildId: reqString,
    channels: { type: Object, required: true }
})

module.exports = mongoose.model('lp', lpSchema)