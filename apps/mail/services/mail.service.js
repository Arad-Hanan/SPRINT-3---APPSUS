import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'

const MAIL_KEY = 'mailDB'

export const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus',
}

export const mailService = {
    query,
    getById,
    save,
    remove,
    getUnreadCount,
    getEmptyMail,
    getDefaultFilter,
    getMailDateStr,
    getMailTime,
    loggedinUser,
}

_createMails()

function query(filterBy = getDefaultFilter()) {
    return storageService.query(MAIL_KEY).then(mails => {
        let mailsToShow = _filterByStatus(mails, filterBy.status)

        if (filterBy.isRead !== null && filterBy.isRead !== undefined) {
            mailsToShow = mailsToShow.filter(mail => mail.isRead === filterBy.isRead)
        }

        if (filterBy.txt) {
            const txt = filterBy.txt.toLowerCase()
            mailsToShow = mailsToShow.filter(mail =>
                mail.subject.toLowerCase().includes(txt) ||
                mail.body.toLowerCase().includes(txt) ||
                mail.from.toLowerCase().includes(txt) ||
                mail.to.toLowerCase().includes(txt)
            )
        }

        const sortDir = filterBy.sortDir || -1
        if (filterBy.sortBy === 'subject') {
            mailsToShow.sort((mail1, mail2) => mail1.subject.localeCompare(mail2.subject) * sortDir)
        } else {
            mailsToShow.sort((mail1, mail2) => (getMailTime(mail1) - getMailTime(mail2)) * sortDir)
        }

        return mailsToShow
    })
}

function getById(mailId) {
    return storageService.get(MAIL_KEY, mailId)
}

function save(mail) {
    if (mail.id) return storageService.put(MAIL_KEY, mail)
    return storageService.post(MAIL_KEY, mail)
}

function remove(mailId) {
    return storageService.remove(MAIL_KEY, mailId)
}

function getUnreadCount() {
    return query({ status: 'inbox' })
        .then(mails => mails.filter(mail => !mail.isRead).length)
}

function getEmptyMail({ to = '', subject = '', body = '' } = {}) {
    return {
        createdAt: Date.now(),
        subject,
        body,
        isRead: true,
        sentAt: null,
        removedAt: null,
        from: loggedinUser.email,
        to,
    }
}

function getDefaultFilter() {
    return { txt: '', isRead: null, sortBy: 'date', sortDir: -1 }
}

function getMailTime(mail) {
    return mail.sentAt || mail.createdAt
}

function _filterByStatus(mails, status) {
    switch (status) {
        case 'inbox':
            return mails.filter(mail => !mail.removedAt && mail.sentAt && mail.to === loggedinUser.email)
        case 'sent':
            return mails.filter(mail => !mail.removedAt && mail.sentAt && mail.from === loggedinUser.email)
        case 'draft':
            return mails.filter(mail => !mail.removedAt && !mail.sentAt && mail.from === loggedinUser.email)
        case 'trash':
            return mails.filter(mail => mail.removedAt)
        default:
            return mails.filter(mail => !mail.removedAt)
    }
}

function getMailDateStr(timestamp) {
    const mailDate = new Date(timestamp)
    const now = new Date()

    const isToday = mailDate.toDateString() === now.toDateString()
    if (isToday) {
        return mailDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }

    const isThisYear = mailDate.getFullYear() === now.getFullYear()
    if (isThisYear) {
        return mailDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return mailDate.toLocaleDateString('en-US')
}

function _createMails() {
    let mails = utilService.loadFromStorage(MAIL_KEY)
    if (mails && mails.length) return

    const DAY = 1000 * 60 * 60 * 24
    const now = Date.now()

    mails = [
        _createMail({
            subject: 'Your package is out for delivery',
            body: 'Good news! Your order #4417-B is on the truck and should arrive today between 14:00 and 18:00. You can follow the courier live from the tracking page.',
            isRead: false,
            sentAt: now - 1000 * 60 * 25,
            from: 'shipping@quickpost.com',
            to: loggedinUser.email,
        }),
        _createMail({
            subject: 'Miss you!',
            body: 'Would love to catch up sometimes. It has been way too long since the last time we sat down for a proper coffee. Are you free this weekend?',
            isRead: false,
            sentAt: now - 1000 * 60 * 60 * 5,
            from: 'momo@momo.com',
            to: loggedinUser.email,
        }),
        _createMail({
            subject: 'Sprint 3 kickoff - please read',
            body: 'Hey team, the new sprint starts on Sunday. Make sure your branches are pushed and that everyone reviewed the requirements document before the kickoff meeting.',
            isRead: false,
            sentAt: now - DAY,
            from: 'coding@academy.com',
            to: loggedinUser.email,
        }),
        _createMail({
            subject: 'Security alert',
            body: 'Your account was just signed in to from a new Windows device. If this was you, you can safely ignore this email. If not, we strongly recommend changing your password.',
            isRead: true,
            sentAt: now - DAY * 2,
            from: 'no-reply@accounts.com',
            to: loggedinUser.email,
        }),
        _createMail({
            subject: 'Say YES to a discount',
            body: 'Your friends, family and dreams are awaiting! Say yes to flying today and plan ahead. Here is 30% off all flights, only available today. Book your ticket now!',
            isRead: true,
            sentAt: now - DAY * 4,
            from: 'wizzair@gmail.com',
            to: loggedinUser.email,
        }),
        _createMail({
            subject: 'Let\'s go shopping',
            body: 'I found a great sale downtown, they have everything on our list and then some. Meet me at the entrance at 11:00, do not be late this time.',
            isRead: false,
            sentAt: now - DAY * 6,
            from: 'gal@pal.com',
            to: loggedinUser.email,
        }),
        _createMail({
            subject: 'The Politician Season 2 is now on Netflix',
            body: 'The wait is over. All episodes of the new season are available to stream right now. This message was mailed to you as part of your membership.',
            isRead: true,
            sentAt: now - DAY * 9,
            from: 'info@netflix.net',
            to: loggedinUser.email,
        }),
        _createMail({
            subject: 'Your invoice for August',
            body: 'Attached is your monthly invoice. The amount will be charged automatically to the payment method on file within three business days. No action is required.',
            isRead: true,
            sentAt: now - DAY * 15,
            from: 'billing@cloudhost.io',
            to: loggedinUser.email,
        }),
        _createMail({
            subject: 'Happy birthday!',
            body: 'Wishing you an amazing year ahead, full of good code and even better coffee. Let us celebrate properly when you have a free evening.',
            isRead: true,
            sentAt: now - DAY * 40,
            from: 'hero@momo.com',
            to: loggedinUser.email,
        }),
        _createMail({
            subject: 'Got your back bro',
            body: 'Whatever you decide about the job offer, you know I am with you on this one. Call me when you want to talk it through.',
            isRead: true,
            sentAt: now - DAY * 400,
            from: 'marco@polo.com',
            to: loggedinUser.email,
        }),
        _createMail({
            subject: 'Re: Sprint 3 kickoff',
            body: 'Thanks for the heads up, my branch is pushed and I went over the requirements. See you all on Sunday.',
            isRead: true,
            sentAt: now - DAY * 0.5,
            from: loggedinUser.email,
            to: 'coding@academy.com',
        }),
        _createMail({
            subject: 'Dinner on Thursday?',
            body: 'Are you around this Thursday? I was thinking we could try that new place near the office. Let me know and I will book a table.',
            isRead: true,
            sentAt: now - DAY * 3,
            from: loggedinUser.email,
            to: 'momo@momo.com',
        }),
    ]

    utilService.saveToStorage(MAIL_KEY, mails)
}

function _createMail({ subject, body, isRead, sentAt, from, to }) {
    return {
        id: utilService.makeId(),
        createdAt: sentAt,
        subject,
        body,
        isRead,
        sentAt,
        removedAt: null,
        from,
        to,
    }
}
