const createServer = require('./server');
const routers = require('./routers');

createServer(8081, routers, {
    notFound: (req, res) => {
        res.statusCode = 404;
        res.end();
    }
});

