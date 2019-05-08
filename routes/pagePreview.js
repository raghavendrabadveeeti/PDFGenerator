var express = require('express');
const puppeteer = require('puppeteer');
const merge = require('easy-pdf-merge');
var fileSystem = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
      (async () => {

        let pdf = printPDF(req, res);
        let random = getRandom();
        let fileName = 'page' + random + '.pdf';
        const browser = await puppeteer.launch({headless: true, pipe: true, ignoreHTTPSErrors: true})
        try {
          console.log(random, "Total Process Start", new Date());

          const page = await browser.newPage();
          //await page.setViewport({width: 1920, height: 1080});
          let queryString = req._parsedUrl.search;

          // console.log(queryString);

          await page.goto('http://localhost:8885/' + queryString, {
            waitUntil: "networkidle0",
            waitLoad : true,
            timeout  : 0
          });
          const pdf = await page.pdf(
              {
                //margin         : {left: '2cm', top: '4cm', right: '1cm', bottom: '2.5cm'},
                format         : 'A2',
                printBackground: true
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
