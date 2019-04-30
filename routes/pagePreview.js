var express = require('express');
const puppeteer = require('puppeteer')
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
      (async () => {
        const browser = await puppeteer.launch({headless: true, ignoreHTTPSErrors: true})
        const page = await browser.newPage()
        //await page.goto('https://flyers.smartcanucks.ca/canada/loblaws-on-flyer-april-4-to-102/book/2',  {
        //await page.goto('https://twitter.com/narendramodi?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor',  {

        var url = require('url');
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        //console.log('url', url);
        console.log('url_parts', url_parts.search);
        console.log('query', query);

        console.log(req.query.toString());
        console.log(req.qu);
        //console.log('req',req);

        try {
          /*     await page.goto('http://localhost:1841/', {
                  waitUntil: "networkidle0"
               }) */
           await page.goto('file:///C:\\ADV\\admanpdf\\source.htm', {

          //await page.goto('https://en.wikipedia.org/wiki/Pawan_Kalyan' + url_parts.search, {
            waitUntil: "networkidle0"
          })

          const buffer = await page.pdf({format: 'A4', printBackground: true})
          res.type('application/pdf')
          res.send(buffer)
          browser.close()
        } catch (e) {
          console.log(e, 'here I am');
          browser.close()
          res.statusCode = 500;
          res.send('Error while processing PDF');
        }

      })()
    }
);

module.exports = router;
