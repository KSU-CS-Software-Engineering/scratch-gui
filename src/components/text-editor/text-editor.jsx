/**
 * Text editor file with monaco information.
 * For communication with scratch-text.js, look here:
 * https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages
 */
import React from 'react';
import {injectIntl} from 'react-intl';
import MonacoEditor from 'react-monaco-editor';
import styles from './text-editor.css';
// import LangDef from './scratch-text';
import PropTypes from 'prop-types';

class TextEditor extends React.Component {
    /**
     * Intializes the TextEditor class
     *
     * @param {PropTypes} props The props passed in to the TextEditor
     */
    constructor (props) {
        super(props);
        this.state = {
            blocks: {},
            newText: ''
        };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.editorWillMount = this.editorWillMount.bind(this);
    }

    /**
     * Updates the current set of blocks.  This is called after the VM is rendered and
     * there are changes to the blocks.
     *
     * @param {React.Props} prevProps The old props
     */
    componentDidUpdate (prevProps) {
        if (this.props.blocks !== prevProps.blocks) {
            this.updateBlocks(this.props.blocks);
        }
    }

    /**
     * Sets the current state of the blocks to the passed in blocks object.
     *
     * @param {object} blocks The object of blocks to update the current state to
     */
    updateBlocks (blocks) {
        this.setState({blocks});
    }

    editorWillMount (monaco) {
        monaco.languages.register({id: 'scratch-text'});
        monaco.languages.setMonarchTokensProvider('scratch-text', {
            tokenizer: {
                root: [
                    [/replace item .+ of .+ with .+/, 'data'],
                    [/variable .+/, 'variables'],
                    [/Turn .+ degrees right/, 'motion'],
                    [/when .+ clicked/, 'event'],
                    [/set .+ to .+/, 'data'],
                    [/repeat until .+/, 'control'],
                    [/say .+/, 'looks'],
                    [/.+ \+ .+/, 'operators'],
                    [/.+ < .+/, 'operators'],
                    [/.+ > .+/, 'operators']
                ]
            }
        });
        monaco.editor.defineTheme('ScratchTextTheme', {
            base: 'vs',
            inherit: false,
            rules: [
                {token: 'motion', foreground: '4c97ff'},
                {token: 'looks', foreground: '9966ff'},
                {token: 'sound', foreground: 'd65cd6'},
                {token: 'event', foreground: 'ffd500'},
                {token: 'control', foreground: 'ffab19'},
                {token: 'sensing', foreground: '4cbfe6'},
                {token: 'operators', foreground: '40bf4a', fontStyle: 'bold'},
                {token: 'variables', foreground: 'ff8c1a'},
                {token: 'my-blocks', foreground: 'ff6680'},
                {token: 'data', foreground: 'ff0000'}
            ]
        });
        monaco.languages.registerCompletionItemProvider('scratch-text', {
            provideCompletionItems: () => {
                const suggestions = [
                    {
                        label: 'simpleText',
                        kind: monaco.languages.CompletionItemKind.Text,
                        insertText: 'simpleText'
                    },
                    {
                        label: 'testing',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'testing(${1:condition})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'ifelse',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'If-Else Statement'
                    }
                ];
                return {suggestions: suggestions};
            }
        });
    }

    /**
     * Converts the current list of blocks into a text string
     *
     * @param {object} blocks The current list of blocks
     *
     * @returns {string} A string of the object of blocks converted to text.
     */
    displayBlocks (blocks) {
        // Defaults the text string ofblocks
        let blocksText = '';
        // Gets the number of blocks in the blocks object
        const blocksLength = Object.keys(blocks).length;
        // If there are blocks
        if (blocksLength > 0) {
            // For each block
            for (const blockKey in blocks) {
                // Get the current block
                const block = blocks[blockKey];
                // Check if the current block is a movesteps block
                if (block.opcode === 'motion_movesteps') {
                    // Get the input value of the steps to move
                    const inputValue = block.inputs.STEPS[1][1];
                    // Add the proper outputted string to the blocks text with the input value
                    blocksText += `Move (${inputValue}) steps\n`;
                    // If the block is a turnright block
                } else if (block.opcode === 'motion_turnright') {
                    // Get the input value
                    const inputValue = block.inputs.DEGREES[1][1];
                    // Add the properly formatted string to the string of converted blocks
                    blocksText += `Turn (${inputValue}) degrees right\n`;
                }
            }
        }
        // Return the formatted string of blocks
        return blocksText;
    }

    /**
     * Checks for expressions in the monaco editor, and if found converts the strings into blocks
     * and updates the VM to contain the newly created blocks.
     *
     * @param {string} newValue The updated value whenever something new is typed in monaco
     */
    handleOnChange (newValue) {
        // The RegEx for moving steps. ex. Move (10) steps
        const moveStepsRegEx = /^Move\s\([0-9]+\)\ssteps$/g;
        // The RegEx for turning right. ex. Turn (15) degress right
        const turnRightRegEx = /^Turn\s\([[0-9]+\)\sdegrees\sright$/g;
        // If the text matches the move steps expected format
        if (moveStepsRegEx.test(newValue)) {
            // Get the number of steps
            const numSteps = newValue.split(/[()]/)[1];
            // Manually create the block with the number of steps
            const block = {
                fields: {},
                inputs: {
                    STEPS: [1, [4, numSteps]]
                },
                next: null,
                opcode: 'motion_movesteps',
                parent: null,
                shadow: false,
                topLevel: true,
                x: 100,
                y: -745
            };
            // Add the block to the VM
            this.props.addBlock(block);
            // Otherwise if the new string matches the turn right format
        } else if (turnRightRegEx.test(newValue)) {
            // Get the number of degrees to turn
            const degrees = newValue.split(/[()]/)[1];
            // Manually create the block
            const block = {
                fields: {},
                inputs: {
                    DEGREES: [1, [4, degrees]]
                },
                next: null,
                opcode: 'motion_turnright',
                parent: null,
                shadow: false,
                topLevel: true,
                x: 100,
                y: -945
            };
            // And add the block to the VM
            this.props.addBlock(block);
        }
    }

    render () {
        // Gets the current list of blocks in the state
        const {blocks} = this.state;
        // Converts the current list of blocks into a formatted string
        const blocksText = this.displayBlocks(blocks);

        const options = {automaticLayout: true};
        // Create the monaco editor passing in the converted string of blocks to be defaulted
        return (
            <div
                className={styles.editorContainer}
                // id="container"
            >
                <MonacoEditor
                    editorWillMount={this.editorWillMount}
                    height="100%"
                    language="scratch-text"
                    options={options}
                    theme="ScratchTextTheme"
                    value={blocksText}
                    width="100%"
                    onChange={this.handleOnChange}
                />
            </div>
        );
    }
}

TextEditor.propTypes = {
    addBlock: PropTypes.func,
    blocks: PropTypes.object
};

export default injectIntl(TextEditor);
