var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var PM = require('./modules/party-manager');

module.exports = function(app) {

// main login page //

	app.get('/', function(req, res){
	    // check if the user's credentials are saved in a cookie //
        // console.log(req.cookies);
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.status(200).send(o);
			}
		});
	});

    // app.get('/profile/:id', function(req, res){
    //     // console.log(req.session);
    //     // console.log(req.session.friends);
    //     if(req.session.user == null){
    //         res.redirect('/');
    //     }else {
    //         AM.getProfile(req.params.id, function(err, record){
    //             if(err){
	// 				res.status(400).send('account not exists');
    //             }else{
    //                 console.log("profile in routes.js", record);
    //                 console.log("profile in routes.js session.user", req.session.user);
    //                 res.render("user-profile", {
    //                     name : record.name,
    //                     country : record.country,
    //                     udata : req.session.user,
    //                     ref_user : record.name                        
    //                 });
    //             }
    //         });
    //     }
    // });

    app.get('/profile/:id', function(req, res){
        if(req.session.user == null){
            res.redirect('/');
        }else {
            AM.getProfile(req.params.id, function(err, ref_user_record){
                if(err){
					res.status(400).send('account not exists');
                }else{
                    AM.getAccount(req.session.user.name, function(err, record){
                        console.log("profile in routes.js", record.friends);
                        console.log("profile in routes.js session.user", ref_user_record);
                        res.render("user-profile", {
                            name : ref_user_record.name,
                            country : ref_user_record.country,
                            udata : req.session.user,
                            user_friends : record.friends,
                            ref_user : ref_user_record.name       
                        });                        
                    });
                }
            });
        }
    });
    
	app.get('/home', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
			res.render('user-home', {
				title : 'My Page',
				countries : CT,
				udata : req.session.user
			});
		}
	});
	
	app.post('/home', function(req, res){
		if (req.body['user'] != undefined) {
			AM.updateAccount({
				user 	: req.body['user'],
				name 	: req.body['name'],
				email 	: req.body['email'],
				pass	: req.body['pass'],
				country : req.body['country']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.status(200).send('ok');
				}
			});
		}	else if (req.body['logout'] == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.status(200).send('ok'); });
		}
	});
	
// creating new accounts //
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country'],
            friends : [],
            group   : []
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.body['email'], function(o){
			if (o){
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// TODO add an ajax loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}	else{
				res.status(400).send('email-not-found');
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.rendere('reset', { title : 'Reset Password' });
			}
		});
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.body['pass'];
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		});
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		});
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});

    // show parties list
    // app.get('/parties', function(req, res){
    //     if (req.session.user == null){
	//         // if user is not logged-in redirect back to login page //
	// 		res.redirect('/');
	// 	}else{
    //         PM.getAllRecords(function(e,records){
    //             if (!e){
    //                 console.log(records);
    //                 res.render("user-parties",{
    //                     records : records,
    //                     title : "party list",
    //                     udata : req.session.user
    //                 });
    //             } else {
    //                 res.status(400).send("no records");
    //             }
	// 	    });
    //     }
    // });
    app.get('/parties', function(req, res){
        if (req.session.user == null){
	        // if user is not logged-in redirect back to login page //
			res.redirect('/');
		}else{
            var perPage = 10, 
                page = req.query.page > 0 ? req.query.page : 1;

            console.log("page", page);
            PM.partiesPagination(page, perPage, function(err, pages, records){       
                if (!err){
                    console.log("parties list", records, "pages", pages, "page", page);
                    res.render("user-parties",{
                        records : records,
                        totalPages  : pages,
                        currentPage   : page,
                        udata  : req.session.user
                    });
                } else {
                    res.status(400).send("no records");
                }
		    });
        }
    });

    app.get('/parties/:id', function(req, res){
        if (req.session.user == null){
	        // if user is not logged-in redirect back to login page //
			res.redirect('/');
		}else{
            PM.partyItem(req.params.id, function(e,record){
                console.log(record);
                if (!e){
                    res.render("party-show", {
                        record : record,
                        udata : req.session.user
                    });
                } else {
                    res.status(400).send("no records");
                }
		    });
        }
    });

	app.post('/parties/:id', function(req, res){
        console.log('runnning in post id');
		PM.updateParty(req.params.id, {
            party_theme : req.body['party_theme'],
            party_time : req.body['party_time'],
            // menu : req.body['party_menu'],
            party_total_fee : req.body['party_total_fee']                        
        },function(e, o){
			if (e){
				res.status(400).send('error-updating-party');
			}	else{
                res.json({"status":"success"});
                // res.status(200).send('ok');
			}
		});
	});

    app.get('/party/create', function(req, res){
        if (req.session.user == null){
	        // if user is not logged-in redirect back to login page //
			res.redirect('/');
		}else{
            console.log("present party create form");
            
			res.render('user-party-create', {
				title : 'My Page',
				countries : CT,
				udata : req.session.user
			});
		}      
    });

    app.post('/party/create', function(req, res){
        console.log("insert a party");
        console.log(req.body);

        if (req.session.user == null){
	        // if user is not logged-in redirect back to login page //
			res.redirect('/');
		}else{
            PM.addNewParty({
			    party_theme      : req.body['party_theme'],                
		        party_time 	     : req.body['party_time'],
                party_creat_time : req.body['party_create_time'],
                party_menu       : req.body['party_menu'],
                party_total_fee  : 0,
                manager          : req.session.user['user'],
                member           : [req.session.user['user']]
		    }, function(e){
			    if (e){
                    console.log("insert with error");
                    res.json({"status":"error"});
				    // res.status(400).send(e);
			    }	else{
                    console.log("insert success");
                    res.json({"status":"success"});
				    // res.status(200).send('ok');
			    }
		    });
			// res.render('parties', {
			// 	title : 'My Page',
			// 	countries : CT,
			// 	udata : req.session.user
			// });
		}                

    });
    
    app.get('/:username([a-z]+)/party', function(req, res){
        console.log("parse successful");
        // res.status(200).send('ok');
		// res.render('party-home', { title: 'Signup', countries : CT, udata : req.session.user });
        // res.render('login', { title: 'Hello - Please Login To Your Account' });
        res.status(200).send({ title: 'Signup', udata : req.session.user });
    });

    app.post('/party', function(req, res){
        PM.addNewParty({
			party_description 	: req.body['party_des'],
		    party_time 	: req.body['party_time'],
			party_food 	: req.body['party_food']
		}, function(e){
			if (e){
                console.log("insert with error");
				res.status(400).send(e);
			}	else{
                console.log("insert success");
				res.status(200).send('ok');
			}
		});
    });

    app.post('/friend/:name', function(req, res){
        AM.findFriends(req.params.name , function(err, records){
            if(err){
                res.status(400).send(e);
            }else{
                // console.log(records);
                res.render("friends", {
                    records : records,
                    udata : req.session.user
                });
            }
        });
    });

    app.get('/buddy/:name', function(req, res){
        console.log("find buddies");
        AM.findBuddy(req.params.name , function(err, record){
            if(err){
                res.status(400).send(e);
            }else{
                // console.log(records);
                console.log("findone :", record);
                res.json({
                    status : "success",
                    record : record,
                    udata : req.session.user
                });
            }
        });
    });
    
    app.put('/friend/update', function(req, res){
        console.log("friends update");
        AM.updateFriends(req.body.friend_name,
                         req.body.friend_indicator,
                         req.session.user.name,
                         function(err){
            if(err){
                res.json({"status":"error"});
            }else{
                res.json({"status":"success"});
            }
        });       
    });


    app.get('/shuttle', function(req, res){
        console.log("parse successful");
        // res.status(200).send('ok');
		// res.render('party-home', { title: 'Signup', countries : CT, udata : req.session.user });
        // res.render('login', { title: 'Hello - Please Login To Your Account' });
        // res.status(200).send({ title: 'Signup', udata : req.session.user });
        res.render('shuttle-bus', {
			title : 'shuttle bus',
			udata : req.session.user
		});
    });

    app.get('/shuttle/wjk', function(req, res){
        console.log("parse successful");
        // res.status(200).send('ok');
		// res.render('party-home', { title: 'Signup', countries : CT, udata : req.session.user });
        // res.render('login', { title: 'Hello - Please Login To Your Account' });
        // res.status(200).send({ title: 'Signup', udata : req.session.user });
        res.render('shuttle-bus-wjk', {
			title : 'shuttle bus',
			udata : req.session.user
		});
    });
    
    
	app.get('*', function(req, res) {
        var href = req.protocol + "://"+ req.get('Host') + req.url;
        // console.log(req.get("Host"));
        // console.log(req.url);
        
        // console.log("href " + href + "\r\n");
        res.render('404', { title: 'Page Not Found'}); });

};



// var a = [{ _id: 560f6b9c6edde27baf840bc5,party_theme: '毕业了',party_time: '2015/10/09 16:00',party_creat_time: '2015/010/3 13:46',party_menu: { huoguo: [Object]},manager: 'fifth',member: ['fifth']}];



// var a = [{party_theme: '毕业了'}];



// var n={queryInfor:function(e,n,r)
//        {t.ajax({url:"http://friend.renren.com/friends/api/queryinformation",
//                 type:"post",
//                 dataType:"text",
//                 data:"l=5&p="+e,
//                 success:function(e){n.call(r,t.parseJSON(e))}})}};
