import { utilService } from '../../../services/util.service.js'
import { noteColors } from './note.color.js'

// Demo data

export const demoNotes = [
    {
        id: 'n101',
        createdAt: 1112222,
        type: 'NoteTxt',
        isPinned: true,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
        },
        info: {
            txt: 'Fullstack Me Baby!'
        }
    },
    {
        id: 'n102',
        createdAt: 1113003,
        type: 'NoteVid',
        isPinned: false,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
        },
        info: {
            title: `Some video...`,
            url: 'https://www.youtube.com/watch?v=syrDx15PHCs'
        }
    },
    {
        id: 'n103',
        createdAt: 1112223,
        type: 'NoteImg',
        isPinned: false,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
        },
        info: {
            url: 'http://some-img/me',
            title: 'Bobi and Me'
        }
    },
    {
        id: 'n104',
        createdAt: 1112224,
        type: 'NoteTodos',
        isPinned: false,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
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
        id: 'n105',
        createdAt: 1113000,
        type: 'NoteTxt',
        isPinned: true,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
        },
        info: {
            txt: utilService.makeLorem(8)
        }
    },
    {
        id: 'n106',
        createdAt: 1113003,
        type: 'NoteVid',
        isPinned: false,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
        },
        info: {
            title: `What do to do with broken video URL?`,
            url: `https://can't_load_I'm_broke.vidSite.gov`
        }
    },
    {
        id: 'n107',
        createdAt: 1113001,
        type: 'NoteTxt',
        isPinned: false,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
        },
        info: {
            txt: utilService.makeLorem(4)
        }
    },
    {
        id: 'n108',
        createdAt: 1113002,
        type: 'NoteTodos',
        isPinned: true,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
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
    {
        id: 'n109',
        createdAt: 1113003,
        type: 'NoteImg',
        isPinned: true,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
        },
        info: {
            title: `Who doesn't love random images?`,
            url: 'https://picsum.photos/200/100?random=1'
        }
    },
    {
        id: 'n110',
        createdAt: 1113003,
        type: 'NoteImg',
        isPinned: false,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
        },
        info: {
            title: `Who doesn't love another random image?`,
            url: 'https://picsum.photos/200/100?random=2'
        }
    },
    {
        id: 'n111',
        createdAt: 1113003,
        type: 'NoteVid',
        isPinned: true,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
        },
        info: {
            title: `Some music...`,
            url: 'https://www.youtube.com/watch?v=_ccyA6T5Ioc'
        }
    },
    {
        id: 'n112',
        createdAt: 1113003,
        type: 'NoteVid',
        isPinned: false,
        style: {
            backgroundColor: noteColors[utilService.getRandomIntInclusive(0, noteColors.length - 1)]
        },
        info: {
            title: `Who are those guys?`,
            url: 'https://www.youtube.com/watch?v=VjXOwUnJzA0&list=PLSMETuURtTXD2erJYuYtXH16d1_73FOny&index=11'
        }
    },
    // {},
    // {},
    // {},
    // {},
]
