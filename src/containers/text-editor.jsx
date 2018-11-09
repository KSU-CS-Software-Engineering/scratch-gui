import React from 'react';
import TextEditorComponent from '../components/text-editor/text-editor.jsx';

class TextEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            blocks: null
        };
    }

    render () {
        const {vm} = this.props;

        return (
            <TextEditorComponent vm={vm} />
        );
    }
}

export default TextEditor;
