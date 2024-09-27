const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const screenshotsDir = './screenshots';
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
}

async function checkLinkStatus(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let finalUrl = url;
    let statusCode = 0;

    try {
        const response = await page.goto(url, { waitUntil: 'networkidle2' });
        finalUrl = response.url();
        statusCode = response.status();
    } catch (error) {
        console.error(`Error accessing ${url}:`, error.message);
        return 0;
    } finally {
        await browser.close();
    }


    console.log(`Final URL: ${finalUrl}, Status Code: ${statusCode}`);
    return statusCode;
}


async function checkUrlStatusAndTakeScreenshot(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const baseURL = new URL(url).origin;
    let statusCode = 0;
    const brokenLinks = [];
    const consoleErrors = [];
    let divSelector;


    if (url.includes('/docs')) {
        divSelector = '.docs-div-selector'; 
    } else {
        divSelector = 'integrations-list container page-wrapper-on-load';
    }

    page.on('response', response => {
        if (response.url() === url) {
            statusCode = response.status();
        }
    });

 
    page.on('console', msg => {
        consoleErrors.push(msg.text());
    });

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });


        const screenshotPath = path.join(screenshotsDir, `${encodeURIComponent(url)}.png`);
        await page.screenshot({ path: screenshotPath });


        const links = await page.evaluate((selector) => {
            const anchorTags = Array.from(document.querySelectorAll(`${selector} a`));
            return anchorTags.map(anchor => anchor.href);
        }, divSelector);


        for (const link of links) {
            const linkURL = new URL(link);
            if (linkURL.origin !== baseURL) {
                console.log(`Broken link (different base URL): ${link}`);
                brokenLinks.push(link);
                continue;
            }
            const status = await checkLinkStatus(link);
            if (status >= 400) {
                console.log(`Broken link (status ${status}): ${link}`);
                brokenLinks.push(link);
            }
        }

        return { statusCode, screenshotPath, brokenLinks, consoleErrors };

    } catch (error) {
        console.error(`Error accessing ${url}:`, error.message);
        return { statusCode: 0, screenshotPath: '', brokenLinks: [], consoleErrors };

    } finally {
        await browser.close();
    }
}



module.exports = { checkUrlStatusAndTakeScreenshot };
