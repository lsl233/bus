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

    render() {
        const { history } = this.state;
        return (
            <ul>
                {
                    history.map((name) => (
                        <li>
                            <Flex justify="between" align="center">
                                <span>{name}</span><Icon type="cross" />
                            </Flex>
                        </li>
                    ))
                }
            </ul>
        )
    }
}