import React from 'react';
import TextEditor from './text-editor.jsx';
import AssetPanel from '../components/asset-panel/asset-panel.jsx';

const onItemClick = () => {};

const TextTab = () => (
    <AssetPanel
        buttons={[]}
        items={[]}
        onItemClick={onItemClick}
    >
        <TextEditor />
    </AssetPanel>
);

export default TextTab;
