export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

export const increment = (dispatch) => {
    return () => dispatch({
        type: INCREMENT,
    })
}

export const decrement = (counterCaption) => ({
    type: DECREMENT,
    counterCaption
})