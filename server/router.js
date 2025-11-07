/*server /router.js and here we route all the traffic we recieve from requests
to our controller.js which contains the logic to handle each incoming request method
 */

/*1.we import our controllers and here we are 'requiring' the functions we made
in the controllers.js */
const controllers = require('./controllers.js');

/*2.we define the router function and this router will eliminate the if else
    block */
function router (req, res) {
    //console log for debugging incoming requests
    console.log(`Received ${req.method} request for ${req.url}`);
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