import React, { Component } from 'react';
import { Button, Flex, Icon, Steps } from 'antd-mobile';
import axios from 'axios';
import storage from '../../utils/storage';
import './style.scss';
import Router from '../../components/Router';

const Step = Steps.Step;

class BusList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            buses: [],
            lineNo: null,
            reverse: true,
            loading: false,
            errMsg: ''
        }
    }

    componentDidMount() {
        this.fetchAndIntervalBusInfo();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.router.params.reverse !== nextProps.router.params.reverse) {
            this.fetchAndIntervalBusInfo();
        }
    }

    componentWillUnmount() {
        clearInterval(this.fetchBusInfoInterval);
    }

    fetchAndIntervalBusInfo = () => {
        this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval);
        this.fetchBusInfo();
        this.fetchBusInfoInterval = setInterval(() => this.fetchBusInfo(false), 15000);
    }

    fetchBusInfo = (isLoading = true) => {
        const { lineNo, reverse } = this.props.router.params;
        const { loading } = this.state;
        
        if (!lineNo) {
            this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval);
        }

        if (isLoading === true) {
            if (loading) return;
            this.setState({ loading: true });
        }

        axios.get('/bus/info', { params: { lineNo, direction: Number(reverse) } })
            .then(response => {
                const jsonr = response.data.jsonr;
                const busInfo = jsonr.data;
                if (jsonr.errmsg) {
                    return 'lineError';
                }

                const history = (storage.get('history') || []).filter((item) => item.lineNo !== lineNo);

                console.log('history.unshif', history)

                history.unshift({
                    lineNo,
                    reverse
                });

                storage.set('history', history);

                this.setState({
                    stations: busInfo.stations,
                    targetOrder: busInfo.targetOrder,
                    buses: busInfo.buses,
                    loading: false
                })
            })
            .catch((error) => {
                console.error(error);
                alert('路线错误');
                this.setState({
                    loading: false
                });
                this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval)
            });
    }

    reverse = () => {
        const { lineNo, reverse } = this.props.router.params;
        Router.replace(`/BusList/${lineNo}/${!reverse}`);
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

    render() {
        const { stations, loading } = this.state;
        return (
            <section>
                {
                    loading
                        ?
                        <Flex justify="center" style={{ marginTop: '15%' }}>
                            <Icon type="loading" size="lg"/>
                        </Flex>
                        :
                        <Steps size="small" status="process" current={-1}>
                            {
                                stations.map((item, idx) => {
                                    return (
                                        <Step
                                            key={item.order}
                                            icon={<span>{idx + 1}</span>}
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
                            bottom: '30%'
                        }}
                        type="primary" size="small" inline>反向</Button>
                }
            </section>
        );
    }
}

export default BusList;
