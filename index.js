const puppeteer = require("puppeteer");
const request = require("request");
require('dotenv').config();
// const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_PRODUCTION = true
Link_Lst = [
'https://in.investing.com/equities/axis-bank-technical',
'https://in.investing.com/equities/tata-motors-ltd-technical',
'https://in.investing.com/equities/icici-bank-ltd-technical',
'https://in.investing.com/equities/housing-development-finance-technical',
'https://in.investing.com/equities/maruti-suzuki-india-technical',
'https://in.investing.com/equities/infosys-technical',
'https://in.investing.com/equities/kotak-mahindra-bank-technical',
'https://in.investing.com/equities/reliance-industries-technical',
'https://in.investing.com/equities/hdfc-bank-ltd-technical',
'https://in.investing.com/equities/adani-enterprises-technical',
'https://in.investing.com/equities/mundra-port-special-eco.-zone-technical',
'https://in.investing.com/equities/apollo-hospitals-technical',
'https://in.investing.com/equities/asian-paints-technical',
'https://in.investing.com/equities/bajaj-auto-technical',
'https://in.investing.com/equities/bajaj-finance-technical',
'https://in.investing.com/equities/bajaj-finserv-limited-technical',
'https://in.investing.com/equities/bharat-petroleum-technical',
'https://in.investing.com/equities/bharti-airtel-technical',
'https://in.investing.com/equities/cipla-technical',
'https://in.investing.com/equities/coal-india-technical',
'https://in.investing.com/equities/divis-laboratories-technical',
'https://in.investing.com/equities/dr-reddys-laboratories-technical',
'https://in.investing.com/equities/grasim-industries-technical',
'https://in.investing.com/equities/hcl-technologies-technical',
'https://in.investing.com/equities/hdfc-bank-ltd-technical',
'https://in.investing.com/equities/itc-technical',
'https://in.investing.com/equities/indusind-bank-technical',
'https://in.investing.com/equities/infosys-technical',
'https://in.investing.com/equities/jsw-steel-technical',
'https://in.investing.com/equities/kotak-mahindra-bank-technical',
'https://in.investing.com/equities/larsen---toubro-technical',
'https://in.investing.com/equities/mahindra---mahindra-technical',
'https://in.investing.com/equities/ntpc-technical',
'https://in.investing.com/equities/oil---natural-gas-corporation-technical',
'https://in.investing.com/equities/power-grid-corp.-of-india-technical',
'https://in.investing.com/equities/apollo-hospitals-technical',
'https://in.investing.com/equities/wipro-ltd-technical',
'https://in.investing.com/equities/united-phosphorus-technical',
'https://in.investing.com/equities/state-bank-of-india-technical',
'https://in.investing.com/equities/sbi-life-insurance-technical',
'https://in.investing.com/equities/sun-pharma-advanced-research-technical',
'https://in.investing.com/equities/tata-consultancy-services-technical',
'https://in.investing.com/equities/tata-global-beverages-technical',
'https://in.investing.com/equities/tata-steel-technical',
'https://in.investing.com/equities/titan-industries-technical'
]
const getBrowser = () =>
  IS_PRODUCTION
    ? // Connect to browserless so we don't run Chrome on the same hardware in production
      puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io?token=5a58d66d-8a32-45cc-8b16-7d3e6491d60c' })
    : // Run the browser locally while in development
      puppeteer.launch();
async function getResults(lnk) {
  const results = [];
  const timeFrames = [1, 5, 15];

  // const browser = await puppeteer.launch({ headless: 'new' });
  
  for (const i of timeFrames) {
    try{
    //   const browser = await puppeteer.launch({
    //     headless: true,
    //     args: [
    //       '--no-sandbox',
    //       '--disable-setuid-sandbox',
    //       '--disable-dev-shm-usage',
    //       '--single-process',
    //       "--no-zygote",
    //       '--ignore-certificate-errors',
    //       "--disable-features=AudioServiceOutOfProcess"
    //       // "--remote-debugging-port"
    //     ],
    //     timeout: 0,
    //     executablePath:
    //       process.env.NODE_ENV === "production"
    //         ? process.env.PUPPETEER_EXECUTABLE_PATH
    //         : puppeteer.executablePath(),
    //   });
    // IS_PRODUCTION
    // ? // Connect to browserless so we don't run Chrome on the same hardware in production
    //   puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io?token=5a58d66d-8a32-45cc-8b16-7d3e6491d60c' })
    // : // Run the browser locally while in development
    //   puppeteer.launch( {headless: true});
    
      browser = await getBrowser();

      const page = await browser.newPage();
  
      const url = `${lnk}?timeFrame=${i * 60}`;
      console.log(`Getting: ${url}`);
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");
      await page.setViewport({width: 1920, height: 1080});
      // await page.goto(url);
      // const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});
      // await page.setDefaultNavigationTimeout(0);
      await page.setDefaultNavigationTimeout(0)
      
      await page.goto(url,{waitUntil: 'load', timeout: 0}).then(()=>console.log("Goto Success!!")).catch((err)=>console.log("GOTO:",err))
  
      // const screenshot = await page.screenshot({ encoding: 'base64' });
      // console.log("screeenshoot:",screenshot);
  
      await page.waitForSelector('section.forecast-box-graph').then(()=>console.log("Success")).catch( async(err) =>console.log("ERR",err));
      
  
      const status = await page.$eval("section.forecast-box-graph .title", el => el.textContent);
      const bank_name = await page.$eval("h1.main-title.js-main-title", (el) => el.textContent.trim());
  
      results.push({
          bankName: bank_name,
          status: status,
          lnk: lnk.replace(/-/g, ' ').split('/').pop(),
          url: url
      });
  
      await browser.close();
      // await page.close()
      // await browser.close();
    }catch(e){
      console.log("ERROR",e)

    }


  }
  return results;

}


  // results.push(lnk.split("/").pop().split("-").join(" "));



//   await browser.close();
//   console.log("res:",results);

//   return results;
// }

function sendAlertToTG(alertMsg) {
  console.log("Sending")
  const Alertbot =
    "https://api.telegram.org/bot5762212585:AAFoWYM3qdGDRfPkDyDhOMU3CiwHa4biIuo";
  const chatid = "-855310893";
  const AlertText = alertMsg;
  const parameters = { chat_id: chatid, text: AlertText };

  request.get(
    `${Alertbot}/sendMessage`,
    { qs: parameters },
    (err, res, body) => {
      if (err) {
        console.error(err);
      }
      console.log(`[Response] - ${res.statusCode}`);
    }
  );
}

let Buy_ = true;
let Sell_ = true;


async function scrape() {
  while(true){
    for (const lnk of Link_Lst) {
      
      const results = await getResults(lnk);
      console.log("getting result:",results);
      results.forEach(result => {
        console.log(result.status)
        if (result.status === 'Strong Sell') {
          // if (Sell_) {
            console.log("Telegram")
            sendAlertToTG(`Alert for Bank ${result.bankName} - "STRONG SELL"`);
            // Sell_ = false;
          // }
          }
          if (result.status === 'Strong Buy') {
            // if (Sell_) {
              // console.log("Telegram")

              sendAlertToTG(`Alert for Bank ${result.bankName} - "STRONG BUY"`);
              // Sell_ = false;
            // }
            }
            // results.clean()
      });
      // if(results.status == "Strong Sell"){
      //   console.log("HERE");
      //   if (Sell_) {
      //         sendAlertToTG(`Alert for Bank ${results.bankName} - "STRONG SELL"`);
      //         Sell_ = false;
      //       }
      // }
      // if(results.status == "Strong Buy"){
      //   if (Buy_) {
      //         sendAlertToTG(`Alert for Bank ${results.bankName} - "STRONG BUY"`);
      //         Buy_ = false;
      //       }    
      //     }
  
      // if (results.filter((res) => res === "Strong Sell")) {
      //   console.log(res);
      //   if (Sell_) {
      //     sendAlertToTG(`Alert for Bank ${results.slice(-1)} - "STRONG SELL"`);
      //     Sell_ = false;
      //   }
      // }
      // if (results.filter((res) => res === "Strong Buy")) {
      //   if (Buy_) {
      //     sendAlertToTG(`Alert for Bank ${results.slice(-1)} - "STRONG BUY"`);
      //     Buy_ = false;
      //   }
      // }
    }
  
    console.log("\n\nWaiting for___10___Seconds");
    waitBeforeNextIteration(10000);
  
  }
}
function waitBeforeNextIteration(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
scrape();


