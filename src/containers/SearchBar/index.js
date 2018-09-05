import React, { Component } from 'react';
import { WingBlank, WhiteSpace, SearchBar as Search } from 'antd-mobile';
import Router from '../../components/Router';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineNo: props.router.params.lineNo || ''
        }
    }

    componentDidMount() {
        // this.updateLineNo();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.router.params.lineNo && this.props.router.params.lineNo !== nextProps.router.params.lineNo) {
            
            this.setState({ lineNo: nextProps.router.params.lineNo});
        }
    }

    updateLineNo = () => {
        setTimeout(() => {
            this.setState({ lineNo: Router.currentParams.lineNo });
        }, 100);
    }

    render() {
        const { lineNo } = this.state;
        const { children, router } = this.props;
        console.log('children11', lineNo)
        return (
            <div>
                <Search
                    placeholder="请输入公交车线路"
                    maxLength={8}
                    value={lineNo.toString()}
                    onChange={(lineNo) => this.setState({ lineNo })}
                    onSubmit={(lineNo) => Router.go(`/BusList/${lineNo}/${true}`)}
                    onFocus={() => Router.go(`/History`)}
                />
                <WhiteSpace size="lg" />
                <WingBlank size="lg">
                    {children && React.cloneElement(children, {...this.props})}
                </WingBlank>
            </div>
        );
    }
}

export default SearchBar;
