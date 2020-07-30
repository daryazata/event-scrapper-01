const puppeteer = require('puppeteer');
let fs = require('fs')
const dotenv = require("dotenv")
dotenv.config()

const subreddit_url = (event) =>`https://www.eventbrite.de/d/online/${event}/`

const self ={

    browser :null,
    page:null,

    initialize :async(event)=>{
        self.browser = await puppeteer.launch({
          // headless:false
        })
        self.page = await self.browser.newPage()

        
  
        /* go to the subreddit */
        await self.page.goto(subreddit_url(event),{waitUntil:'networkidle0'})
    },

    getResults: async(nr)=>{


        let results =[]

        do{
            let new_results = await self.parseResults()
            results = [...results, ...new_results]
            console.log(results)
            console.log(nr)
//'button[data-spec="page-next"]'
        //    if(results.length < nr){
                let nextPageButton=''
                try{
                    nextPageButton = await self.page.$('button[data-spec="page-next"]')
                    console.log(nextPageButton)
                }catch(e){
                    console.log(e)
                }
                
                if(nextPageButton) {

                    try{
                         
                        await nextPageButton.click()
                        await self.page.waitForNavigation({ waitUntil: 'networkidle0'})
                    }catch(e){
                        console.log(e)
                    }
                }else{

                    break
                }
         //   }
                console.log(results.length)
                console.log(nr)
        }while(results.length <= nr)

        return results.slice(0, nr)
    },

    parseResultDetails: async (arrayy)=>{
      
        console.log(arrayy)

        let data=[]
        for (const {Title, Link, Date, Price, } of arrayy) {
      
            let p_tags =[]
            if(Link){
                
                await Promise.all([
                    self.page.waitForNavigation(),
                    self.page.goto(Link),
                    self.page.waitForSelector('p'),
                 ]);
                 
                 
                 p_tags = await self.page.$$eval(
                     'p',
                     (elements => elements.map((element,index) => {
                         if(index>=8 && index<=30){
                             let p_text = ''
     
                             try{
                               p_text = element.innerText
                             }catch(e){
                                 console.log(e)
                                 
                             }
                             
                             return  p_text
                         }
                         
                     }
                     
                     )))
                  
                 } 
                 data.push({
                     Title,
                     Date,
                     Price,
                     Information: p_tags.join('   '),
                     Link,
                 });
       
             }
             return data
    },


    parseResults: async () =>{

        let pageData = await self.page.$$eval(
            'div[class*="search-event-card-wrapper"]',
            (elements => elements.map(element => {

                let Title, Date, Price, Link =''
                try{
                    
                    Title = element.querySelector('div[class="eds-is-hidden-accessible"]').innerText.trim()
                    Date = element.querySelector('div.eds-event-card-content__primary-content > div').innerText.trim()
                    Price = element.querySelector('div.eds-event-card-content__sub-content > div').innerText.trim()
                    Link = element.querySelector('a[class="eds-event-card-content__action-link"] , [tabindex="0"]').href
                   
                    
                }catch(e){
                    console.log(e)
                }
                return {
             
                    Title, Date, Price, Link
                
                };
            }))
        );

        return pageData
    }
    
}

module.exports = self