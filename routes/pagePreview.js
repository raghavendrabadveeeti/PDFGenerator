var express = require('express');
const puppeteer = require('puppeteer');
const merge = require('easy-pdf-merge');
var fileSystem = require('fs');
var utils = require('../utils');
var router = express.Router();
var logger = require('.././config/winston');

router.get('/', function (req, res, next) {

      (async () => {

        const DELTA = 0.8;
        let random = utils.getRandom();

        const browser = await puppeteer.launch({headless: true, pipe: true, ignoreHTTPSErrors: true})
        try {
          let startTime = new Date();
          logger.debug(random + "Total Process Start" + startTime);

          const page = await browser.newPage();
          let queryString = req._parsedUrl.search;

          req.setTimeout(0);

          await page.goto('http://localhost:8885/' + queryString, {
            waitUntil: "networkidle0",
            waitLoad : true,
            timeout  : 0
          });

          logger.debug(random + "Page Loaded Completed" + new Date());

          if (await hasPageErrors(page)) {
            throw new Error("Unable to render page ");
          }

          let maximumPageRenderSize = await getPageSize(page);

          const pdf = await page.pdf(
              {
                height         : maximumPageRenderSize[0] + DELTA + 'in',
                width          : maximumPageRenderSize[1] + 'in',
                printBackground: true,
                margin         : {top: '0.4in', right: '0.2in', bottom: 0, left: '0.4in'},

              });

          logger.debug(random + "PDF  Completed" + new Date());
          res.type('application/pdf');
          res.send(pdf);
          logger.debug(random + "Total Process  End" + new Date());
          logger.debug(random + "Total Time sec" + (startTime - new Date()) / 1000);
        } catch (e) {
          logger.error('Failed to generate PDF' + e.toString());
          logger.error(e.toString());
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

async function getPageSize(page) {
  let maximumPageRenderSize;
  try {
    maximumPageRenderSize = await page.evaluate(() => maximumPageRenderSize);
  } catch (e) {
    console.log(e);
    maximumPageRenderSize = [11.69, 8.27];
  }
  return maximumPageRenderSize;
}

async function hasPageErrors(page) {
  let pagenotavailable = false;
  try {
    pagenotavailable = await page.evaluate(() => pagenotavailable);
  } catch (e) {
    console.log(e);
    pagenotavailable = false;
  }
  return pagenotavailable;
}

module.exports = router;
