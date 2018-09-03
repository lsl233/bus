export const CHANGE_CURRENT_BUS_INFO_LINENO = 'CHANGE_CURRENT_BUS_INFO_LINENO';
export const CHANGE_CURRENT_BUS_INFO_REVERSE = 'CHANGE_CURRENT_BUS_INFO_REVERSE';

export const changeCurrentBusInfoLineNo = (lineNo) => ({
    type: CHANGE_CURRENT_BUS_INFO_LINENO,
    lineNo
})

export const changeCurrentBusInfoReverse = (reverse) => ({
    type: CHANGE_CURRENT_BUS_INFO_REVERSE
})