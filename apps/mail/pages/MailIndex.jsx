import { mailService } from '../services/mail.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailSort } from '../cmps/MailSort.jsx'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

const { useState, useEffect } = React
const { useSearchParams } = ReactRouterDOM

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [unreadCount, setUnreadCount] = useState(0)
    const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter())
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

    function onToggleRead(mail) {
        mailService.save({ ...mail, isRead: !mail.isRead })
            .then(loadMails)
            .catch(err => {
                console.log('Had issues updating mail:', err)
                showErrorMsg('Could not update the mail')
            })
    }

    function onRemoveMail(mail) {
        mailService.save({ ...mail, removedAt: Date.now() })
            .then(() => {
                showSuccessMsg('Mail moved to trash')
                loadMails()
            })
            .catch(err => {
                console.log('Had issues removing mail:', err)
                showErrorMsg('Could not remove the mail')
            })
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
                    <span className="btn-icon">✎</span>
                    Compose
                </button>

                <h2 className="inbox-title">
                    Inbox
                    {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
                </h2>

                <MailFilter filterBy={filterBy} onSetFilterBy={setFilterBy} />

                <MailSort filterBy={filterBy} onSetFilterBy={setFilterBy} />
            </header>

            <MailList
                mails={mails}
                onToggleRead={onToggleRead}
                onRemoveMail={onRemoveMail}
            />

            {isComposeOpen && <MailCompose onClose={onCloseCompose} onSent={onMailSent} />}
        </section>
    )
}
