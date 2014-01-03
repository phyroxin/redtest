/*======================================================================
 * Models
 *======================================================================
 */
var ArtifactModel = Backbone.Model.extend({
	
	initialize: function() {
		this.on('change', function(){ artifactView.render() });
	},
	
	defaults: {
		 "text": "Unknown Text"
		,"timestamp": "Unknown timestamp"
	}
});

var artifactModel = new ArtifactModel();


/*======================================================================
 * Collections
 *======================================================================
 */
var ArtifactCollection = Backbone.Collection.extend({
	
	model: ArtifactModel,
	
	url: '/api/getData',
	
	initialize: function(){
		this.on('change', function(){ artifactListView.render(); });
		console.log('running init function for ArtifactCollection');
		this.fetch({async:false});
		console.log(this.toJSON());
	},
	
	parse: function(data) {
		console.log('running parse');
		return _.map(data, _.identity);
	},
	
	reset: function(models, options) {
		if(options && options.parse) {
			delete options.parse;
			models = this.parse(models);
		}
		return Backbone.Collection.prototype.reset.call(this, models, options);
	}
});

var artifactCollection = new ArtifactCollection();


/*======================================================================
 * Header Views
 *======================================================================
 */
var HeaderView = Backbone.View.extend({
	 el: '#header-content'
	,initialize : function(){
		_.bindAll(this.buttonFunc, 'onClick', 'onHover');
	}
	,buttonFunc : {
		 label	  : 'underscore'
		,cmtWrap  : '.cmtWrap'
		,cmtInput : '#cmt'
		,onClick  : function(){
			$(this.cmtWrap).css({'display':'block'});
			$(this.cmtInput).focus();
		}
		,onHover  : function(){ }
	}
	,render: function(){
		var template = Handlebars.compile($('#stream_header').html());
		this.$el.html(template({
			 greeting	: 'Welcome!'
			,createTxt  : {
					 text  : 'Create Digest'
					,state : 'show' 
			}
			,loadTxt	: {
					 text  : 'Load Digest Data'
					,state : 'hidden' 
			}
			,shareTxt	: {
					 text  : 'Load Shared Data'
					,state : 'hidden' 
			}
		}));
		$('#createBtn').bind('click', this.buttonFunc.onClick);
		$('#createBtn').bind('mouseover', this.buttonFunc.onHover);
		return this;
	}
});


/*======================================================================
 * Input Views
 *======================================================================
 */
var InputView = Backbone.View.extend({
	 el: '#input-content'
	,initialize : function(){
		_.bindAll(this.inputFunc, 'onHover', 'onKeyPress', 'clear', 'close');
	}
	,inputFunc : {
		 label		: 'input field'
		,domObject	: '#cmt'
		,domWrap	: '.cmtWrap'
		,onHover	: function(){ }
		,onKeyPress	: function(e){  
			var that = this;
			if (e.which == 13) {
				console.log('Submitting...');
				var commTextVal = $(this.domObject).val();
				var time 		= new Date().getTime();
				var date		= new Date(time).toString();
				var request		= $.ajax({
					 url: "/api/addData"
					,type: "POST"
					,data: { text: commTextVal, timestamp: date }
					,dataType: "json"
				});
				request.done( function(){
					console.log('Success!');
					that.clear();
					// update list
					appList(commTextVal,date);
					// emit socket event for global update
					socket.emit('data added', {text: commTextVal, time: date});
					
				});
				request.fail( function(){ 
					console.log('Error!');
					that.error(); 
				});
			}
		}
		,clear : function(){
			$(this.domObject).val('');
		}
		,error : function(){
			$(this.domObject).css({'background-color':'#900'});
		}
		,close : function(){
			$(this.domWrap).css({'display':'none'})
		}
	}
	,render: function(){
		var template = Handlebars.compile($('#stream_inputDigest').html());
		this.$el.html(template({
			placeText	: 'enter your text'
		}));
		$('#cmt').bind('mouseover', this.inputFunc.onHover);
		$('#cmt').bind('keypress', this.inputFunc.onKeyPress);
		$('.closeClass').bind('click', this.inputFunc.close);
		return this;
	}
});


/*======================================================================
 * Single List Views
 *======================================================================
 */
var ArtifactView = Backbone.View.extend({
	 tagName: 'li'
	,className: 'single-model'
	,render: function(){
		var template = Handlebars.compile($('#stream_getDigest').html());
		this.$el.html(template(this.model.toJSON()));
		return this;
	}
});


/*======================================================================
 * Entire List Views
 *======================================================================
 */
var ArtifactListView = Backbone.View.extend({
	 el: $('#list')
	,tagName: 'ul'
	,id: 'list-view'
	,initalize: function(){
		this.collection.on('add', this.addOne, this);
		this.collection.on('reset', this.addAll, this);
	}
	,render: function(){
		this.addAll();
	}
	,addOne: function(artifactModel){
		var artifactView = new ArtifactView({model: artifactModel});
		this.$el.append(artifactView.render().el);
	}
	,addAll: function(){
		this.collection.forEach(this.addOne, this);
	}
});
