import { CHANGE_CURRENT_BUS_INFO_LINENO, CHANGE_CURRENT_BUS_INFO_REVERSE } from '../actions/currentBusInfoAction';

const initState = {
    lineNo: '',
    reverse: true
}

export default (state = initState, action) => {
    switch (action.type) {
        case CHANGE_CURRENT_BUS_INFO_LINENO:
            const { lineNo } = action;
            return { ...state, lineNo };
        case CHANGE_CURRENT_BUS_INFO_REVERSE:
            return { ...state, reverse: !state.reverse };
        default:
            return state;
    }
}