function reportResults(results) {
    results.forEach(({ url, statusCode, screenshotPath, brokenLinks, consoleErrors }) => {
        console.log(`\nReport for: ${url}`);
        console.log(`Status Code: ${statusCode}`);
        console.log(`Screenshot saved at: ${screenshotPath}`);

        if (brokenLinks.length > 0) {
            console.log(`Broken links found:`);
            brokenLinks.forEach(link => console.log(`- ${link}`));
        } else {
            console.log(`No broken links found.`);
        }

        if (consoleErrors.length > 0) {
            console.log(`Console errors found:`);
            consoleErrors.forEach(error => console.log(`- ${error}`));
        } else {
            console.log(`No console errors found.`);
        }
    });
}

module.exports = { reportResults };
