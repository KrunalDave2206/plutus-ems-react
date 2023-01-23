import React, {useState, useRef} from 'react';
import JidiEditor from  'jodit-react';
import './joditeditor.scss';
const TextEditor = (props) => {
    const editor = useRef(null);
    const [content, setContent] = useState('')
    return (
        <>
            <JidiEditor 
                ref={editor} 
                tabIndex={1} 
                onBlur={newContent => setContent(newContent)} 
                value={content} 
                onChange={content => {props.setValue(content)}} 
                config={props.config}
            />
        </>
    )
}

export default TextEditor;