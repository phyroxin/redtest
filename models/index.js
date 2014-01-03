/*========================================================
 * Connect to DB
 *========================================================
 */
var mongo 	= require('mongodb');
var monk 	= require('monk');
var db 		= monk('localhost:27017/backbonedb');

/*========================================================
 * Check DB exists, if not create
 *========================================================
 */
var collection = db.get('backbonecollection');
collection.find({}, function(err, docs){
	if(JSON.stringify(docs) !== '[]'){
		console.log('Connected to backbonedb database...');
		console.log(docs);
	}
	else{
		console.log('Couldn\'t find backbonedb collection, creating with sample data...');
		populateDB();
	}
});

/*========================================================
 * Route Models
 *========================================================
 */
exports.index = function(req, res){
	console.log('Home page');
	res.render('index', {
		title:'Home'
	});
};

exports.getData = function(req, res){
	
	var collection = db.get('backbonecollection');
	collection.find({},{},function(err, doc){
		if(err){
			console.log('No results found');
			res.send('No results found');
		}
		else{
			console.log('Data sent');
			res.send(doc);
		}
	});
};

exports.addData = function(req, res){
	// Get our form values
	var data	= req.body;
	var newData = {};

	for (var key in data) {
		newData[key] = data[key];
	}
	console.log(newData);
	// Set our collection
	var collection = db.get('backbonecollection');	

	// Submit to the DB
	collection.insert( newData , function(err, doc){
		if(err){
			// If it failed, return error
			res.send('There was a problem adding the information to the database.');
		}
		else{
			console.log('Data inserted successfully!');
			// If it worked, forward to success page
			res.send({'data':data});
		}
	});
};

/*========================================================
 * Populate db with data if none found
 *========================================================
 */
var populateDB = function() {

    var data = {
        "text"		 : "happy new year"
        ,"timestamp" : "Thu Jan 02 2014 11:37:51 GMT+0000 (GMT Standard Time)"
	};

	collection.insert(data, function(err, result) {
		if(!err)
			console.log('...collection creation complete!');
		else
			console.log('...database error!');
	});
};