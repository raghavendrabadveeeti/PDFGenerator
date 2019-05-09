var express = require('express');
const puppeteer = require('puppeteer');
const merge = require('easy-pdf-merge');
var fileSystem = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
      (async () => {

        const DELTA = 0.8;
        let random = getRandom();
        const browser = await puppeteer.launch({headless: true, pipe: true, ignoreHTTPSErrors: true})
        try {
          console.log(random, "Total Process Start", new Date());

          const page = await browser.newPage();
          let queryString = req._parsedUrl.search;

          // console.log(queryString);

          await page.goto('http://localhost:8885/' + queryString, {
            waitUntil: "networkidle0",
            waitLoad : true,
            timeout  : 0
          });

          let maximumPageRenderSize = await page.evaluate(() => maximumPageRenderSize);
          maximumPageRenderSize = (!maximumPageRenderSize) ? [11.69, 8.27] : maximumPageRenderSize;

          const pdf = await page.pdf(
              {
                height         : maximumPageRenderSize[0] + DELTA + 'in',
                width          : maximumPageRenderSize[1] + 'in',
                printBackground: true,
                margin         : {top: 0, right: '0.2in', bottom: 0, left: '0.4in'},
              });

          res.type('application/pdf');
          res.send(pdf);
          console.log(random, "Total Process  End", new Date())
        } catch (e) {
          console.log(e, 'here I am');
          res.statusCode = 500;
          res.send('Error while processing PDF');
        } finally {
          if (browser) {
            browser.close();
          }
        }

      })()
    }
);

async function printPDF(req, res) {
  const browser = await puppeteer.launch({headless: true, ignoreHTTPSErrors: true});
  const page = await browser.newPage();
  await page.goto('https://blog.risingstack.com', {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({format: 'A4'});

  await browser.close();
  return pdf
}

const mergeMultiplePDF = (pdfFiles, random) => {
  return new Promise((resolve, reject) => {
        merge(pdfFiles, 'adFinal_' + random + '.pdf', function (err) {

          if (err) {
            console.log(err);
            reject(err)
          }

          console.log('Success');
          resolve()
        });
      }
  );
};

function getRandom() {
  return Math.floor(Math.random() * 1000000000000);
}

module.exports = router;
