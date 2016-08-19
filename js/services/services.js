app.factory("questionService", ["$http", function($http){

	var serviceBase = "http://localhost:9990/api/questions";

	var obj = {};

	obj.getAll = function() {
		return $http.get(serviceBase);
	}

	obj.getOne = function(id) {
		return $http.get(serviceBase + id);
	}

	obj.create = function(question) {
		return $http
		.post(serviceBase, question)
		.then(function (results) {
	        return results;
	    });
	}

	obj.update = function(question) {
		return $http
		.put(service, question )
		.then(function(results){
			return results;
		});
	}

	obj.delete = function(id) {
		return $http
		.delete(serviceBase + id)
		.then(function(results) {
			return results;
		});
	}

	return obj;

}]);