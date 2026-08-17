import { utilService } from '../../../services/util.service.js'

// Demo data

export const demoNotes = [
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
        createdAt: 1113000,
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
        createdAt: 1113001,
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
        createdAt: 1113002,
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
    {
        id: 'n107',
        createdAt: 1113003,
        type: 'NoteImg',
        isPinned: true,
        style: {
            backgroundColor: utilService.getRandomColor
        },
        info: {
            title: `Who doesn't love random images?`,
            url: 'https://picsum.photos/200/300?random=1'
        }
    },
    {
        id: 'n107',
        createdAt: 1113003,
        type: 'NoteImg',
        isPinned: false,
        style: {
            backgroundColor: utilService.getRandomColor
        },
        info: {
            title: `Who doesn't love another random image?`,
            url: 'https://picsum.photos/200/300?random=2'
        }
    },
    // {},
    // {}
]
