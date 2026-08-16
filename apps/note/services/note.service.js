import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'

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

function getById(idx) {
    return storageService.get(NOTE_KEY, idx)
}

function save(note) {
    return storageService.put(NOTE_KEY, note)
}

function remove() { }

function _createNotes() {
    let notes = utilService.loadFromStorage(NOTE_KEY)
    if (notes && notes.length) return

    notes = demoNotes.map(note => _createNote(note))

    utilService.saveToStorage(NOTE_KEY, notes)
}

function _createNote({ id = makeId(), createdAt = Date.now(), type, isPinned, style, info }) {
    return {
        id,
        createdAt,
        type,
        isPinned,
        style: style ? style : { backgroundColor: '#00d' },
        info
    }
}

// Demo data

const demoNotes = [
    {
        id: 'n101',
        createdAt: 1112222,
        type: 'NoteTxt',
        isPinned: true,
        style: {
            backgroundColor: '#00d'
        },
        info: {
            txt: 'Fullstack Me Baby!'
        }
    },
    {
        id: 'n102',
        createdAt: 1112223,
        type: 'NoteImg',
        isPinned: false,
        style: {
            backgroundColor: '#0d0'
        },
        info: {
            url: 'http://some-img/me',
            title: 'Bobi and Me'
        }
    },
    {
        id: 'n103',
        createdAt: 1112224,
        type: 'NoteTodos',
        isPinned: false,
        style: {
            backgroundColor: '#d00'
        },
        info: {
            title: 'Get my stuff together',
            todos: [
                { txt: 'Driving license', isDone: true },
                { txt: 'Coding power', isDone: false }
            ]
        }
    },
    {
        id: 'n104',
        createdAt: 1112222,
        type: 'NoteTxt',
        isPinned: true,
        style: {
            backgroundColor: utilService.getRandomColor()
        },
        info: {
            txt: utilService.makeLorem(8)
        }
    },
    {
        id: 'n105',
        createdAt: 1112222,
        type: 'NoteTxt',
        isPinned: false,
        style: {
            backgroundColor: utilService.getRandomColor()
        },
        info: {
            txt: utilService.makeLorem(4)
        }
    },
    {
        id: 'n106',
        createdAt: 1112224,
        type: 'NoteTodos',
        isPinned: true,
        style: {
            backgroundColor: utilService.getRandomColor
        },
        info: {
            title: `Who doesn't like pointless lists?`,
            todos: [
                { txt: 'No one', isDone: true },
                { txt: 'Everyone', isDone: false },
                { txt: 'Someone', isDone: false },
                { txt: 'Anyone', isDone: true },
                { txt: 'Out of smartass pronouns... one', isDone: false }
            ]
        }
    },
    // {},
    // {},
    // {},
    // {}
]
