import { mailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

const { useState, useEffect, useRef } = React

const DRAFT_SAVE_INTERVAL = 5000

export function MailCompose({ draftId, subject, body, onClose, onSent }) {

    const [mailToSend, setMailToSend] = useState(() => mailService.getEmptyMail({
        subject: subject || '',
        body: body || '',
    }))
    const [isSending, setIsSending] = useState(false)

    const mailRef = useRef(mailToSend)
    const isSavingRef = useRef(false)
    const isSentRef = useRef(false)

    mailRef.current = mailToSend

    useEffect(() => {
        if (!draftId) return

        mailService.getById(draftId)
            .then(setMailToSend)
            .catch(err => console.log('Had issues loading the draft:', err))
    }, [draftId])

    useEffect(() => {
        const intervalId = setInterval(saveDraft, DRAFT_SAVE_INTERVAL)
        return () => clearInterval(intervalId)
    }, [])

    function saveDraft() {
        const mail = mailRef.current

        if (isSentRef.current || isSavingRef.current) return Promise.resolve()
        if (!mail.to && !mail.subject && !mail.body) return Promise.resolve()

        isSavingRef.current = true
        return mailService.save(mail)
            .then(savedMail => setMailToSend(prevMail => ({ ...prevMail, id: savedMail.id })))
            .catch(err => console.log('Had issues saving the draft:', err))
            .finally(() => isSavingRef.current = false)
    }

    function handleChange({ target }) {
        const { name, value } = target
        setMailToSend(prevMail => ({ ...prevMail, [name]: value }))
    }

    function onCloseCompose() {
        saveDraft().then(onClose)
    }

    function onSubmit(ev) {
        ev.preventDefault()
        if (!mailToSend.to.trim()) {
            showErrorMsg('Please add a recipient')
            return
        }

        setIsSending(true)
        isSentRef.current = true

        mailService.save({ ...mailToSend, sentAt: Date.now() })
            .then(() => {
                showSuccessMsg('Message sent')
                onSent()
            })
            .catch(err => {
                console.log('Had issues sending mail:', err)
                showErrorMsg('Could not send message')
                isSentRef.current = false
                setIsSending(false)
            })
    }

    return (
        <section className="mail-compose">
            <header className="compose-header">
                <h2>{draftId ? 'Draft' : 'New Message'}</h2>
                <button type="button" className="btn-close" onClick={onCloseCompose} title="Close">
                    <span className="btn-icon">✕</span>
                </button>
            </header>

            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    name="to"
                    placeholder="To"
                    value={mailToSend.to}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={mailToSend.subject}
                    onChange={handleChange}
                />

                <textarea
                    name="body"
                    value={mailToSend.body}
                    onChange={handleChange}
                ></textarea>

                <button type="submit" className="btn-send" disabled={isSending}>
                    {isSending ? 'Sending...' : 'Send'}
                </button>
            </form>
        </section>
    )
}
