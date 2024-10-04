const User = require('../models/User')
const Note = require('../models/Note')

// @desc Get all Notes
// @route GET /notes
// @access Private
const getAllNotes = async (req, res) => {
    // const notes = await Note.find()
    //     .populate({
    //         path: 'user',
    //         select: 'username -_id' // include username exclude id
    //     })
    //     .lean()
    //     .exec()
    const notes = await Note.find().lean()

    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
}

// @desc Create new Note
// @route POST /notes
// @access Private
const createNewNote = async (req, res) => {
    const { user, title, text, completed } = req.body // extract from req.body

    // Roles must be an array with length > 0
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    const note = await Note.create({ user, title, text, completed })

    if (note) { //created 
        res.status(201).json({ message: `New note created` })
    } else {
        res.status(400).json({ message: 'Invalid note data received' })
    }
}

// @desc Update a Note
// @route PATCH /notes
// @access Private
const updateNote = async (req, res) => {
    const { id, user, title, text, completed } = req.body

    // Confirm data 
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const note = await Note.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json(`'${updatedNote.title}' updated`)
}

// @desc Delete a Note
// @route DELETE /notes
// @access Private
const deleteNote = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID Required' })
    }

    const note = await Note.findById(id).exec()
    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    result = await note.deleteOne()

    const reply = `Note '${note.title}' with ID ${note._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}