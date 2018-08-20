import React, { Component } from 'react';
import { Icon, Flex } from 'antd-mobile';
import storage from '../../utils/storage';
import './style.scss';

export default class History extends Component {
    constructor() {
        super();
        this.state = {
            history: (storage.get('history') || [])
        }
    }

    removeHistoryItem = (evt, lineNo) => {
        evt.stopPropagation();
        const history = this.state.history;
        const idx = history.indexOf(lineNo);
        if (idx > -1) {
            history.splice(idx, 1);
        }
        this.setState({ history });
        storage.set('history', history);
    }

    render() {
        const { history } = this.state;
        return (
            <ul>
                {
                    history.map((lineNo, key) => (
                        <li key={key}>
                            <Flex justify="between" align="center"
                                  onClick={() => this.props.router.go(`/BusList/${lineNo}`)}>
                                <span>{lineNo}路</span>
                                <Icon
                                    type="cross"
                                    onClick={(evt) => this.removeHistoryItem(evt, lineNo)}
                                />
                            </Flex>
                        </li>
                    ))
                }
            </ul>
        )
    }
}