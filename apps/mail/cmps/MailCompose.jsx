import { mailService } from '../services/mail.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

const { useState } = React

export function MailCompose({ onClose, onSent }) {

    const [mailToSend, setMailToSend] = useState(() => mailService.getEmptyMail())
    const [isSending, setIsSending] = useState(false)

    function handleChange({ target }) {
        const { name, value } = target
        setMailToSend(prevMail => ({ ...prevMail, [name]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
        if (!mailToSend.to.trim()) {
            showErrorMsg('Please add a recipient')
            return
        }

        setIsSending(true)
        mailService.save({ ...mailToSend, sentAt: Date.now() })
            .then(() => {
                showSuccessMsg('Message sent')
                onSent()
            })
            .catch(err => {
                console.log('Had issues sending mail:', err)
                showErrorMsg('Could not send message')
                setIsSending(false)
            })
    }

    return (
        <section className="mail-compose">
            <header className="compose-header">
                <h2>New Message</h2>
                <button type="button" className="btn-close" onClick={onClose} title="Close">
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
