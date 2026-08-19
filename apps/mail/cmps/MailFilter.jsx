export function MailFilter({ filterBy, onSetFilterBy }) {

    function onSetIsRead({ target }) {
        const { value } = target
        const isRead = (value === '') ? null : (value === 'true')
        onSetFilterBy(prevFilter => ({ ...prevFilter, isRead }))
    }

    const selectedValue = (filterBy.isRead === null) ? '' : String(filterBy.isRead)

    return (
        <label className="mail-filter">
            Show
            <select value={selectedValue} onChange={onSetIsRead}>
                <option value="">All</option>
                <option value="false">Unread</option>
                <option value="true">Read</option>
            </select>
        </label>
    )
}
