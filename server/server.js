const http = require('http');

function createServer (port, routers, options) {
    const server = http.createServer((req, res) => {
        console.log('[path]', req.url);
        const path = req.url.split('?')[0];
        if (path.indexOf('/static') > -1) {
            return routers['/static'](req, res);
        }

        try {
            routers[path] ? routers[path](req, res) : options.notFound(req, res);
        } catch (e) {
            console.error(`[${req.url} ERROR]`, e);
        }
    });

    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

module.exports = createServer;