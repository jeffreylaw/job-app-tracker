import React, { useState } from "react";
  
const JobDescription = ({ children }) => {
  const text = children;
  const [showMore, setShowMore] = useState(true);
  const toggleReadMore = () => {
    setShowMore(!showMore);
  };

  if (!text) {
      return null;
  }

  return (
    <p>
      {showMore ? text.slice(0, 400) + "..." : text}
      <span onClick={toggleReadMore} className="read-more-span">
        {showMore ? "\nShow More" : "\nShow Less"}
      </span>
    </p>
  );
};
  
export default JobDescription;