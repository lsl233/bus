import React, { Component } from 'react';
import { WingBlank, WhiteSpace, SearchBar } from 'antd-mobile';
import axios from 'axios';
import Router from './components/Router';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    fetchAndIntervalBusInfo = () => {
        this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval);
        this.fetchBusInfo();
        this.fetchBusInfoInterval = setInterval(() => this.fetchBusInfo(false), 15000);
    }

    fetchBusInfo = (isLoading = true) => {
        const { reverse, lineNo, loading } = this.state;
        if (!lineNo) {
            this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval);
        }
        if (isLoading === true) {
            if (loading) return;
            this.setState({ loading: true });
        }

        axios.get('/bus/info', { params: { lineNo, direction: Number(reverse) } })
            .then(response => {
                const busInfo = response.data.jsonr.data;
                console.log(busInfo);
                this.setState({
                    stations: busInfo.stations,
                    targetOrder: busInfo.targetOrder,
                    buses: busInfo.buses,
                    loading: false
                })
            })
            .catch((error) => alert(JSON.stringify(error)));
    }

    searchOnSubmit = (value) => {
        this.setState({ lineNo: value }, this.fetchAndIntervalBusInfo);
    }

    render() {
        return (
            <div>
                <SearchBar
                    placeholder="请输入公交车线路"
                    maxLength={8}
                    onSubmit={this.searchOnSubmit}
                />
                <WhiteSpace size="lg"/>
                <WingBlank size="lg">
                    <Router />
                </WingBlank>
            </div>
        );
    }
}

export default App;
