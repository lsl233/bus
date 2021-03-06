const axios = require('axios');
const nodeUrl = require('url');
const querystring = require('querystring');
const fs = require('fs');
const nodePath = require('path');

function getLineId(lineNo) {
    const lineType = lineNo[lineNo.length - 1];
    if (lineType.toLowerCase() === 'a') return 1;
    return 0;
}

const routers = {
    '/static': (req, res) => {
        let path = nodePath.resolve('./build' + req.url);
        if (req.url === '/static' || req.url === '/') {
            res.setHeader('Content-Type', 'text/html');
            path = nodePath.resolve('./build/index.html');
        }

        if (req.url.indexOf('/js') > -1) {
            res.setHeader('Content-Type', 'application/x-javascript');
        }

        if (req.url.indexOf('/js') > -1) {
            res.setHeader('Content-Type', 'text/css');
        }

        try {
            const html = fs.readFileSync(path, 'utf-8');
            res.end(html);
        } catch (e) {
            res.statusCode = 404;
            res.end();
        }
    },
    '/service-worker.js': (req, res) => {
        const path = nodePath.resolve('./build/service-worker.js');
        const javascript = fs.readFileSync(path, 'utf-8');
        res.end(javascript);
    },
    '/bus/info': (req, res) => {
        const baseUrl = `https://api.chelaile.net.cn/bus/line!lineDetail.action?&mac=&userId=&userAgent=Mozilla/5.0%20(iPhone;%20CPU%20iPhone%20OS%2011_4_1%20like%20Mac%20OS%20X)%20AppleWebKit/605.1.15%20(KHTML,%20like%20Gecko)%20Mobile/15G77&vc=10580&sv=11.4.1&cityState=0&pushkey=&screenWidth=750&gpstype=wgs&imsi=46001&geo_lac=65.000000&gpsAccuracy=65.000000&stats_act=enter&deviceType=iPhone10,1&lng=104.094767&idfa=EB323C98-E313-44B1-9C21-3C85E9196F62&idfv=CEA70A3C-B457-42EF-B59A-44675A62DAD9&screenHeight=1334&cityId=007&stats_order=1-1&sign=atOa0pSYHB1oNRC9TSXqvQ==&stats_referer=searchHistory&s=IOS&dpi=2&lat=30.560730&wifi_open=1&push_open=0&v=5.53.0&geo_type=wgs&nw=WiFi&language=1&vendor=apple&lchsrc=icon&udid=d0e303cd36e26cb23c9f1366b73bbda09c9032dc`;
        const query = nodeUrl.parse(`http://${req.url}`).query;
        const param = querystring.parse(query);

        let url = `${baseUrl}&direction=${param.direction}&lineName=${param.lineNo}&lineNo=${param.lineNo}`;

        if (/\d+([a-z]|[A-Z])$/.test(param.lineNo)) {
            url = `${baseUrl}&direction=${param.direction}&lineId=028-${param.lineNo.substr(0, param.lineNo.length - 1)}-${getLineId(param.lineNo)}&geo_lat=30.560730&geo_lng=104.094767`
        }

        axios.get(url)
            .then((response) => {
                const data = JSON.parse(response.data.replace('**YGKJ', '').replace('YGKJ##', ''));
                const { stations, buses, errmsg } = data.jsonr.data
                const busInfo = JSON.stringify({
                    stations, buses, errmsg
                });
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/json;charset=utf-8');
                res.setHeader('Access-Control-Allow-Origin','*');
                res.end(busInfo);
            })
    }
};

module.exports = routers;