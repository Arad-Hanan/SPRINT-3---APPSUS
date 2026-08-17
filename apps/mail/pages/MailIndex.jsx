import { mailService } from '../services/mail.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'

const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [unreadCount, setUnreadCount] = useState(0)
    const [filterBy] = useState(mailService.getDefaultFilter())
    const [searchParams, setSearchParams] = useSearchParams()

    const isComposeOpen = searchParams.get('compose') !== null

    useEffect(() => {
        loadMails()
    }, [filterBy])

    function loadMails() {
        mailService.query(filterBy)
            .then(setMails)
            .catch(err => console.log('Had issues loading mails:', err))

        mailService.getUnreadCount()
            .then(setUnreadCount)
            .catch(err => console.log('Had issues counting unread mails:', err))
    }

    function onOpenCompose() {
        setSearchParams({ compose: 'new' })
    }

    function onCloseCompose() {
        setSearchParams({})
    }

    function onMailSent() {
        onCloseCompose()
        loadMails()
    }

    if (!mails) return <div className="mail-loading">Loading...</div>

    return (
        <section className="mail-index">
            <header className="mail-index-header">
                <button className="btn-compose" onClick={onOpenCompose}>
                    <i className="fa-solid fa-pen"></i>
                    Compose
                </button>

                <h2 className="inbox-title">
                    Inbox
                    {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
                </h2>
            </header>

            <MailList mails={mails} />

            {isComposeOpen && <MailCompose onClose={onCloseCompose} onSent={onMailSent} />}
        </section>
    )
}
