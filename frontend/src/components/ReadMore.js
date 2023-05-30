import React, { useState } from "react";

const ReadMore = ({ filter, text, highlightable }) => {
    const [showMore, setShowMore] = useState(true);

    const toggleReadMore = () => {
        setShowMore(!showMore);
    };

    const getHighlightedText = (text,) => {
        let searchQuery = filter.searchQuery;
        if (!searchQuery) {
            return text;
        }
        const parts = text.split(new RegExp(`(${searchQuery})`, 'i'));
        return <span> {parts.map((part, i) =>
            <span key={i} style={part.toLowerCase() === searchQuery.toLowerCase() ? { backgroundColor: '#fff44f' } : {}}>
                {part}
            </span>)
        } </span>;
    }

    if (!text) {
        return null;
    }

    if (!highlightable) {
        return (
            <p>
                {showMore ? text.slice(0, 300) + "..." : text}
                <span onClick={toggleReadMore} className="read-more-span">
                    {showMore ? "\nShow More" : "\nShow Less"}
                </span>
            </p>
        );
    }

    if (text.length >= 300) {
        return (
            <p>
                {showMore ? getHighlightedText(text.slice(0,300) + "...") : getHighlightedText(text)}
                <span onClick={toggleReadMore} className="read-more-span">
                    {showMore ? "\nShow More" : "\nShow Less"}
                </span>
            </p>
        );
    } else {
        return (
            <p>
                {getHighlightedText(text)}
            </p>
        );
    }
};

export default ReadMore;