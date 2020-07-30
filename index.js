const eventbrite = require('./event');
let fs = require('fs');
(async () =>{

    let argument =(process.argv[2]  || 'blockchain' )
    let count = (process.argv[3]  || 20 )

    await eventbrite.initialize(argument)

    let results = await eventbrite.getResults(count)
   
   // debugger
    let resultDetails = await eventbrite.parseResultDetails(results)
    
  //  debugger
    let myJsonString = JSON.stringify(resultDetails);
    fs.writeFileSync(`jsonFiles/${argument}-${count}.json`, myJsonString)
}
)()