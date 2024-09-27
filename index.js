const { readUrlsFromCsv } = require('./utils');
const { checkUrlStatusAndTakeScreenshot } = require('./urlChecker');
const { reportResults } = require('./report');

(async () => {
    try {
        const urls = await readUrlsFromCsv('urls.csv');
        const divSelector = '.revamped-product-landing__content-wrapper';
        const results = [];

        for (const url of urls) {
            const result = await checkUrlStatusAndTakeScreenshot(url, divSelector);
            results.push(result);
        }

        reportResults(results);
    } catch (error) {
        console.error('Error reading CSV file:', error.message);
    }
})();
