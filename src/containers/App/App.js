import React, { Component } from 'react';
import { WingBlank, WhiteSpace, SearchBar } from 'antd-mobile';
import Router from '../../components/Router';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lineNo: ''
        }
    }

    componentDidMount() {
        this.updateLineNo();
    }

    updateLineNo = () => {
        setTimeout(() => {
            this.setState({ lineNo: Router.currentParams.lineNo });
        }, 100);
    }

    render() {
        const { lineNo } = this.state;
        console.log(lineNo)
        return (
            <div>
                <SearchBar
                    placeholder="请输入公交车线路"
                    maxLength={8}
                    value={lineNo}
                    onChange={(lineNo) => this.setState({ lineNo })}
                    onSubmit={(lineNo) => Router.go(`/BusList/${lineNo}/${true}`)}
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
