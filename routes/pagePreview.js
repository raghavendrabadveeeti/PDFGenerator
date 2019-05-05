var express = require('express');
const puppeteer = require('puppeteer');
const merge = require('easy-pdf-merge');
var fileSystem = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
      (async () => {
        //await page.goto('https://flyers.smartcanucks.ca/canada/loblaws-on-flyer-april-4-to-102/book/2',  {
        //await page.goto('https://twitter.com/narendramodi?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor',  {

        let random = Math.floor(Math.random() * 1000000000000);

        try {
          console.log(random, "Total Process Start", new Date())
          const browser = await puppeteer.launch({headless: true, pipe: true, ignoreHTTPSErrors: true})
          const page = await browser.newPage()

/*          const path = require('path');
          console.log(path.dirname(require.main));
          console.log(path.dirname(require.main));
          console.log(path.dirname(require.main));
          console.log(path.dirname(require.main));*/
          //throw Error("Failed .. ");
          /*          let queryString = req._parsedUrl.search;
                    pageIds = req.query.pageIDs;
                    storeGroupIDs = req.query.storeGroupIDs;
                    console.log(pageIds);
                    console.log(storeGroupIDs);
                    pages = pageIds.split(",");
                    storeGroups = storeGroupIDs.split(",");

                    let count = pages.length * storeGroups.length;
                    console.log(count);*/

          /*     await page.goto('http://localhost:1841/', {
                  waitUntil: "networkidle0"
               }) */
          //await page.goto('file:///C:\\ADV\\admanpdf\\source.htm', {

          var dir = './tmp';

          /*          console.log(__dirname);
                    console.log(__dirname);
                    console.log(__dirname);
                    console.log(__dirname);*/

          if (!fileSystem.existsSync(dir)) {
            fileSystem.mkdirSync(dir);
          }

          let pdfFiles = [];
          for (var i = 0; i < 2; i++) {
            console.log("Start child", i, new Date())
            await page.goto('http://localhost:4200/home', {waitUntil: 'networkidle0'});
            var pdfFileName = 'ad_' + random + '_' + (i + 1) + '.pdf';
            pdfFiles.push(pdfFileName);
            await page.pdf({path: pdfFileName, format: 'A4'});
            console.log("completed child", i, new Date())
          }

          /* await page.goto('http://localhost:4200/home', {
             waitUntil: "networkidle0",
             timeout  : 3000000
           });
           const html = await page.content();

           console.log(html);*/
          await browser.close();

          await mergeMultiplePDF(pdfFiles, random);

          /*const buffer = await page.pdf(
              {
                path           : 'page.pdf',
                format         : 'A4',
                printBackground: true
              })
              */
          res.type('application/pdf')
          var readStream = fileSystem.createReadStream('adFinal_' + random + '.pdf');
          // We replaced all the event handlers with a simple call to readStream.pipe()
          readStream.pipe(res);
          //res.send('success')
          //browser.close()
          console.log(random, "Total Process  End", new Date())
        } catch (e) {
          console.log(e, 'here I am');
          browser.close()
          res.statusCode = 500;
          res.send('Error while processing PDF');
          //next(e);
        }

      })()
    }
);

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
      )
          ;
    }
;

module.exports = router;
