const { useState, useRef } = React

export function MailFilter({ filterBy, onSetFilterBy }) {

    const [txt, setTxt] = useState(filterBy.txt)
    const timeoutIdRef = useRef()

    function onTxtChange({ target }) {
        const { value } = target
        setTxt(value)

        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = setTimeout(() => {
            onSetFilterBy(prevFilter => ({ ...prevFilter, txt: value }))
        }, 400)
    }

    function onSetIsRead({ target }) {
        const { value } = target
        const isRead = (value === '') ? null : (value === 'true')
        onSetFilterBy(prevFilter => ({ ...prevFilter, isRead }))
    }

    const selectedValue = (filterBy.isRead === null) ? '' : String(filterBy.isRead)

    return (
        <div className="mail-filter">
            <input
                type="search"
                placeholder="Search mail"
                value={txt}
                onChange={onTxtChange}
            />

            <label>
                Show
                <select value={selectedValue} onChange={onSetIsRead}>
                    <option value="">All</option>
                    <option value="false">Unread</option>
                    <option value="true">Read</option>
                </select>
            </label>
        </div>
    )
}
