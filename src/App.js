import React, {Component} from 'react';
import {Steps, WingBlank, WhiteSpace, SearchBar, Button, Flex, Icon} from 'antd-mobile';
import axios from 'axios';

const Step = Steps.Step;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            buses: [],
            lineNo: null,
            reverse: 1,
            loading: false,
        }
    }

    componentDidMount() {
        console.log(navigator)
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
            this.setState({loading: true});
        }

        axios.get('/bus/info', {params: { lineNo, direction: Number(reverse) }})
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

    isOnStations = (station) => {
        const { buses } = this.state;
        let isOnStations = false;
        for (const bus of buses) {
            if (bus.order === station.order) {
                isOnStations = true;
            }
        }
        return isOnStations
    }

    searchOnSubmit = (value) => {
        this.setState({ lineNo: value }, this.fetchAndIntervalBusInfo);
    }

    reverse = () => {
        this.setState({ reverse: !this.state.reverse }, this.fetchAndIntervalBusInfo);
    }

    render() {
        const { stations, loading } = this.state;
        return (
            <div className="App">
                <SearchBar
                    placeholder="请输入公交车线路"
                    maxLength={8}
                    onSubmit={this.searchOnSubmit}
                />
                <WhiteSpace size="lg" />
                <WingBlank size="lg" onClick={this.reverse}>
                    {
                        loading
                            ?
                            <Flex justify="center" style={{marginTop: '15%'}}>
                                <Icon type="loading" size="lg"/>
                            </Flex>
                            :
                            <Steps size="small" status="process" current={-1}>
                                {
                                    stations.map((item, idx) => {
                                        return (
                                            <Step
                                                key={item.order}
                                                icon={<span>{idx}</span>}
                                                status={this.isOnStations(item) && 'finish'}
                                                title={item.sn}/>
                                        )
                                    })
                                }
                            </Steps>
                    }
                    {
                        stations.length > 0 &&
                        <Button
                            onClick={this.reverse}
                            style={{
                                position: 'fixed',
                                right: 8,
                                bottom: 40
                            }}
                            type="primary" size="small" inline>反向</Button>
                    }
                </WingBlank>
            </div>
        );
    }
}

export default App;
