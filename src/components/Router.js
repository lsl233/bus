import React, { Component } from 'react';
import pathToRegexp from 'path-to-regexp';
import History from '../containers/History';
import BusList from '../containers/BusList';
import SearchBar from '../containers/SearchBar';

export default class Router extends Component {
    static defaultProps = {
        routers: [
            {
                path: '/History',
                component: History
            },
            {
                path: '/BusList/:lineNo/:reverse',
                component: BusList
            }
        ],
        indexRouter: 'History'
    }

    static currentParams = {}

    constructor(props) {
        super(props);
        const { hash } = this.splitUrl();
        const { Current, params } = this.handleHashChange();
        this.state = {
            Current,
            params,
        }
    }

    componentDidMount() {
        window.addEventListener('hashchange', this.handleHashChange, false);
        // this.handleHashChange();
        window.addEventListener('load', this.handleHashChange, false)
    }

    splitUrl = () => {
        const [hash, query] = window.location.hash.substring(1).split('?');
        return {
            hash: hash || this.props.indexRouter,
            query
        };
    };

    handleHashChange = () => {
        const { routers, indexRouter } = this.props;
        let params = {};
        const { hash } = this.splitUrl();
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
                        let value = values[index];
                        try {
                            value = JSON.parse(values[index]);
                        } catch(error) {}
                        memo[key.name] = value;
                        return memo;
                    }, {});
                    component = route.component;
                }
            }
        }
        Router.currentParams = params;
        this.setState({ Current: component, params });
        return { Current: component, params }
    }

    static go = (path) => {
        window.location.hash = `${path}`;
    }

    static replace = (path) => {
        window.location.replace(`/#${path}`);
    }

    render() {
        const { Current, params } = this.state;
        console.log('params', params)
        return (
            <section>
                <SearchBar
                    router={{
                        go: Router.go,
                        replace: Router.replace,
                        params
                    }}
                >
                    {
                        Current
                        &&
                        <Current />
                    }
                </SearchBar>
            </section>
        )
    }
}