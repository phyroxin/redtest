/*========================================================
 * Module dependencies
 *========================================================
 */
var  express	= require('express')
	,http		= require('http')
	,stylus		= require('stylus')
	,nib		= require('nib')
	,path		= require('path')
	,model		= require('./models')
	,app		= express();

function compile(str, path){
	return stylus(str)
		.set('filename'. path)
		.use(nib());
}

/*========================================================
 * All environments
 *========================================================
 */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine','jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('IwitnessedAGirraffePuke'));
app.use(express.session());
app.use(app.router);
app.use(stylus.middleware({
		 src: __dirname + '/public'
		,compile: compile
}));
app.use(express.static(path.join(__dirname + '/public')));
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

/*========================================================
 * Start server
 *========================================================
 */
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port '+ app.get('port'));
});

var io = require('socket.io').listen(server);

/*======================================================================
 * socket IO functions
 *======================================================================
 */
io.sockets.on('connection', function(socket){
	
	socket.broadcast.emit('user connected');
	
	socket.on('data added', function(data){
		console.log('Sent from client: '+data);
		socket.broadcast.emit('update', data);
	});
});

/*========================================================
 * Application routes
 *========================================================
 */
app.get('/', 			 model.index);
app.get('/api/getData',  model.getData);
app.post('/api/addData', model.addData);
 
 