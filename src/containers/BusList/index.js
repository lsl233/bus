import React, { Component } from 'react';
import { Button, Flex, Icon, Steps } from 'antd-mobile';
import axios from 'axios';
import storage from '../../utils/storage';

const Step = Steps.Step;

class BusList extends Component {

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
                const history = storage.get('history') || [];
                const idx = history.indexOf(lineNo);
                if (idx > -1) {
                    history.splice(idx, 1);
                }
                history.unshift(lineNo);
                storage.set('history', history);

                this.setState({
                    stations: busInfo.stations,
                    targetOrder: busInfo.targetOrder,
                    buses: busInfo.buses,
                    loading: false
                })
            })
            .catch((error) => this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval));
    }

    reverse = () => {
        this.setState({ reverse: !this.state.reverse }, this.fetchAndIntervalBusInfo);
    }

    render() {
        const { stations, loading } = this.state;
        return (
            <section>
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
            </section>
        );
    }
}

export default BusList;
