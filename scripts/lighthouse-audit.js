/**
 * A script to run Lighthouse audits on the Don't Panic website.
 * 
 * This script requires:
 * - lighthouse: npm install -g lighthouse
 * - chrome-launcher: npm install -g chrome-launcher
 * - yargs: npm install -g yargs
 * 
 * Usage:
 * node lighthouse-audit.js --url=http://localhost:4321
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const argv = require('yargs').argv;
const fs = require('fs');
const path = require('path');

const url = argv.url || 'http://localhost:4321';
const outDir = path.join(__dirname, '../lighthouse-reports');

// Create output directory if it doesn't exist
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

// Pages to test
const pages = [
  { name: 'home', path: '/' },
  { name: 'report-detail', path: '/reports/sample-cve/' },
  { name: 'about', path: '/about/' }
];

// Lighthouse configuration
const desktopConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
  },
};

const mobileConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4.0,
      requestLatencyMs: 150,
      downloadThroughputKbps: 1638.4,
      uploadThroughputKbps: 819.2,
    },
    emulatedUserAgent: 'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36',
  },
};

// Print results in console
function printResults(results) {
  console.log('------------------------------');
  console.log(`URL: ${results.finalUrl}`);
  console.log(`Performance: ${Math.round(results.categories.performance.score * 100)}`);
  console.log(`Accessibility: ${Math.round(results.categories.accessibility.score * 100)}`);
  console.log(`Best Practices: ${Math.round(results.categories['best-practices'].score * 100)}`);
  console.log(`SEO: ${Math.round(results.categories.seo.score * 100)}`);
  
  // Log opportunities for improvement
  if (results.audits['render-blocking-resources'].numericValue > 0) {
    console.log('\nRender Blocking Resources:');
    results.audits['render-blocking-resources'].details.items.forEach(item => {
      console.log(`- ${item.url}: ${Math.round(item.wastedMs)}ms`);
    });
  }
  
  if (results.audits['unused-javascript'].numericValue > 0) {
    console.log('\nUnused JavaScript:');
    results.audits['unused-javascript'].details.items.forEach(item => {
      console.log(`- ${item.url}: ${Math.round(item.wastedBytes / 1024)}KB`);
    });
  }
  
  if (results.audits['largest-contentful-paint'].numericValue > 2500) {
    console.log('\nLargest Contentful Paint:');
    console.log(`- ${Math.round(results.audits['largest-contentful-paint'].numericValue)}ms (Goal: <2500ms)`);
  }
  
  if (results.audits['interactive'].numericValue > 3800) {
    console.log('\nTime to Interactive:');
    console.log(`- ${Math.round(results.audits['interactive'].numericValue)}ms (Goal: <3800ms)`);
  }
}

async function runLighthouse() {
  // Launch Chrome
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  
  console.log('Running Lighthouse audits...');
  
  for (const device of ['mobile', 'desktop']) {
    const config = device === 'desktop' ? desktopConfig : mobileConfig;
    
    for (const page of pages) {
      const pageUrl = new URL(page.path, url).href;
      console.log(`Testing ${device} - ${page.name}: ${pageUrl}`);
      
      try {
        // Run Lighthouse
        const { lhr } = await lighthouse(pageUrl, {
          port: chrome.port,
          output: 'json',
        }, config);
        
        // Print results
        printResults(lhr);
        
        // Save results
        const fileName = `${page.name}-${device}.json`;
        fs.writeFileSync(
          path.join(outDir, fileName),
          JSON.stringify(lhr, null, 2)
        );
        
        // Save HTML report
        const htmlFileName = `${page.name}-${device}.html`;
        fs.writeFileSync(
          path.join(outDir, htmlFileName),
          lhr.report
        );
      } catch (error) {
        console.error(`Error testing ${pageUrl}:`, error);
      }
    }
  }
  
  // Close Chrome
  await chrome.kill();
  
  console.log('\nLighthouse audits complete! Reports saved to:', outDir);
  console.log('Open the HTML reports to see detailed information.');
}

runLighthouse();