import { NotePreview } from './NotePreview.jsx'

const { useState, useEffect } = React

export function NoteList({ notes, onRemoveNote }) {

	if (!notes.length) return <div className="no-notes">No notes saved</div>

	return notes.map(note => (
		<div key={note.id}
			className={`note ${note.type}${note.isPinned ? ' pinned' : ''}`}
			style={{ backgroundColor: `${note.style.backgroundColor}` }} >

			<span className="pinned_note">{note.isPinned ? 'Pinned' : ''}</span>
			<NotePreview note={note} />

			<div className="note_btn">
				<button>Edit</button>
				<button>Color</button>
				<button>Copy</button>
				<button>Text2Mail</button>
				<button onClick={() => onRemoveNote(note.id)}>X</button>
			</div>
		</div>
	))
}