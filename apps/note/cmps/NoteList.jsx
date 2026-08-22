import { NotePreview } from './NotePreview.jsx'

const { useNavigate } = ReactRouterDOM

export function NoteList({ notes, onRemoveNote, onPinClick, onEditClick }) {

	const navigate = useNavigate()

	if (!notes.length) return <div className="no-notes">No notes saved</div>

	function sendToMail(note) {
		const subject = note.info.title || 'No subject'
		const body = note.info.txt || note.info.url || note.info.todos.map(todo => todo.txt).join('\n') || 'No content'
		navigate(`/mail/inbox?compose=new&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
	}

	return notes.map(note => (
		<div key={note.id}
			className={`note ${note.type}`}
			style={{ backgroundColor: `${note.style.backgroundColor}` }} >

			<span className={`pinned_note${note.isPinned ? '' : ' greyedPin'}`}
				onClick={() => onPinClick(note.id)}>📌
			</span>

			<NotePreview note={note} />

			<div className="note_btn">
				<button title="Edit note"
					onClick={() => onEditClick(note.id)}
				>📝</button>
				<button title="Change color">🎨</button>
				<button
					title="Send as mail"
					onClick={() => sendToMail(note)}
				>📧</button>
				<button title="Delete"
					onClick={() => onRemoveNote(note.id)}>🗑️</button>
			</div>
		</div>
	))
}