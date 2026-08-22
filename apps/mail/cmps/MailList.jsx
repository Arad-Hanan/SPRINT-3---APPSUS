import { MailPreview } from './MailPreview.jsx'

export function MailList({ mails, folder, onToggleRead, onRemoveMail }) {

    if (!mails.length) return <div className="mail-list-empty">No mails to show</div>

    return (
        <ul className="mail-list">
            {mails.map(mail =>
                <li key={mail.id} className={`mail-row ${mail.isRead ? 'is-read' : 'is-unread'}`}>
                    <MailPreview mail={mail} folder={folder} />

                    <div className="mail-actions">
                        <button
                            onClick={() => onToggleRead(mail)}
                            title={mail.isRead ? 'Mark as unread' : 'Mark as read'}>
                            <span className="btn-icon">{mail.isRead ? '✉' : '✓'}</span>
                        </button>

                        <button
                            onClick={() => onRemoveMail(mail)}
                            title={(folder === 'trash') ? 'Delete forever' : 'Delete'}>
                            <span className="btn-icon">🗑</span>
                        </button>
                    </div>
                </li>
            )}
        </ul>
    )
}
