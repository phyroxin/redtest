/*======================================================================
 * Load json data from external file
 *======================================================================
 */
var questionsLoader = (function($, host) {
	var questionJson = "";
	var url = '/api/getSurvey';
	return {
		 loadData: function() {
			var jsonLoader = $.post( url, function( o ) { return o; }, 'json' )
							  .error(function(result) { console.log('Error Loading Json'); });
		 }
		,getJson: function() { return questionJson; }
	};
})(jQuery, document);

//questionsLoader.loadData(url);