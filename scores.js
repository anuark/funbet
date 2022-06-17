const puppeteer = require('puppeteer');
const dayjs = require('dayjs');

const delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

var parseDate = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let [, d, m] = date.split(' ');
    console.log({ date, d, m });

    const day = d.replace(/[a-z]/g, '');
    const year = '2022';
    const month = months.indexOf(m) + 1
    return dayjs(`${year}-${month}-${day}`);
};
(async () => { const browser = await puppeteer.launch({
        // devtools: true,
        // defaultViewport: { 'width': 2200, 'height': 1200 },
        // headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            // '--start-fullscreen'
        ],
        ignoreDefaultArgs: ['--disable-extensions'],
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
            let date;
            // find date
            let j = 1;
            while(true) {
                let d = data[i-(j++)];
                if (d.substring(0, 1) != '\t') {
                    date = parseDate(d);
                    break;
                }
            }

            const [, homeTeam, timeUnformatted, awayTeam] = v.split('\t');
            let time = timeUnformatted.replace('\n', '');
            let hour = time.substring(0, 2);
            let mins = parseInt(time.substring(3, 5));
            date.set('hour', hour).set('minute', mins);
            date = date.toDate();
            games.push({ date, homeTeam, awayTeam, homeScore: 0, awayScore: 0, status: 'not-played' });
        }
    });

    console.log(games);
})();
