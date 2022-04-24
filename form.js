var http = require('http');
var url = require('url');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    pageReq = req.url;

    if ((qmark = pageReq.indexOf('?')) > 0) {
        pageReq = req.url.substr(0, qmark)
    }

    if (pageReq == "/") {
        s = "<form method='get' action='/process'>";
        s += "Company: <input type = 'text' name='company'><br />";
        s += "<input type='radio'  name='choice' value = 'name' checked='checked'/>Name";  
    	s += "<input type='radio'  name='choice' value = 'ticker'/>Ticker";
        s += "<input type = 'submit'>";
        res.write("Please enter company name or ticker<br>" + s);
    } else if (pageReq == "/process") {
        console.log(pageReq + " " + req.url);
        var qobj = url.parse(req.url, true).query;
        var company = qobj.company;
        var choice = qobj.choice;
        
        const MongoClient = require('mongodb').MongoClient;
        const db_url =  "mongodb+srv://jbrand12:dsc3lit3CS@cluster0.ahpye.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"; 

          MongoClient.connect(db_url, { useUnifiedTopology: true }, function(err, db) {
            if(err) { 
        		console.log("Connection err: " + err); return; 
        	}
          
            var dbo = db.db("companies");
        	var coll = dbo.collection('companies');
        	if (choice == "name") {
                theQuery={Stock: company};
            } else {
                theQuery={Ticker: company};
                console.log("here");
            }
        	coll.find(theQuery).toArray(function(err, items) {
        	  if (err) {
        		console.log("Error: " + err);
        	  } else {
        		for (i=0; i<items.length; i++)
        			console.log("Company: " + items[i].Stock + "\nTicker: " + items[i].Ticker);				
        	  }   
        	  db.close();
        	});  //end find		
        });  //end connect
    } else {
        res.write("Unknown page request: " + pageReq);
    }
    res.end();
}).listen(8080);