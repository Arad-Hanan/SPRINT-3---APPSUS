import { mailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

export function MailDetails() {

    const [mail, setMail] = useState(null)
    const { mailId } = useParams()
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
                navigate('/mail')
            })
    }

    function onMarkAsUnread() {
        mailService.save({ ...mail, isRead: false })
            .then(() => navigate('/mail'))
            .catch(err => {
                console.log('Had issues updating mail:', err)
                showErrorMsg('Could not update the mail')
            })
    }

    function onRemoveMail() {
        mailService.save({ ...mail, removedAt: Date.now() })
            .then(() => {
                showSuccessMsg('Mail moved to trash')
                navigate('/mail')
            })
            .catch(err => {
                console.log('Had issues removing mail:', err)
                showErrorMsg('Could not remove the mail')
            })
    }

    if (!mail) return <div className="mail-loading">Loading...</div>

    const sentAtStr = new Date(mail.sentAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })

    return (
        <section className="mail-details">
            <div className="mail-details-toolbar">
                <button className="btn-back" onClick={() => navigate('/mail')}>
                    <span className="btn-icon">←</span>
                    <span>Back to inbox</span>
                </button>

                <div className="mail-details-actions">
                    <button onClick={onMarkAsUnread} title="Mark as unread">
                        <span className="btn-icon">✉</span>
                        <span>Mark unread</span>
                    </button>

                    <button onClick={onRemoveMail} title="Delete">
                        <span className="btn-icon">🗑</span>
                        <span>Delete</span>
                    </button>
                </div>
            </div>

            <h1 className="mail-details-subject">{mail.subject}</h1>

            <header className="mail-details-header">
                <div className="mail-details-from">
                    <span className="sender-name">{_getSenderName(mail.from)}</span>
                    <span className="sender-email">&lt;{mail.from}&gt;</span>
                </div>
                <span className="mail-details-date">{sentAtStr}</span>
            </header>

            <p className="mail-details-to">to {mail.to}</p>

            <article className="mail-details-body">{mail.body}</article>
        </section>
    )
}

function _getSenderName(email) {
    const name = email.split('@')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
}
