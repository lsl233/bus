import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import currentBusInfoReducer from '../reducers/currentBusInfoReducer';

const middleware = [];
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger())
}

const store = createStore(currentBusInfoReducer, applyMiddleware(...middleware));
export default store;