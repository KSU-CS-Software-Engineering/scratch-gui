const getBlocks = function (vm) {
    return (vm.runtime.targets[1].blocks._blocks);
};

export {getBlocks};
