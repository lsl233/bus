import React, { Component } from 'react';
import { WingBlank, WhiteSpace, SearchBar } from 'antd-mobile';
import Router from './components/Router';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lineNo: (() => {
                const hash = window.location.hash.substring(1);
                if (hash.indexOf('/BusList') === 0) {
                    const sp = hash.split('/');
                    return sp[sp.length - 1];
                }
                return '';
            })()
        }
    }

    render() {
        const { lineNo } = this.state;
        return (
            <div>
                <SearchBar
                    placeholder="请输入公交车线路"
                    maxLength={8}
                    value={lineNo}
                    onChange={(lineNo) => this.setState({ lineNo })}
                    onSubmit={(lineNo) => Router.go(`/BusList/${lineNo}`)}
                    onFocus={() => Router.go(`/History`)}
                />
                <WhiteSpace size="lg"/>
                <WingBlank size="lg">
                    <Router/>
                </WingBlank>
            </div>
        );
    }
}

export default App;
