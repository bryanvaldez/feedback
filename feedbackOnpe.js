(function() {
    'use strict';

	angular
	    .module('feedbackOnpe',[])	    
	    .controller('feedbackPanelController', feedbackPanelController)
	    .directive('feedbackPanelOnpe', feedbackPanelOnpe)
	    .directive('tooltipPanelOnpe', tooltipPanelOnpe)
	    .factory('feedbackPanelService', feedbackPanelService)
	    .constant('ConstMessages', {
	    	REST_SERVICE_URI: 'http://172.16.89.216:8080/SRS/feedbackonpe/',
	    	QUESTION_OPINION: '¿Como calificaria su experiencia en appname?',
	    	THANKS_FOR_JOIN: '¡Gracias por participar!',
	    	ASK_COMMENTS: 'Si desea, ingrese sus comentarios...',
	    	THANKS_FOR_COMMENTS: 'Sus comentarios son muy valiosos.',
	    	FINAL_THANKS:'¡Gracias!'
	    });

		function feedbackPanelOnpe() {
		    var directive = {
		    	restrict: 'E',
		    	template: ['<div  ng-class="vm.hidePanel?\'feedbackOnpeBar onpeOutRight low\':\'feedbackOnpeBar onpeInRight low\'">',
		    					'<i class="fa fa-chevron-right feedbackOnpearrow" aria-hidden="true" ng-click="vm.close()"></i>{{vm.textPanel}}',
		    					'<img class="feedbackOnpeimg" ng-class="{feedbackOnpeimg: vm.status == 0, feedbackOnpeimg1: vm.status == 1, feedbackOnpeimg2: vm.status == 2}" ng-src="js/libs/feedback-onpe/img/logo.png"></img>',
		    					'<div class="feedbackOnpekeyboard" ng-show="vm.status == 0">',
		    						'<div class="feedbackOnpekey" ng-click="vm.vote(1)"><i class="fa fa-thumbs-o-up feedbackOnpelike" aria-hidden="true"></i></div>',
		    						'<div class="feedbackOnpekey" ng-click="vm.vote(0)"><i class="fa fa-thumbs-o-down feedbackOnpeunlike"  aria-hidden="true"></i></div>',
		    					'</div>',
		    					'<div class="feedbackOnpecomment" ng-show="vm.status == 1">',
		    						'<textarea ng-keypress="KeyDown($event)" placeholder="{{vm.prompt}}" ng-model="vm.comment" ng-trim="false" maxlength="100"></textarea>',
		    						'<i ng-click="vm.submit()" class="fa fa-paper-plane" aria-hidden="true" ng-required="vm.comment!=null"></i>',
		    						'<span>{{vm.comment==null?0:vm.comment.length}}/100</span>',
		    					'</div>',
		    					'<div class="feedbackOnpecomment" ng-show="vm.status == 2">',
		    						'<h4>{{vm.textEnd}}</h4>',
		    					'</div>',				
				'</div>'].join(''),        
		        scope:{
		        	appName: '@'
		        },
		        link: link,
		        controller: feedbackPanelController,
		        controllerAs: 'vm',
		        bindToController: true		        
		    };
		    
		    return directive;

		    function link(scope, element, attrs, ctrl) {
		    	//scope.appName = attrs.appName;
		    }
		}

		function tooltipPanelOnpe() {
		    var directive = {
		    	restrict: 'E',
		    	template: ['<div style="float: right;" class="onpeToolTip">',
			    	'<a>',			    		
			    		'<img class="onpeToolTipImg" ng-src="js/libs/feedback-onpe/img/logo.png"></img>',
						'<div class="onpeToolTipBar">',
						'<div class="onpeToolTipBarTitle">www.onpe.gob.pe</div>',
						'<div class="onpeToolTipBarRow">',
							'<div class="onpeToolTipBarTag">Central:</div>',
							'<div class="onpeToolTipBarContent">(01)417-0630</div>',
						'</div>',
						'<div class="onpeToolTipBarRow">',
							'<div class="onpeToolTipBarTag">Correo:</div>',
							'<div class="onpeToolTipBarContent">informes@onpe.gob.pe</div>',
						'</div>',
						'<div class="onpeToolTipBarRow">',
							'<div class="onpeToolTipBarTag">Fono:</div>',
							'<div class="onpeToolTipBarContent">0800-20100</div>',
						'</div>',
						'<ul>',
							'<li><a href="https://www.facebook.com/ONPEoficial/" target="_blank"><i style="color:#3b5a9b;" class="fa fa-facebook-official" aria-hidden="true"></i></a></li>',
							'<li><a href="https://twitter.com/ONPE_oficial/" target="_blank"><i style="color:#3b5a9b;" class="fa fa-twitter-square" aria-hidden="true"></i></a></li>',
							'<li><a href="https://plus.google.com/+OnpeGobPe" target="_blank"><i style="color:#db2814;" class="fa fa-google-plus-square" aria-hidden="true"></i></a></li>',
							'<li><a href="https://www.youtube.com/user/onpeprensa/" target="_blank"><i style="color:#db2814;" class="fa fa-youtube-play" aria-hidden="true"></i></a></li>',
							'<li><a href="https://www.onpe.tv/" target="_blank"><i style="color:#3b5a9b;" class="fa fa-television" aria-hidden="true"></i></a></li>',
						'</ul>',
						'<div class="onpeToolTipBarFooter">@Copyright Onpe</div>',
			    		'</div>',
			    	'</a>',				
				'</div>'].join('')        		        
		    };
		    
		    return directive;
		}		

		feedbackPanelController.$inject = ['$scope','ConstMessages','feedbackPanelService','$timeout'];

		function feedbackPanelController($scope, ConstMessages, feedbackPanelService, $timeout) {
		    // Injecting $scope just for comparison
		    var vm = this;
		    vm.feedback={id:null, nombre:'', estado:null, comentarios:''};
		    vm.hidePanel = false;
		    vm.status = 0;
		    vm.textPanel = ConstMessages.QUESTION_OPINION;
		    vm.textPanel = vm.textPanel.replace(/appname/gi, vm.appName);
		    vm.prompt = ConstMessages.ASK_COMMENTS;
		    vm.textEnd = ConstMessages.FINAL_THANKS;

			vm.vote = vote;
			vm.submit = submit;
			vm.close = close;

			function vote(valor){
				vm.textPanel = ConstMessages.THANKS_FOR_JOIN;
				vm.status = 1;
				vm.feedback.estado = valor;
			};

			function submit(){
				vm.feedback.comentarios = vm.comment;
				vm.feedback.nombre = vm.appName;
				createFeedback(vm.feedback);
				close();
			};

			function close(){
				vm.status = 2;
				vm.textPanel = ConstMessages.THANKS_FOR_COMMENTS;				
			    $timeout(function () {vm.hidePanel = true;}, 600);				
			};

			$scope.KeyDown = function(keyEvent) {
				if (keyEvent.which === 13){
					keyEvent.preventDefault(); 
					return false;        
				}
			};

    		function createFeedback(feedback){
    			feedbackPanelService.createFeedback(feedback)
    				.then(
    					function(response){
    						console.log('[SAVE]Feedback');
    					},
    					function(errResponse){
    						console.log(errResponse);
    					}
    				);
    		};
		}

		feedbackPanelService.$inject = ['$http','$q','ConstMessages'];

		function feedbackPanelService($http, $q, ConstMessages){
	
		    var factory = {
		        createFeedback: createFeedback
		    };			

			return factory;

			function createFeedback(data){
				var deferred = $q.defer();

		        $http({
		            url:ConstMessages.REST_SERVICE_URI,
		            method: 'POST',
		            data: data,     
		            contentType: 'application/json',
		            headers: {'Content-Type': 'application/json; charset=UTF-8'} 
		        }).then(
		            function (response){
		                deferred.resolve(response.data);
		            },
		            function (errResponse){
		                console.error('[SERVICE].Error.')
		                deferred.reject(errResponse);
		            }
		        );


				return deferred.promise;	
			}
		}	
   
})();