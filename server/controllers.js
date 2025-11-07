/*this is where our controller functions live and our logic
 for handling requests will be defined */

 //importing the file system module 
 const fs = require('fs');
 //importing the file path to help us build file paths
 const path = require('path');
 // 3. Define the path to our database file
// '__dirname' is a special variable in Node.js that gives you
// the absolute path of the *current file* (i.e., .../server/)
const dbPath = path.join(__dirname, 'db.json')

/*helper function to help us read from the DB .we will make a reusable function
to read our data  */
function readDatabase() {
    // fs.readFileSync is a *synchronous* way to read a file.
    // This is simple for now, but we'll make it async later.
    // It reads the file and returns its content as a string.
    const fileContent = fs.readFileSync(dbPath, 'utf8');
    // We parse the JSON string into a JavaScript object
    return JSON.parse(fileContent);
}
// Add this helper function in controllers.js, near readDatabase
function writeDatabase(data) {
    // fs.writeFile is *asynchronous*.
    // It takes the file path, the string data to write, and a 'callback'
    // function to run *after* it's done (or if an error occurs).
    fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to database:', err);
        } else {
            console.log('Database updated successfully!');
        }
    });
}
/*controller 1 : handling GET /api/posts */
// ... in controllers.js ...

function getPosts(req, res) {
    try {
        // This function is now "safe" and will never throw an error
        // that crashes our controller.
        const data = readDatabase();
        const posts = data.posts || []; // Default to empty array just in case
        
        // Set header and send response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(posts));

    } catch (error) {
        // This is a "just in case" catch-all
        console.error("Critical error in getPosts:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

/*controller 2 : handling POST /api/posts */
// ... in controllers.js ...

function createPost(req, res) {
    let body = '';
    
    req.on('data', (chunk) => {
        body += chunk.toString(); 
    });

    req.on('end', () => {
        try {
            // 1. Get the new post data from the request
            const newPostData = JSON.parse(body);

            // Validation: ensure title and content are present and non-empty strings
            if (!newPostData || typeof newPostData.title !== 'string' || newPostData.title.trim() === '' || typeof newPostData.content !== 'string' || newPostData.content.trim() === '') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request: title and content are required and must be non-empty strings.' }));
                return;
            }

            // --- THIS IS THE NEW DATABASE LOGIC ---
            
            // 2. Read the *current* database
            const data = readDatabase();
            
            // 3. Create a new ID
            // Find the highest current ID and add 1
            const lastPost = data.posts[data.posts.length - 1];
            const newId = lastPost ? lastPost.id + 1 : 1;
            
            // 4. Create the full post object
            const newPost = { 
                id: newId, 
                title: newPostData.title, 
                content: newPostData.content 
            };
            
            // 5. Add the new post to the array
            data.posts.push(newPost);
            
            // 6. Write the *entire updated object* back to the file
            writeDatabase(data);
            
            // ------------------------------------

            // 7. Send the response
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                message: 'Post created and saved!', 
                post: newPost 
            }));
        
        } catch (error) {
            // Handle bad JSON
            console.error('Error parsing JSON body:', error.message);
            res.writeHead(400, { 'Content-Type': 'text/plain' }); // 400 = Bad Request
            res.end('Invalid JSON format');
        }
    });
}
/*controller 3 : handling homepage */
function getHomepage(req,res) {
    //setting the content header of the response
    res.writeHead(200, {'Content-Type': 'text/plain'});
    //writing the body response from the header of the GET request
    res.write('welcome to the Homepage!!!');
    //ending the response
    res.end();
}

/*controller 4 : handling 404 Not Found */
function handleNotFound(req, res) {
    //setting the content header of the response
    res.writeHead(404, {'Content-Type': 'text/plain'});
    //writing the body response from the header of the GET request
    res.write('404 Not Found');
    //ending the response
    res.end();
}

/* exporting the functions we made which are controller functions with logic
so that other files like our router will import and use this core of modularity */
module.exports = {
    getPosts,
    createPost,
    getHomepage,
    handleNotFound
};