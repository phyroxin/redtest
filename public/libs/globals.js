/*======================================================================
 * Get url for global usage
 * The option is available to set the url from any point in the app via the 'set' method
 *======================================================================
 */
var URL = (function(){
	var url		  = '//'+window.location.hostname+'/';
	var socketURI = '//node.dev/';
	//var socketURI = '//node-backbone-rd.eu01.aws.af.cm/';
	return {
		 GET: function(){
			return url;
		}
		,SET: function(u){
			url = u;
		}
		,SURI: function(u){
			return socketURI;
		}
	}
}());

/*======================================================================
 * append list data
 *======================================================================
 */
var appList = function(c, d){
	$('#list').append($('<li />', {
		'class':'single-model'
	})
	.html(c+'<br><strong><small>Posted '+d+'</small></strong>'));
}

/*======================================================================
 * start socket transactions 
 *======================================================================
 */
var socket = io.connect(URL.SURI());

/*======================================================================
 * Partial application with bind
 *======================================================================
 */
var func = function(greeting){ return greeting + ': ' + this.name };
func	 = _.bind(func, {name: 'moe'}, 'hi');

console.log(func());

