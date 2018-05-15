var argv = process.argv.slice(2)
var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');
if(argv.length !== 2) {
  console.log("Incorrect Number of Arguments.")
  return;
}

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  var option = {
      url : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
     headers : {
       'User-Agent' : 'request',
       'Authorization' : `token ${secrets.GITHUB_TOKEN}`
     }
   }
  request(option, function(err, res, body) {
    //cb(option.url, JSON.parse(body));
    cb(JSON.parse(body))
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
  .pipe(fs.createWriteStream('./avatars/' + filePath +'.png'));
}

getRepoContributors(process.argv[0], process.argv[1], function(users){
    users.forEach(function(user) {
      console.log(user.avatar_url)
      downloadImageByURL(user.avatar_url, user.login )
     });
   });
