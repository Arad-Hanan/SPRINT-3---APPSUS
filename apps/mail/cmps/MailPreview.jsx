import { mailService } from '../services/mail.service.js'

const { Link } = ReactRouterDOM

export function MailPreview({ mail, folder }) {

    const isDraft = !mail.sentAt
    const showsRecipient = (folder === 'sent' || folder === 'draft')

    const address = showsRecipient ? mail.to : mail.from
    const addressName = address ? _getSenderName(address) : '(no recipient)'

    const linkTo = isDraft ? `?compose=${mail.id}` : `/mail/${folder}/${mail.id}`

    return (
        <Link to={linkTo} className="mail-preview">
            <span className="mail-sender" title={address}>{addressName}</span>

            <span className="mail-content">
                {isDraft && <span className="draft-tag">Draft</span>}
                <span className="mail-subject">{mail.subject || '(no subject)'}</span>
                <span className="mail-body-preview"> - {mail.body}</span>
            </span>

            <span className="mail-date">
                {mailService.getMailDateStr(mailService.getMailTime(mail))}
            </span>
        </Link>
    )
}

function _getSenderName(email) {
    const name = email.split('@')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
}
