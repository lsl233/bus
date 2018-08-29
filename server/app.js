const createServer = require('./server');
const routers = require('./routers');

createServer(3001, routers, {
    notFound: (req, res) => {
        res.statusCode = 404;
        res.end();
    }
});

