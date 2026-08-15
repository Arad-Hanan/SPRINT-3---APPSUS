import { mailService } from '../services/mail.service.js'
import { MailList } from '../cmps/MailList.jsx'

const { useState, useEffect } = React

export function MailIndex() {

    const [mails, setMails] = useState(null)
    const [filterBy] = useState(mailService.getDefaultFilter())

    useEffect(() => {
        loadMails()
    }, [filterBy])

    function loadMails() {
        mailService.query(filterBy)
            .then(setMails)
            .catch(err => console.log('Had issues loading mails:', err))
    }

    if (!mails) return <div className="mail-loading">Loading...</div>

    return (
        <section className="mail-index">
            <MailList mails={mails} />
        </section>
    )
}
