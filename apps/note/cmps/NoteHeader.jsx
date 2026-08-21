export function NoteHeader() {
    return <h4 className="note_header">
        <div className="new_note_input">
            <p>New Note?</p>
            <input></input>
        </div>

        <div className="note_srt_containter">
            <button>Pinned</button>
            <button>Type</button>
        </div>
    </h4>
}