/* this is the core node.js module */
const http = require('http');
/* we import our new router!! */
const router = require('./router.js');
/* configuration */
const PORT = 3000;

/*this is server creation here we create the server and tell it to
use our 'router' */
const server = http.createServer(router);


// Start listening on the configured port
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
