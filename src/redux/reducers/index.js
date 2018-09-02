import { INCREMENT, DECREMENT } from '../actions';

const initState = {
    num: 1
}

export default (state = initState, action) => {
    const { counterCaption } = action;
    console.log('action', state, action);
    switch (action.type) {
        case INCREMENT:
            return { ...state, num: state.num + 1 };
        case DECREMENT:
            return { ...state, num: state.num - 1 };
        default:
            return state
    }
}