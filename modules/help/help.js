var request = require.safe('request');

// We want to process every incoming request
// if you wanted to stop that add logic here that determines when this plugin
// is activated
exports.match = function(text, commandPrefix) {
    return true;
};

exports.help = function() {
    return [[ '<query>','Answers to your life\'s most delightful problems.']];
};

not_found_responses = ['I don\'t have an answer for this',
    'The answer is found within you',
    'I don\'t know but you should ask my other concierges https://www.theknot.com/concierge'];

responses = ['OK, here\'s what I found',
  'Moar info if you want',
  'Check this out!',
  'How about this?'
];

hellos = ['hi', 'hello', 'howdy', 'hey', 'how are you'];
helloResponses = ['Hi', 'Hi there'];

randomResponse = function(responseCount){
  return Math.floor(Math.random() * responseCount);
};

exports.simpleMatch = function(query, matches, callback){
    var matchLength = matches.length;
    console.log('simple match on ' + query);
    for(var i=0; i<matchLength; i++){
      if(query.search(matches[i]) > 0){
        callback();
      }
    }
}

exports.simpleSearch = function (query, callback, errorCallback) {
  request.get('https://www.theknot.com/search.json?q='+query+'&category=local'+'&page=1', function(error, response, body){
      // results = helper.processSimpleResponse(response);
      var results = {};
      if(response.statusCode === 200 && response.body){
        results = JSON.parse(response.body);
        console.log('What I found');
        console.log(results);
        var resultsLength = results.length > 3? 3: results.length;
        if(results.length > 0){
          result = results[0];
          result.url =  "https://www.theknot.com" + result.url;
          callback(result);
         }
         else{
            errorCallback(not_found_responses[randomResponse(not_found_responses.length)])
        }
      }
      else{
        console.log(response);
        errorCallback({error: response.statusCode, body: response.body});
      }
    });
};

exports.search = function (query, callback, errorCallback) {
    if (!query || query === '') {
        errorCallback(not_found_responses[randomResponse(not_found_responses.length)] + ', try again');
    }
    else {
        //try to understand the meaning and then simple search :)
       // exports.simpleMatch(query, hellos, function(){
       //   errorCallback(hello_responses[randomResponse(hello_responses.length)]);
       // });
        exports.simpleSearch(query, callback, errorCallback);
    }
};

exports.run = function(api, event) {
    var query = event.body;
    console.log('Here is what they are asking me');
    console.log(query);
    console.log('Here\'s the whole event');
    console.log(event);
    exports.search(query, function(result) {
     //TODO: helper
     //TODO: extract callback into separate function

     // try to be a bit more varied in your responses
       console.log('response success');
       whichResponse = Math.floor(Math.random() * responses.length);
       api.sendMessage(responses[whichResponse] + result.url, event.thread_id);
       //api.sendImage("url", result.url, responses[whichResponse], event.thread_id);
    },
    function(result){
      console.log('response error');
      api.sendMessage(result, event.thread_id);
    });
};
