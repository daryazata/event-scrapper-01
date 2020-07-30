const eventbrite = require('./event');
let fs = require('fs');
(async () =>{


    await eventbrite.initialize('blockchain')

    let results = await eventbrite.getResults(100)
   
    debugger
    let resultDetails = await eventbrite.parseResultDetails(results)
    
    debugger
    let myJsonString = JSON.stringify(resultDetails);
    fs.writeFileSync('events2.json', myJsonString)
}
)()