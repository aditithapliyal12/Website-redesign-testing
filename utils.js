const fs = require('fs');
const csv = require('csv-parser');

async function readUrlsFromCsv(filePath) {
    return new Promise((resolve, reject) => {
        const urls = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (row.url) urls.push(row.url);
            })
            .on('end', () => resolve(urls))
            .on('error', reject);
    });
}

module.exports = { readUrlsFromCsv };
