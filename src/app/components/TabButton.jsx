import React from 'react'

const TabButton = ({ active, selectTab, content }) => {
    const buttonClasses = active ? 'text-[var(--foreground)] border-b border-purple-500' : 'text-[var(--muted)]';
    return (
        <button onClick={selectTab}>
            <p className={`mr-3 font-semibold hover:text-[var(--foreground)] ${buttonClasses}`}>
                {content}
            </p>
        </button>
    )
}

export default TabButton
