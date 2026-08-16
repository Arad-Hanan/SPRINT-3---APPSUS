const { Link } = ReactRouterDOM

export function NotePreview({ note }) {
    let txtToShow = ''

    switch (note.type) {
        case 'NoteTxt':
            txtToShow = note.info.txt
            break
        case 'NoteImg':
            txtToShow = `someday I'll make images`
            break
        case 'NoteTodos':
            txtToShow = note.info.title
            break
    }

    return (
        <span> {txtToShow}</span>
    )
}