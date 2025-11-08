/*server /router.js and here we route all the traffic we recieve from requests
to our controller.js which contains the logic to handle each incoming request method
 */

/*1.we import our controllers and here we are 'requiring' the functions we made
in the controllers.js */
const controllers = require('./controllers.js');

/*defining CORS headers as a function to keep things clean */
function setCORSHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
}

/*2.we define the router function and this router will eliminate the if else
    block */
function router (req, res) {
    //console log for debugging incoming requests
    console.log(`Received ${req.method} request for ${req.url}`);
    //1.setting CORSHeaders on every single response
    setCORSHeaders(res);
    //2.Handle the 'OPTIONS' preflight requests
    //this is the 'scout' from the browser
    if(req.method==='OPTIONS') {
        res.writeHead(200);//200 OK
        res.end();
        return ; //stop execution
    }

    //routing logic
    if(req.method==='GET' && req.url === '/') {
        controllers.getHomepage(req,res);
    } else if(req.method === 'GET' && req.url === '/api/posts') {
        controllers.getPosts(req, res);
    } else if(req.method === 'POST' && req.url === '/api/posts') {
        controllers.createPost(req, res);
    } else {
        controllers.handleNotFound(req, res);
    }
}

/*3.exporting the router function so that server.js can import and use it */
module.exports = router;