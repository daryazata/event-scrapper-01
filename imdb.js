const puppeteer = require('puppeteer');

(async ()=>{

   // let movieUrl ='https://www.imdb.com/title/tt5753856/?ref_=hm_fanfav_tt_3_pd_fp1'
    let movieUrl ='https://www.imdb.com/title/tt2494820/?ref_=nm_knf_i2'
    let browser = await puppeteer.launch({headless:false})
    let page = await browser.newPage()

    await page.goto(movieUrl, {waitUntil:'networkidle2'})

    let data= await page.evaluate(()=>{

        let title = document.querySelector('div[class="title_wrapper"] > h1').innerText
        let rating = document.querySelector('span[itemprop="ratingValue"]').innerText
        let ratingCount = document.querySelector('span[itemprop="ratingCount"]').innerText

        return {

            title, 
            rating, 
            ratingCount
        }
    })
    console.log(data)

    debugger

    await browser.close()

})
()