const puppeteer = require('puppeteer');
exports.first_scrape = (req, res) => {
    console.log(req.body);
    let item_id=req.body.item_id;
    scraper(item_id)
      .then(result => {
        if (result) {
          console.log(result);
          res.send(result);
        }
      })
      .catch(err => {
        res.send({
          err: err,
          msg: 'Error - something went wrong scraping the item'
        });
      });

  };


  let scraper = async item_id => {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    const page = await browser.newPage();
    if(typeof item_id == 'string'){
       item_id = item_id.split(" ").join("+"); // If item id has space replace it with +
    }
 const url="https://www.amazon.in/s?k="+item_id+"&ref=nb_sb_noss_2";
    console.log("URL",url);
    await page.goto(url);
    await page.waitForTimeout(3000);//wait time on url
    await page.waitForSelector('#search > div.s-desktop-width-max')
    const amazonResult = await page.evaluate(() => {
        let price=0;
        let imgSrc="/img/mobile.jpg";
        let link="";
          let items=[];
       document.querySelectorAll('.s-asin').forEach(item=>{
          if(item !==null){
              let title=item.querySelector('.a-text-normal').innerText;
              if(item.querySelector('.a-price-whole')!=null){
              price=item.querySelector('.a-price-whole').innerText;
              }else{
                  price=0;
              }
              if(item.querySelector('.s-image')!=null){
              imgSrc=item.querySelector('.s-image').src;
              }
              if(item.querySelector('.a-link-normal')!=null){
                  link=item.querySelector('.a-link-normal').href;
              }
             
            items.push({"title":title,"price":price,"imgSrc":imgSrc,"link":link,"source":"Amazon"});
          }
         
      });
      return {
        items
      };
    });

console.log("Amazon Results",amazonResult);

    browser.close();

    const browser1 = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    const page1= await browser1.newPage();
    if(typeof item_id == 'string'){
      item_id = item_id.split(" ").join("+");
   }
   const url1="https://www.flipkart.com/search?q="+item_id+"&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off";
   console.log("URL",url1);
   await page1.goto(url1);
   await page1.waitForTimeout(3000);
   const flipkartResult = await page1.evaluate(() => {
    let price=0;
    let imgSrc="/img/mobile.jpg";
    let link="";
      let items=[];
   document.querySelectorAll('._2kHMtA').forEach(item=>{
      if(item !==null){
          let title=item.querySelector('._4rR01T').innerText;
          if(item.querySelector('._25b18c > div')!=null){
          price=item.querySelector('._25b18c > div').innerText;
          }else{
              price=0;
          }
          if(item.querySelector('.CXW8mj > img')!=null){
            imgSrc=item.querySelector('.CXW8mj > img').src;
          }
          if(item.querySelector('._1fQZEK')!=null){
              link=item.querySelector('._1fQZEK').href;
          }
         
        items.push({"title":title,"price":price,"imgSrc":imgSrc,"link":link,"source":"Flipkart"});
      }
     
  });
  return {
    items
  };
});
console.log("Flipkart Result",flipkartResult);
const result=amazonResult.items.concat(flipkartResult.items);
console.log("Result",result);
    return result;
  };