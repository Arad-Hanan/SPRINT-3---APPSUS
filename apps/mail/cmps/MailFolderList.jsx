const { NavLink } = ReactRouterDOM

const FOLDERS = [
    { path: 'inbox', label: 'Inbox', icon: '📥' },
    { path: 'sent', label: 'Sent', icon: '➤' },
    { path: 'draft', label: 'Draft', icon: '✎' },
    { path: 'trash', label: 'Trash', icon: '🗑' },
]

export function MailFolderList({ unreadCount }) {

    return (
        <nav className="mail-folder-list">
            {FOLDERS.map(({ path, label, icon }) =>
                <NavLink
                    key={path}
                    to={`/mail/${path}`}
                    className={({ isActive }) => isActive ? 'folder active' : 'folder'}>

                    <span className="btn-icon">{icon}</span>
                    <span className="folder-label">{label}</span>

                    {path === 'inbox' && unreadCount > 0 &&
                        <span className="unread-count">{unreadCount}</span>}
                </NavLink>
            )}
        </nav>
    )
}
