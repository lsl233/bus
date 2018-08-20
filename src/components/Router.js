import React, { Component } from 'react';
import pathToRegexp from "path-to-regexp";
import History from '../containers/History';
import BusList from '../containers/BusList';

export default class Router extends Component {
    static defaultProps = {
        routers: [
            {
                path: '/History',
                component: History
            },
            {
                path: '/BusList/:lineNo',
                component: BusList
            }
        ],
        indexRouter: 'History'

    }

    constructor(props) {
        super(props);
        this.state = {
            Current: this.props.routers[this.getLocationHash()],
            params: {},
        }
    }

    componentDidMount() {
        window.addEventListener('hashchange', this.handleHashChange, false);
        window.addEventListener('load', this.handleHashChange, false)
    }

    getLocationHash = () => {
        return window.location.hash.substring(1) || this.props.indexRouter;
    };

    handleHashChange = () => {
        const { routers, indexRouter } = this.props;
        let { params } = this.state;
        const hash = this.getLocationHash();
        let component;


        for (const route of routers) {
            if (route.path === indexRouter) {
                component = component = route.component;
            }
            if (route.path === hash) {
                component = route.component;
                break;
            } else {
                const keys = [];
                const re = pathToRegexp(route.path, keys);
                const match = re.exec(hash);

                if (match) {
                    const [, ...values] = match;
                    params = keys.reduce((memo, key, index) => {
                        memo[key.name] = values[index];
                        return memo;
                    }, {});
                    component = route.component;
                }
            }
        }
        this.setState({ Current: component, params });
    }

    static go = (routerName) => {
        window.location.hash = routerName
    }

    render() {
        const { Current, params } = this.state;
        return (
            <section>
                {
                    Current
                    &&
                    <Current router={{
                        go: Router.go,
                        params
                    }}/>
                }
            </section>
        )
    }
}