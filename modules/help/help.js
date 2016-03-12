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
    'Check out the concierges at https://www.theknot.com/concierge'];

responses = ['OK, here\'s what I found',
  'Moar info if you want',
  'Check this out!',
  'How about this?'
];

randomResponse = function(responseCount){
  return Math.floor(Math.random() * responseCount);
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

exports.search = function (query, callback) {
    if (!query || query === '') {
        var index = Math.floor(Math.random() * insults.length);
        callback(insults[index] + ', try again');
    }
    else {
        //try to understand the meaning and then simple search :)
        exports.simpleSearch(query, callback);
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
     whichResponse = Math.floor(Math.random() * responses.length);

     /* I realized that this was also extra noise exactly one piece of response text
      * and a url was a good result
      *
      *
      * api.sendMessage(result.title, responses[0], event.thread_id);
      if(result.image_url.length > 0){
      api.sendImage("url", result.image_url, picture_responses[0], event.thread_id);
     }*/
     api.sendImage("url", result.url, responses[whichResponse], event.thread_id);
    },
    function(result){
      api.sendMessage(result, event.thread_id);
    });
};
