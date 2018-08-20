import React, { Component } from 'react';
import { WingBlank, WhiteSpace, SearchBar } from 'antd-mobile';
import Router from './components/Router';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lineNo: ''
        }
    }

    componentDidMount() {
        window.addEventListener('hashchange', this.getLineNo, false);
        window.addEventListener('load', this.getLineNo, false)
    }

    getLineNo = () => {
        const hash = window.location.hash.substring(1);
        if (hash.indexOf('/BusList') === 0) {
            const sp = hash.split('/');
            this.setState({lineNo: sp[sp.length - 1]});
            return;
        }
        this.setState({lineNo: ''});
        return;
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
