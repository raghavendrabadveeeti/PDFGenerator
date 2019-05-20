var Globals = require('../config/globals');
var express = require('express');
const puppeteer = require('puppeteer');
const merge = require('easy-pdf-merge');
var fileSystem = require('fs');
var router = express.Router();
var logger = require('.././config/winston');
const uuidV1 = require('uuid/v1');

router.get('/', function (req, res, next) {
      (async () => {
        const DELTA = 0.8;
        const INCH = 'in';
        let uuid = uuidV1();
        let browser = null;
        try {

          browser = await puppeteer.launch({headless: true, pipe: true, ignoreHTTPSErrors: true});
          let startTime = new Date();
          logger.debug(uuid + "Total Process Start" + startTime);

          const page = await browser.newPage();
          let queryString = req._parsedUrl.search;

          req.setTimeout(0);
          await page.goto(Globals.remoteServerURL() + '/' + queryString, {
            waitUntil: "networkidle0",
            waitLoad : true,
            timeout  : 0
          });

          logger.debug(uuid + "Page Load Completed" + new Date());

          if (await hasPageErrors(page)) {
            throw new Error("Unable to render page ");
          }

          let maximumPageRenderSize = await getPageSize(page);

          const pdf = await page.pdf(
              {
                height         : maximumPageRenderSize[0] + DELTA + INCH,
                width          : maximumPageRenderSize[1] + INCH,
                printBackground: true,
                margin         : {top: '0.4in', right: '0.2in', bottom: 0, left: '0.4in'},

              });

          logger.debug(uuid + "PDF  Completed" + new Date());
          res.type('application/pdf');
          res.send(pdf);
          logger.debug(uuid + "Total Process  End" + new Date());
          logger.debug(uuid + "Total Time sec" + (startTime - new Date()) / 1000);
        } catch (e) {
          logger.error('Failed to generate PDF' + e.toString());
          logger.error(e.toString());
          res.statusCode = 500;
          res.send('Error while processing PDF');
        } finally {
          if (browser) {
            await browser.close();
          }
        }

      })()
    }
);

async function getPageSize(page) {
  let maximumPageRenderSize;
  try {
    maximumPageRenderSize = await page.evaluate(() => maximumPageRenderSize);
  } catch (e) {
    logger.error('Failed to read the maximumPageRenderSize param');
    logger.error(e.toString());
    maximumPageRenderSize = [11.69, 8.27];
  }
  return maximumPageRenderSize;
}

async function hasPageErrors(page) {
  let pagenotavailable = false;
  try {
    pagenotavailable = await page.evaluate(() => pagenotavailable);
  } catch (e) {
    logger.error('Failed to read the pagenotavailable param');
    logger.error(e.toString());
    pagenotavailable = false;
  }
  return pagenotavailable;
}

module.exports = router;
