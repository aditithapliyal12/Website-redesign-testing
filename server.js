const express = require('express');
const { readUrlsFromCsv } = require('./utils');
const { checkUrlStatusAndTakeScreenshot } = require('./urlChecker');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/screenshots', express.static('screenshots'));

app.get('/', (req, res) => {
    res.send('Welcome to the URL Checker! Navigate to /report to see results.');
});

app.get('/report', async (req, res) => {
    try {
        const urls = await readUrlsFromCsv('urls.csv');
        const divSelector = '.revamped-product-landing__content-wrapper';
        const results = [];

        for (const url of urls) {
            const result = await checkUrlStatusAndTakeScreenshot(url, divSelector);
            results.push(result);
        }

        res.render('report', { results });
    } catch (error) {
        console.error('Error reading CSV file:', error.message);
        res.status(500).send('An error occurred while processing the URLs.');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
