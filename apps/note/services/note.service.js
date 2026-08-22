import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'
import { demoNotes } from './note.demoData.js'
import { noteColors } from './note.color.js'

const NOTE_KEY = 'notesStorage'

export const noteService = {
    query,
    getById,
    save,
    remove,
    getEmptyNot
}

_createNotes()

function query(filterBy = {}) {
    return storageService.query(NOTE_KEY)
        .then(notes => {
            let notesToShow = [...notes]

            if (filterBy.onlyPinned) {
                notesToShow = notesToShow.filter(note => note.isPinned)
            }

            if (filterBy.type && filterBy.type !== 'all') {
                notesToShow = notesToShow.filter(note => note.type === filterBy.type)
            }

            if (filterBy.sortByDate) {
                const sortDir = filterBy.sortDir || 1
                notesToShow.sort((note1, note2) =>
                    (note1.createdAt - note2.createdAt) * sortDir)
            }

            return notesToShow
        })
}

function getById(noteId) {
    return storageService.get(NOTE_KEY, noteId)
}

function save(note) {
    if (note.id) return storageService.put(NOTE_KEY, note)
    return storageService.post(NOTE_KEY, note)
}

function remove(noteId) {
    return storageService.remove(NOTE_KEY, noteId)
}

function getEmptyNot({ createdAt = Date.now(), type, info }) {
    return {
        createdAt,
        type,
        isPinned: false,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
        },
        info
    }
}

function _createNotes() {
    let notes = utilService.loadFromStorage(NOTE_KEY)
    if (!notes || !notes.length) {
        notes = []
        notes = demoNotes.map(note => _createNote(note))

        utilService.saveToStorage(NOTE_KEY, notes)
    }
}

function _createNote({ id = utilService.makeId(), createdAt = Date.now(), type, isPinned, style, info }) {
    return {
        id,
        createdAt,
        type,
        isPinned,
        style: style ? style : { backgroundColor: '#00d' },
        info
    }
}