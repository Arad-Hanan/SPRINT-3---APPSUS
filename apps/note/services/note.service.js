import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'

import { demoNotes } from '../cmps/NoteList.jsx'

const NOTE_KEY = 'notesStorage'

export const noteService = {
    query,
    getById,
    save,
    remove
}

_createNotes()

function query() {
    return storageService.query(NOTE_KEY)
        .then(notes => {
            return notes
        })
        .catch()
}

function getById() { }

function save() { }

function remove() { }

function _createNotes() {
    let notes = utilService.loadFromStorage(NOTE_KEY)
    if (notes && notes.length) return

    notes = demoNotes.map(note => _createNote(note))

    utilService.saveToStorage(NOTE_KEY, notes)
}

function _createNote({ id, createdAt, type, isPinned, style, info }) {
    return {
        id: id ? id : makeId(),
        createdAt: createdAt ? createdAt : Date.now(),
        type,
        isPinned,
        style: style ? style : { backgroundColor: '#00d' },
        info
    }
}
