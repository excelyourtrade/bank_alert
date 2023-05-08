const puppeteer = require("puppeteer");
const request = require("request");

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

async function getResults(lnk) {
  const results = [];
  const timeFrames = [1, 5, 15];

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox']
  })  const page = await browser.newPage();

  for (const i of timeFrames) {
    const url = `${lnk}?timeFrame=${i * 60}`;
    console.log(`Getting: ${url}`);

    // await page.setUserAgent("Mozilla/5.0");
    // await page.goto(url, { waitUntil: "networkidle0" });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

    await page.setDefaultNavigationTimeout(0);
    await page.waitForSelector('section')



    const status = await page.$eval(
      "section.forecast-box-graph .title",
      (el) => el.textContent
    );
    const Bank_Name = await page.$eval("h1.main-title.js-main-title", (el) =>
      el.textContent.trim()
    );
    results.push(status);
  }

  results.push(lnk.split("/").pop().split("-").join(" "));
  await browser.close();
  console.log("res:",results);

  return results;
}

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

setInterval(async () => {
  for (const lnk of Link_Lst) {
    const results = await getResults(lnk);
    console.log("getting result:",results);

    if (results.filter((res) => res === "Strong Sell")) {
      if (Sell_) {
        sendAlertToTG(`Alert for Bank ${results.slice(-1)} - "STRONG SELL"`);
        Sell_ = false;
      }
    }
    if (results.filter((res) => res === "Strong Buy")) {
      if (Buy_) {
        sendAlertToTG(`Alert for Bank ${results.slice(-1)} - "STRONG BUY"`);
        Buy_ = false;
      }
    }
  }

  console.log("\n\nWaiting for___10___Seconds");
}, 10000);