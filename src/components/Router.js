import React, { Component } from 'react';
import History from '../containers/History';
import BusList from '../containers/BusList';

export default class Router extends Component {
    static defaultProps = {
        routers: {
            History,
            BusList
        },
        indexRouter: 'History'
    }

    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            Current: this.props.routers[this.getLocationHash()]
        }
    }

    componentDidMount() {
        window.addEventListener('hashchange', this.handleHashChange, false);
    }

    getLocationHash = () => {
        return window.location.hash.substring(1) || this.props.indexRouter;
    };

    handleHashChange = () => {
        const dom = this.props.routers[this.getLocationHash()];
        this.setState({ Current: dom });
    }

    go = (routerName) => {
        window.location.hash = routerName
    }

    render() {
        const { Current } = this.state;
        return (
            <section>
                <Current router={{
                    go: this.go,
                }} />
            </section>
        )
    }
}