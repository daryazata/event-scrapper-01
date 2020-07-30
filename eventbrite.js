const puppeteer = require('puppeteer');
let fs = require('fs')

const subreddit_url = (event) =>`https://www.eventbrite.de/d/online/${event}/`

const self ={

    browser :null,
    page:null,

    initialize :async(event)=>{
        self.browser = await puppeteer.launch({
           headless:false
        })
        self.page = await self.browser.newPage()

        
        await self.page.setRequestInterception(true);
        
        self.page.on('request', (req) => {
            if(req.resourceType() == 'image'){
                req.abort();
            }
            else {
                req.continue();
            }
        });
        
        /* go to the subreddit */
        await self.page.goto(subreddit_url(event),{waitUntil:'networkidle0'})
    },

    getResults: async(nr)=>{


        let results =[]

        do{
            let new_results = await self.parseResults()
            results = [...results, ...new_results]
//'button[data-spec="page-next"]'
            if(results.length < nr){
                let nextPageButton=''
                try{
                    nextPageButton = await self.page.$('button[data-spec="page-next"]')
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
            }

        }while(results.length <= nr)

        return results.slice(0, nr)
    },

    goToDetails: async(elem)=>{

        let description= []
        try{
                         
            await elem.click()
            await self.page.waitForNavigation({ waitUntil: 'networkidle0'})
            let p_tags = await self.page.$$('p')

            for (p_tag of p_tags){
                let desc=''
                try{

                   // desc = await p_tag.innerText.trim() //??
                   desc='hello'
                }catch(e){
                    console.log(e)
                }
                description.push({

                    desc
                })
            }
            
            console.log(description)
            await self.page.goBack();
        }catch(e){
            console.log(e)
        }
        return description
    },

    parseResults: async () =>{
        
        //  this data will be lost when navigate between pages
        let elements = await self.page.$$('div[class*="search-event-card-wrapper"]') 
        let results = []
        //let myJsonString=''

        for (let elem of elements){
          //  let details= await self.goToDetails(elem)
       

            let Title, Time, Price, Link =''
            try{

                Title = await elem.$eval(('div[class="eds-is-hidden-accessible"]'), node => node.innerText.trim())
                Time = await elem.$eval(('div.eds-event-card-content__primary-content > div'), node => node.innerText.trim())
                Price = await elem.$eval(('div.eds-event-card-content__sub-content > div'), node => node.innerText.trim())
                Link = await elem.$eval(('a.eds-event-card-content__action-link'), node => node.href.trim())
                
            }catch(e){
                console.log(e)
            }
        
            results.push({

                Title,
                Time,
                Price,
                Link
               // details
            }
            ) 
        }
     

        return results
    }
    

}

module.exports = self