var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL);

var scopes = [
  'https://www.googleapis.com/auth/drive'
];

var auth_url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope: scopes // If you only need one scope you can pass it as string
});

// console.log("auth url:", auth_url)

var child_process = require('child_process')

child_process.exec("open '" + auth_url + "'")

context = {
  scopes: scopes,
  url: url,
  oauth: oauth2Client
}

var repl = require("repl");


var http = require('http');
var url = require('url');

var server = http.createServer(function(request, response) {

  var u = url.parse(request.url, true)
  
  if (u.pathname == '/oauth') {
    
    if (u.query.code) {
      body = ""

      oauth2Client.getToken(u.query.code, function(err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if(!err) {
          // oauth2Client.setCredentials(tokens);
          console.log(tokens)
          // https://security.google.com/settings/security/permissions
          body += "export GOOGLE_ACCESS_TOKEN=" + tokens.access_token + "\n"
          if(!tokens.refresh_token) {
            body += "No refresh_token detected; revoke access to this app at https://security.google.com/settings/security/permissions and try again\n"
          } else {
            body += "export GOOGLE_REFRESH_TOKEN=" + tokens.refresh_token + "\n"
            body += "export GOOGLE_ACCESS_TOKEN_EXPIRES="+ tokens.expiry_date
          }
        } else {
          body = "There was a problem swapping this code for tokens; try again"
        }
        response.writeHead(200);
        response.write(body);
        response.end();
        server.close();
        console.log(body);
      });
    } else {
      console.log("No joy :(")
      response.end();
      server.close();
    }

    

  } else {
    response.writeHead(404)
    response.write("Not found")
    response.end();
    server.close();
  }

})

server.listen(3007)
