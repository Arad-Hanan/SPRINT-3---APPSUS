import { mailService } from '../services/mail.service.js'
import { MailList } from '../cmps/MailList.jsx'
import { MailCompose } from '../cmps/MailCompose.jsx'
import { MailFilter } from '../cmps/MailFilter.jsx'
import { MailSort } from '../cmps/MailSort.jsx'
import { MailFolderList } from '../cmps/MailFolderList.jsx'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

const { useState, useEffect } = React
const { useSearchParams, useParams, useLocation, useMatch, Outlet } = ReactRouterDOM

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [unreadCount, setUnreadCount] = useState(0)
    const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter())
    const [searchParams, setSearchParams] = useSearchParams()

    const { folder } = useParams()
    const location = useLocation()
    const isDetailsOpen = useMatch('/mail/:folder/:mailId')

    const composeParam = searchParams.get('compose')
    const isComposeOpen = composeParam !== null
    const draftId = (composeParam && composeParam !== 'new') ? composeParam : null

    const composeSubject = searchParams.get('subject')
    const composeBody = searchParams.get('body')

    useEffect(() => {
        loadMails()
    }, [folder, filterBy, location.pathname])

    function loadMails() {
        mailService.query({ ...filterBy, status: folder })
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
        const isPermanent = (folder === 'trash')

        const removePrm = isPermanent
            ? mailService.remove(mail.id)
            : mailService.save({ ...mail, removedAt: Date.now() })

        removePrm
            .then(() => {
                showSuccessMsg(isPermanent ? 'Mail deleted forever' : 'Mail moved to trash')
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
        loadMails()
    }

    function onMailSent() {
        setSearchParams({})
        loadMails()
    }

    return (
        <section className="mail-index">
            <header className="mail-index-header">
                <button className="btn-compose" onClick={onOpenCompose}>
                    <span className="btn-icon">✎</span>
                    Compose
                </button>

                <MailFilter filterBy={filterBy} onSetFilterBy={setFilterBy} />

                <MailSort filterBy={filterBy} onSetFilterBy={setFilterBy} />
            </header>

            <div className="mail-body">
                <MailFolderList unreadCount={unreadCount} />

                <div className="mail-main">
                    {isDetailsOpen && <Outlet />}

                    {!isDetailsOpen && !mails && <div className="mail-loading">Loading...</div>}

                    {!isDetailsOpen && mails &&
                        <MailList
                            mails={mails}
                            folder={folder}
                            onToggleRead={onToggleRead}
                            onRemoveMail={onRemoveMail}
                        />}
                </div>
            </div>

            {isComposeOpen &&
                <MailCompose
                    draftId={draftId}
                    subject={composeSubject}
                    body={composeBody}
                    onClose={onCloseCompose}
                    onSent={onMailSent}
                />}
        </section>
    )
}
