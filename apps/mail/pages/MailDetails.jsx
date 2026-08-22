import { mailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

export function MailDetails() {

    const [mail, setMail] = useState(null)
    const { folder, mailId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadMail()
    }, [mailId])

    function loadMail() {
        mailService.getById(mailId)
            .then(mail => {
                if (mail.isRead) return setMail(mail)

                const readMail = { ...mail, isRead: true }
                setMail(readMail)
                mailService.save(readMail)
            })
            .catch(err => {
                console.log('Had issues loading mail:', err)
                navigate(`/mail/${folder}`)
            })
    }

    function onBack() {
        navigate(`/mail/${folder}`)
    }

    function onMarkAsUnread() {
        mailService.save({ ...mail, isRead: false })
            .then(onBack)
            .catch(err => {
                console.log('Had issues updating mail:', err)
                showErrorMsg('Could not update the mail')
            })
    }

    function sendToNote(mail) {
        const subject = mail.subject || 'No title'
        const body = mail.body || 'No content'
        const txt = `${subject}\n\n${body}`

        navigate(`/noteEdit/new?txt=${encodeURIComponent(txt)}`)
    }

    function onRemoveMail() {
        const isPermanent = (folder === 'trash')

        const removePrm = isPermanent
            ? mailService.remove(mail.id)
            : mailService.save({ ...mail, removedAt: Date.now() })

        removePrm
            .then(() => {
                showSuccessMsg(isPermanent ? 'Mail deleted forever' : 'Mail moved to trash')
                onBack()
            })
            .catch(err => {
                console.log('Had issues removing mail:', err)
                showErrorMsg('Could not remove the mail')
            })
    }

    if (!mail) return <div className="mail-loading">Loading...</div>

    const sentAtStr = new Date(mailService.getMailTime(mail)).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })

    return (
        <section className="mail-details">
            <div className="mail-details-toolbar">
                <button className="btn-back" onClick={onBack}>
                    <span className="btn-icon">←</span>
                    <span>Back to {folder}</span>
                </button>

                <div className="mail-details-actions">
                    <button onClick={onMarkAsUnread} title="Mark as unread">
                        <span className="btn-icon">✉</span>
                        <span>Mark unread</span>
                    </button>

                    <button onClick={() => sendToNote(mail)}> Send to Note </button>
                    <button onClick={onRemoveMail} title={(folder === 'trash') ? 'Delete forever' : 'Delete'}>
                        <span className="btn-icon">🗑</span>
                        <span>{(folder === 'trash') ? 'Delete forever' : 'Delete'}</span>
                    </button>
                </div>
            </div>

            <h1 className="mail-details-subject">{mail.subject || '(no subject)'}</h1>

            <header className="mail-details-header">
                <div className="mail-details-from">
                    <span className="sender-name">{_getSenderName(mail.from)}</span>
                    <span className="sender-email">&lt;{mail.from}&gt;</span>
                </div>
                <span className="mail-details-date">{sentAtStr}</span>
            </header>

            <p className="mail-details-to">to {mail.to || '(no recipient)'}</p>

            <article className="mail-details-body">{mail.body}</article>
        </section>
    )
}

function _getSenderName(email) {
    const name = email.split('@')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
}
