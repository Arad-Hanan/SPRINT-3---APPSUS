import { NotePreview } from './NotePreview.jsx'
import { noteColors } from '../services/note.color.js'

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

const palette = [...new Set(noteColors)]

export function NoteList({ notes, onRemoveNote, onPinClick, onEditClick, onColorChange }) {

	const navigate = useNavigate()
	const [openPaletteId, setOpenPaletteId] = useState(null)

	useEffect(() => {
		if (!openPaletteId) return

		function closePalette() {
			setOpenPaletteId(null)
		}

		document.addEventListener('click', closePalette)
		return () => document.removeEventListener('click', closePalette)
	}, [openPaletteId])

	if (!notes.length) return <div className="no-notes">No notes saved</div>

	function sendToMail(note) {
		const subject = note.info.title || 'No subject'
		const body = note.info.txt || note.info.url || note.info.todos.map(todo => todo.txt).join('\n') || 'No content'
		navigate(`/mail/inbox?compose=new&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
	}

	function onTogglePalette(ev, noteId) {
		ev.stopPropagation()
		setOpenPaletteId(prevId => prevId === noteId ? null : noteId)
	}

	function onPickColor(noteId, color) {
		onColorChange(noteId, color)
		setOpenPaletteId(null)
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
				<button title="Change color"
					onClick={ev => onTogglePalette(ev, note.id)}
				>🎨</button>
				<button
					title="Send as mail"
					onClick={() => sendToMail(note)}
				>📧</button>
				<button title="Delete"
					onClick={() => onRemoveNote(note.id)}>🗑️</button>
			</div>

			{openPaletteId === note.id && (
				<div className="note-palette" onClick={ev => ev.stopPropagation()}>
					{palette.map(color => (
						<button key={color}
							type="button"
							title={color}
							className={`palette-swatch${note.style.backgroundColor === color ? ' selected' : ''}`}
							style={{ backgroundColor: color }}
							onClick={() => onPickColor(note.id, color)} />
					))}
				</div>
			)}
		</div>
	))
}
