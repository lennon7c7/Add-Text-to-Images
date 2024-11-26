const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var util = require('util');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const port = 31041;
const host = util.format('http://127.0.0.1:%s/', port);

/**
 * 延迟执行
 * @param s 秒
 * @returns {Promise<unknown>}
 */
function wait(s) {
    return new Promise(resolve => setTimeout(() => resolve(), s * 1000));
}

function nowString() {
    let oDate = new Date(), oYear = oDate.getFullYear(), oMonth = oDate.getMonth() + 1, oDay = oDate.getDate(),
        oHour = oDate.getHours(), oMin = oDate.getMinutes(), oSec = oDate.getSeconds();
    return oYear + '' + setZeroFill(oMonth) + '' + setZeroFill(oDay) + '' + setZeroFill(oHour) + '' + setZeroFill(oMin) + '' + setZeroFill(oSec);
}

function setZeroFill(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }

    return num;
}

/**
 * @param page
 * @param {string} url
 */
async function pageResp(page, url) {
    return await page.evaluate(async (url) => {
        return await fetch(url)
            .then((response) => response.text())
            .then((result) => {
                return result
            })
            .catch((error) => console.error(error))
    }, url);
}

async function pageFlow(flows) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();
        let frame
        let resp = 'ok'

        await page.setViewport({
            width: 1365,
            height: 937,
            deviceScaleFactor: 1,
        });

        // 如果目录 flows.filename 不存在，则创建
        if (!fs.existsSync(flows.filename)) {
            fs.mkdirSync(flows.filename);
        }
        // flows.domains 去掉头、尾空格
        let domains = flows.domains.trim();
        // flows.domains 以换行分割成数组
        domains = domains.replaceAll('\r', '');
        domains = domains.split('\n');

        for (var i = 0, len = domains.length; i < len; i++) {
            let dirname = `${flows.filename}/${domains[i]}`
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname);
            }

            let newUrl

            newUrl = host + `facebook-ad-manage1/index.html?fakeSiteUrl=${domains[i]}&backgroundImgSn=${i}`
            await page.goto(newUrl);
            await page.screenshot({
                path: `${dirname}/1.png`,
            });

            newUrl = host + `facebook-ad-manage2/index.html?fakeSiteUrl=${domains[i]}&backgroundImgSn=${i}`
            await page.goto(newUrl);
            await page.screenshot({
                path: `${dirname}/2.png`,
            });

            newUrl = host + `facebook-ad-manage3/index.html?fakeSiteUrl=${domains[i]}&backgroundImgSn=${i}`
            await page.goto(newUrl);
            await page.screenshot({
                path: `${dirname}/3.png`,
            });
        }

        await browser.close();
        console.debug('end')

        return resp
    } catch (e) {
        console.error(e)
        return e
    }
}

// Start function
const start = async function () {
    app.post('/puppeteer/flow', function (req, res) {
        (async () => {
            let resp = await pageFlow(req.body);
            res.send(resp);
        })();
    });

    // 监听
    app.listen(port);

    console.log("host: %s", host);

}

// Call start
start();
