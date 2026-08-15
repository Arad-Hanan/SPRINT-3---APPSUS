import { mailService } from '../services/mail.service.js'

const { Link } = ReactRouterDOM

export function MailPreview({ mail }) {

    const senderName = _getSenderName(mail.from)

    return (
        <Link to={`/mail/${mail.id}`} className="mail-preview">
            <span className="mail-sender" title={mail.from}>{senderName}</span>

            <span className="mail-content">
                <span className="mail-subject">{mail.subject}</span>
                <span className="mail-body-preview"> - {mail.body}</span>
            </span>

            <span className="mail-date">{mailService.getMailDateStr(mail.sentAt)}</span>
        </Link>
    )
}

function _getSenderName(email) {
    const name = email.split('@')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
}