const express=require('express')
const app=express()
const pg=require('pg');
var bodyParser = require('body-parser');
const { Pool, Client } = require('pg')
const connectionString = process.env.PGCONNECTION  //Enter your PG connection string
app.use(bodyParser.urlencoded({ extended: true }));//basically tells the system whether you want to use a simple algorithm for 
                                                  //shallow parsing (i.e. false) or complex algorithm for deep parsing that 
                                                  //can deal with nested objects (i.e. true).  
app.use(bodyParser.json());//basically tells the system that you want json to be used.

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req,res,next){

        console.log("looging here ",req.body)
    next()
})


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

router.route('/comp')
    .post(function(req,res){
    		const qtext = 'INSERT INTO COMPANY(id, name,age,address,salary) VALUES($1, $2,$3,$4,$5)'
           var values = [req.body.id,req.body.name,req.body.age,req.body.address,req.body.salary];

        	qexecuter(qtext,values,Client,(err,data)=>{

			    if(!err) 
			    res.send(req.body.name + " is saved!")
			    else
			    res.send(err)

        	})
          
    })

    .get(function(req,res){
		    const client = new Client({
			    connectionString: connectionString,
			  })
			  client.connect()
			  const qtext='select * from  COMPANY'

        	qexecuter(qtext,null,Client,(err,data)=>{

			    if(!err) 
			    res.json(data.rows)
			    else
			    res.send(err)

        	})

			 
    })

router.route("/comp/:compid")

    .get(function(req,res){

       	const qtext = 'SELECT * FROM COMPANY WHERE id=$1'
           var values = [req.params.compid];

        	qexecuter(qtext,values,Client,(err,data)=>{

			    if(!err) 
			    res.send(data.rows)
			    else
			    res.send(err)

        	})
          
    })

    .put(function(req,res){
    		const qtext = 'update COMPANY set name=$2,age=$3,address=$4,salary=$5 WHERE id=$1'
           var values = [req.params.compid,req.body.name,req.body.age,req.body.address,req.body.salary];

        	qexecuter(qtext,values,Client,(err,data)=>{

			    if(!err) 
			    res.send(req.body.name+" updated!")
			    else
			    res.send(err)

        	});
    })
    .delete(function(req,res){
    		const qtext = 'DELETE FROM COMPANY WHERE id=$1'
           var values = [req.params.compid];

        	qexecuter(qtext,values,Client,(err,data)=>{

			    if(!err) 
			    res.send(req.params.id +" is deleted!")
			    else
			    res.send(err)

        	})
       
    })
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
 

var qexecuter=function(qtext,values,Client,callback){
		
           const client = new Client({
			    connectionString: connectionString,
			  })
			  client.connect()
			  client.query(qtext,values, (err, data) => {
			     
			    if(!err) 
			    callback(null,data)
			    else
			    callback(err,null)
			    client.end()
			  })
}
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


