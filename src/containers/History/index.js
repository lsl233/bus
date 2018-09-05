import React, { Component } from 'react';
import { Icon, Flex } from 'antd-mobile';
import storage from '../../utils/storage';
import './style.scss';

export default class History extends Component {
    constructor() {
        super();
        let history = storage.get('history') || [];
        if (typeof history[0] !== 'object') {
            storage.clear();
            history = [];
        }
        this.state = {
            history
        }
    }

    removeHistoryItem = (evt, lineNo) => {
        evt.stopPropagation();
        const history = storage.get('history').filter((item) => item.lineNo !== lineNo);
        this.setState({ history });
        storage.set('history', history);
    }

    render() {
        const { history } = this.state;
        return (
            <ul>
                {
                    history.map((item, key) => (
                        <li key={key}>
                            <Flex justify="between" align="center"
                                onClick={() => this.props.router.go(`/BusList/${item.lineNo}/${item.reverse}`)}>
                                <span>{item.lineNo}路</span>
                                <Icon
                                    type="cross"
                                    onClick={(evt) => this.removeHistoryItem(evt, item.lineNo)}
                                />
                            </Flex>
                        </li>
                    ))
                }
            </ul>
        )
    }
}