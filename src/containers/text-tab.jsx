import React from 'react';
import TextEditor from './text-editor.jsx';
import AssetPanel from '../components/asset-panel/asset-panel.jsx';

const onItemClick = () => {};
const selectedItemIndex = 0;

const TextTab = () => (
    <AssetPanel
        buttons={[]}
        items={[]}
        selectedItemIndex={selectedItemIndex}
        onItemClick={onItemClick}
    >
        <TextEditor />
    </AssetPanel>
);

export default TextTab;
