import React, {Component} from 'react';
import {Steps, WingBlank, WhiteSpace, SearchBar} from 'antd-mobile';
import axios from 'axios';

const Step = Steps.Step;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            buses: [],
            lineNo: null,
        }
    }

    fetchAndIntervalBusInfo = (lineNo) => {
        this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval);
        this.fetchBusInfo(lineNo);
        this.fetchBusInfoInterval = setInterval(() => this.fetchBusInfo(lineNo), 5000);
    }

    fetchBusInfo = (lineNo) => {
        if (!lineNo) {
            this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval);
            return;
        }
        axios.get('/bus/info', {params: { lineNo }})
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

    searchOnChange = (value) => {
        this.setState({ lineNo: value });
    }

    searchOnSubmit = (evt) => {
        this.fetchAndIntervalBusInfo(evt);
    }

    render() {
        const { stations, lineNo } = this.state;
        return (
            <div className="App">
                <SearchBar
                    placeholder="Search"
                    maxLength={8}
                    value={lineNo}
                    onChange={this.searchOnChange}
                    onSubmit={this.searchOnSubmit}
                />
                <WhiteSpace size="lg" />
                <WingBlank size="lg">
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
                </WingBlank>
            </div>
        );
    }
}

export default App;
