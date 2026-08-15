import { mailService } from '../services/mail.service.js'

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
                setMail(mail)
                if (!mail.isRead) mailService.save({ ...mail, isRead: true })
            })
            .catch(err => {
                console.log('Had issues loading mail:', err)
                navigate('/mail')
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
            <button className="btn-back" onClick={() => navigate('/mail')} title="Back to inbox">
                <i className="fa-solid fa-arrow-left"></i>
            </button>

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
