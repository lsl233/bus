import React, { Component } from 'react';
import { Button, Flex, Icon, Steps } from 'antd-mobile';
import axios from 'axios';
import storage from '../../utils/storage';
import location from '../../utils/location';
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
        location.getCurrentPosition().then((position) => {
            alert(JSON.stringify(position))
        })
    }

    componentWillUnmount() {
        clearInterval(this.fetchBusInfoInterval);
    }

    fetchAndIntervalBusInfo = () => {
        this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval);
        this.fetchBusInfo();
        this.fetchBusInfoInterval = setInterval(() => this.fetchBusInfo(false), 10000);
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
                const { stations, buses, errmsg } = response.data;
                if (errmsg && !stations.legnth) {
                    return 'lineError';
                }

                const history = (storage.get('history') || []).filter((item) => item.lineNo !== lineNo);

                history.unshift({
                    lineNo,
                    reverse
                });

                storage.set('history', history);

                this.setState({
                    stations,
                    buses,
                    loading: false
                })
            })
            .catch((error) => {
                console.error('[get /bus/info]', error);
                alert('路线错误');
                Router.replace(`/History`);
                this.setState({
                    loading: false
                });
                this.fetchBusInfoInterval && clearInterval(this.fetchBusInfoInterval)
            });
    }

    reverse = () => {
        const { lineNo, reverse } = this.props.router.params;
        this.props.router.params.reverse = !reverse;
        Router.replace(`/BusList/${lineNo}/${!reverse}`);
        this.fetchAndIntervalBusInfo();
    }

    getStationsNum = (station) => {
        const { buses } = this.state;
        let num = 0;
        for (const bus of buses) {
            if (bus.order === station.order) {
                num++;
            }
        }
        return num
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
                                    const num = this.getStationsNum(item);
                                    return (
                                        <Step
                                            key={item.order}
                                            icon={<span>{idx + 1}</span>}
                                            status={ num && 'finish'}
                                            title={(<span>{item.sn}<span style={{ marginLeft: 8, color: '#108ee9' }}>{num > 0 ? ('* ' + num) : ''}</span></span>)} />
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
