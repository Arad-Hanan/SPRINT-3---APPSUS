import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemoveNote, onPinClick, onEditClick }) {

	if (!notes.length) return <div className="no-notes">No notes saved</div>

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
				{note.type === 'NoteTxt' && <button
					title="Send as mail"
					// onClick="TBD"
				>📧</button>}
				<button title="Delete"
					onClick={() => onRemoveNote(note.id)}>🗑️</button>
			</div>
		</div>
	))
}