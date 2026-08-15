import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails }) {

    if (!mails.length) return <div className="mail-list-empty">No mails to show</div>

    return (
        <ul className="mail-list">
            {mails.map(mail =>
                <li key={mail.id} className={`mail-row ${mail.isRead ? 'is-read' : 'is-unread'}`}>
                    <MailPreview mail={mail} />
                </li>
            )}
        </ul>
    )
}