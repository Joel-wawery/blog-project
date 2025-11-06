const http = require('http');
const PORT = 3000;

// Create a basic HTTP server and respond with plain text for any request
const server = http.createServer((req, res) => {
  //log the request URL to the console as this is tha great debugging too
  console.log(`incoming requests: ${req.method} ${req.url}`);

  // our new router 
    if (req.url === '/' ) {
        //handle homepage routing
        //this is the header
        res.writeHead(200, {'Content-Type': 'text/plain'});
        //this is the body for the homepage
        res.write('Welcome to the Homepage!');
        //this is to show that no more responses are coming 
        res.end();
    } else if (req.url === '/api/posts') {
        //handle posts API routing
        // step 1:define our data in JavaScript object notation
        const posts = [
            {id:1 ,title: 'First-day' , content:'this is content for the first day'},
            {id:2 , title: 'second-day' ,content:'this is content for the second day'},
            {id:3 , title: 'third-day' ,content:'this is content for the third day'}
        ]
        // step 2 : convert the JavaScript object to Json string
        const jsonPosts = JSON.stringify(posts);

        /*  step 3: set the content-type header as we must tell the client that we are sending
        JSON data not plain text and this is critical*/
        res.writeHead(200, {'Content-Type': 'application/json'});

        // step 4 : write the JSON string as response
        res.write(jsonPosts);

        // step 5 : end the response
        res.end(); 
     
    } else {
        //handle 404 - page not found
        
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 Page Not Found');
        res.end();
    }
});

    // Start listening on the configured port
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });