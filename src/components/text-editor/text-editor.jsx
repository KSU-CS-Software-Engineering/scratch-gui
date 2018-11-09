import React from 'react';
import {injectIntl} from 'react-intl';

const printCurrentBlocks = vm => {
    if (vm.runtime.targets[1]) {
        if (Object.keys(vm.runtime.targets[1].blocks._blocks).length > 0) {
            const blocks = vm.runtime.targets[1].blocks._blocks;

            Object.entries(blocks).forEach(
                ([key, object]) => console.log(key, object)
            );
            
            return (
                <div>
                    {'Blocks'}
                </div>
            );
        }
    }
    return (
        <div>
            {'No Blocks'}
        </div>
    );
};

const TextEditor = props => (
    <div>
        {printCurrentBlocks(props.vm)}
    </div>
);

export default injectIntl(TextEditor);
