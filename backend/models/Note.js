const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User' // fkey to User id
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true // gives created at / updated at timestamps
    }
)

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',    // Field name to increment
    id: 'ticketNums',       // stored sequence counter
    start_seq: 500          // Starting value for the sequence
})

module.exports = mongoose.model('Note', noteSchema)