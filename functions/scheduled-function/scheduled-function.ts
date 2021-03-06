import { schedule } from '@netlify/functions';
import puppeteer from 'puppeteer';
import dayjs from 'dayjs';
import chromium from 'chrome-aws-lambda';

var parseDate = (date: string) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let [, d, m] = date.split(' ');

    const day = d.replace(/[a-z]/g, '');
    const year = '2022';
    const month = months.indexOf(m) + 1

    return dayjs(`${year}-${month}-${day}`);
};

const harvestData = (async () => {
    const browser = await puppeteer.launch({
        // devtools: true,
        // defaultViewport: { 'width': 2200, 'height': 1200 },
        // headless: false,
        //     '--no-sandbox',
        //     '--disable-setuid-sandbox',
        //     '--disable-dev-shm-usage',
        //     // '--start-fullscreen'
        // ],
        // ignoreDefaultArgs: ['--disable-extensions'],
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        // executablePath: '/opt/homebrew/bin/chromium',
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto('https://www.skysports.com/world-cup-fixtures');
    const data = await page.$eval('.fixres__body', el => {
        const data = [];
        el.children.forEach(v => {
            data.push(v.innerText);
        });

        return data;
    });
    browser.close();
    // await delay(9999999);

    // {
    //     date: '2022-11-21 10:00:00',
    //     homeTeam: 'Senegal',
    //     awayTeam: 'Netherlands',
    //     homeScore: 0,
    //     awayScore: 1,
    //     status: playing|played|not-played
    // }
    const games = [];
    data.forEach((v, i) => {
        // is match
        if (v.substring(0, 1) == '\t') {
            let date: dayjs.Dayjs;
            // find date
            let j = 1;
            while (true) {
                let d = data[i - (j++)];
                if (d.substring(0, 1) != '\t') {
                    date = parseDate(d);
                    break;
                }
            }

            const [, homeTeam, timeUnformatted, awayTeam] = v.split('\t');
            let time = timeUnformatted.replace('\n', '');
            let hour = time.substring(0, 2);
            let mins = parseInt(time.substring(3, 5));
            date = date.set('hour', hour).set('minute', mins);
            games.push({ date: date.toDate(), homeTeam, awayTeam, homeScore: 0, awayScore: 0, status: 'not-played' });
        }
    });

    console.log({ games });
});

// To learn about scheduled functions and supported cron extensions, 
// see: https://ntl.fyi/sched-func
export const handler = schedule("@hourly", async (event, _) => {
    const eventBody = JSON.parse(event.body);
    console.log(`Next function run at ${eventBody.next_run}.`);

    await harvestData();

    return {
        statusCode: 200
    };
});

