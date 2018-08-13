import React, {Component} from 'react';
import {Steps, WingBlank, WhiteSpace, SearchBar, Button} from 'antd-mobile';
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
        }
    }

    componentDidMount() {
        console.log(navigator)
    }

    fetchAndIntervalBusInfo = () => {
        this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval);
        this.fetchBusInfo();
        this.fetchBusInfoInterval = setInterval(() => this.fetchBusInfo(), 15000);
    }

    fetchBusInfo = () => {
        const { reverse, lineNo } = this.state;
        if (!lineNo) {
            this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval);
        }
        axios.get('/bus/info', {params: { lineNo, direction: Number(reverse) }})
            .then(response => {
                const busInfo = response.data.jsonr.data;
                console.log(busInfo);
                this.setState({
                    stations: busInfo.stations,
                    targetOrder: busInfo.targetOrder,
                    buses: busInfo.buses
                })
            })
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
        const { stations } = this.state;
        return (
            <div className="App">
                <SearchBar
                    placeholder="Search"
                    maxLength={8}
                    onSubmit={this.searchOnSubmit}
                />
                <WhiteSpace size="lg" />
                <WingBlank size="lg" onClick={this.reverse}>
                    <Steps size="small" status="process" current={-1} style={{
                        width: '60%'
                    }}>
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
                    <Button
                        onClick={this.reverse}
                        style={{
                            position: 'fixed',
                            right: 8,
                            bottom: 8
                        }}
                        type="primary" size="small" inline>反向</Button>
                </WingBlank>
            </div>
        );
    }
}

export default App;
