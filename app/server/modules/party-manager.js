var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'node-login';

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database :: ' + dbName);
	}
});
var parties = db.collection('parties');

exports.addNewParty = function(newData, callback)
{
    parties.insert(newData, {safe: true}, callback);
};

exports.partiesPagination = function(page,perPage,callback) {
    parties.count({}, function (err, count) {
        // parties.find({}).sort({'_id':-1}).skip((page-1)*perPage).limit(perPage).toArray(function(err,records){
        parties.find({}, {sort : {'_id':-1}}).skip((page-1)*perPage).limit(perPage).toArray(function(err,records){            
            if (err) callback(err);
		    else {
                var pages = Math.ceil(count / perPage);
                callback(null, pages, records);
            }
        });
    });
};


// exports.getAllRecords = function(callback)
// {
// 	parties.find({},{sort: {_id:-1}}).toArray(
// 		function(e, records) {
// 		    if (e) callback(e);
// 		    else callback(null, records);
// 	});
// };

var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
};

exports.partyItem = function(id, callback)
{
    parties.findOne({_id : getObjectId(id)}, function(e, o) {
        if (e) callback(e);
		else callback(null, o);
	    });
};

exports.updateParty = function(id, modifiedData, callback)
{
    console.log("in updateParty function");
    // parties.findOne({_id : getObjectId(id)}, function(e, o) {
    parties.find({_id : new mongo.ObjectID(id)}, function(e, o) {        
        if (e){
            console.log("error in party update");
            callback(e);
        } else {
            console.log("running in party update");
            console.log('modifiedData', modifiedData);
            console.log('origin Data', o);
            o.party_theme = modifiedData.party_theme;
            o.party_time = modifiedData.party_time;
            // o.menu = modifiedData.party_menu;
            o.party_total_fee = modifiedData.party_total_fee;
            console.log('origin Data 2', o);
            parties.save(o, {safe: true}, callback);
        }
	    });
};


