import React, { useState } from 'react';
import '@/styles/global.css'; // Import your CSS file for styling

const Keyword = ({tags, setTags}) => {
  const [tagInput, setTagInput] = useState('');
//   const [tags, setTags] = useState([]);

  const handleInputChange = (event) => {
    setTagInput(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && tagInput.trim() !== '') {
        setTags([...tags, tagInput.trim()]);
        setTagInput('')
    }
  };

  const handleTagRemove = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  return (
    <div className="tag-input-container">
      <div className="tag-input">
        <label htmlFor="tagInput d-block">Blog Tags:</label>
        <input 
            className='form-control py-2'
            label=""
            id="pn3"
            placeholder=" Disabled Input"
            type="text"
            value={tagInput}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
        />
      </div>
      <div className="tag-list">
        {tags.map((tag, index) => (
          <div key={index} className="tag">
            {tag}
            <button className='' onClick={() => handleTagRemove(index)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyword;
