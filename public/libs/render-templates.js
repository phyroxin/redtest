/*========================================================
 * Render templates
 * Loads external templates from path and injects in to page DOM
 *========================================================
 */
var url = './templates/templates.tmpl.html';
var templateLoader = (function($,host){
	return{
		loadExtTemplate: function(path){
			var tmplLoader = $.get(path)
				.success(function(result){
					//Add templates to DOM
					$("body").append(result);
				})
				.error(function(result){
					alert("Error Loading Templates!");
				})
				
			tmplLoader.complete(function(){
				//Publish an event that indicates when a template is done loading
				$(host).trigger("TEMPLATE_LOADED", [path]);
			});
		}
	};
})(jQuery, document);

templateLoader.loadExtTemplate(url);