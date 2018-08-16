import React, { Component } from 'react';
import { Icon, Flex } from 'antd-mobile';
import './style.scss';

export default class History extends Component {
    render() {
        return (
            <ul>
                <li>
                    <Flex justify="between" align="center">
                        <span>185</span><Icon type="cross" />
                    </Flex>
                </li>
                <li>
                    <Flex justify="between" align="center">
                        <span>185</span><Icon type="cross" />
                    </Flex>
                </li>
                <li>
                    <Flex justify="between" align="center">
                        <span>185</span><Icon type="cross" />
                    </Flex>
                </li>
            </ul>
        )
    }
}