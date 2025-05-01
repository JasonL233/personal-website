import React from 'react'

const TabButton = ({ active, selectTab, content }) => {
    const buttonClasses = active ? 'text-black border-b border-purple-500' : 'text-[#333333]';
    return (
        <button onClick={selectTab}>
            <p className={`mr-3 font-semibold hover:text-black ${buttonClasses}`}>
                {content}
            </p>
        </button>
    )
}

export default TabButton
