const eventbrite = require('./eventbrite');
let fs = require('fs');
(async () =>{


    await eventbrite.initialize('blockchain')

    let results = await eventbrite.getResults(20)
   
    debugger;
    let myJsonString = JSON.stringify(results);
    fs.writeFileSync('events2.json', myJsonString)
}
)()