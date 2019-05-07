/**
 * Text editor file with monaco information.
 * For communication with scratch-text.js, look here:
 * https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages
 */
import React from 'react';
import {injectIntl} from 'react-intl';
import MonacoEditor from 'react-monaco-editor';
// import LangDef from './scratch-text';
import styles from './text-editor.css';

const options = {
    automaticLayout: true
};

class TextEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            blocks: {}
        };
    }


    componentDidUpdate (prevProps) {
        if (this.props.blocks !== prevProps.blocks) {
            this.setState({blocks: this.props.blocks});
        }
    }

    editorWillMount (monaco) {
        monaco.languages.register({id: 'scratch-text'});
        // // monaco.languages.setMonarchTokensProvider('scratch-text', LangDef());
        monaco.languages.setMonarchTokensProvider('scratch-text', {
            tokenizer: {
                root: [
                    // Stuck here
                    // Add all tokenizers, as created by the LangDef function
                    // in the 'scratch-text.js' file
                    // e.g.
                    [/replace item .+ of .+ with .+/, 'data'],
                    [/play sound .+ until done/, 'sound'],
                    [/stop all sounds/, 'sound'],
                    [/set .+ effect to .+/, 'sound'],
                    [/change .+ effect by .+/, 'sound'],
                    [/clear sound effects/, 'sound'],
                    [/pitch/, 'sound'],
                    [/pan left\/right/, 'sound'],
                    [/change volume by .+/, 'sound'],
                    [/set volume to .+%/, 'sound'],
                    [/.+ \+ .+/, 'operator']
                    // how to populate all elements here?
                ]
            }
        });
        monaco.editor.defineTheme('ScratchTextTheme', {
            base: 'vs',
            inherit: false,
            rules: [
                {token: 'sound', foreground: 'cf63cf'},
                {token: 'data', foreground: 'ff0000', fontStyle: 'bold'},
                {token: 'operator', foreground: '00ff00'}
            ]
        });
        monaco.languages.registerCompletionItemProvider('scratch-text', {provideCompletionItems: () => {
            const suggestions = [{
                label: 'simpleText',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'simpleText'
            }, {
                label: 'testing',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'testing(${1:condition})',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            }, {
                label: 'ifelse',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                    'if (${1:condition}) {',
                    '\t$0',
                    '} else {',
                    '\t',
                    '}'
                ].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'If-Else Statement'
            }];
            return {suggestions: suggestions};
        }});
        // monaco.editor.create(document.getElementById('container'), {
        //     theme: 'ScratchTextTheme',
        //     value: [],
        //     language: 'scratch-text'
        // });
    }

    displayBlocks (blocks) {
        let blocksText = '';
        const blocksLength = Object.keys(blocks).length;
        if (blocksLength > 0) {
            for (const blockKey in blocks) {
                const block = blocks[blockKey];
                if (block.opcode === 'motion_movesteps') {
                    const inputValue = block.inputs.STEPS[1][1];
                    blocksText += `Move (${inputValue}) steps\n`;
                } else if (block.opcode === 'motion_turnright') {
                    const inputValue = block.inputs.DEGREES[1][1];
                    blocksText += `Turn (${inputValue}) degrees right\n`;
                }
            }
        }
        return blocksText;
    }

    render () {
        const {blocks} = this.state;
        const blocksText = this.displayBlocks(blocks);

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

                />
            </div>
        );
    }
}

export default injectIntl(TextEditor);
