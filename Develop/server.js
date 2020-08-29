// Required libraries
const express = require("express");
const path = require("path");
const fs = require("fs");

// Initialize our express server
const app = express();


// Allow server to set its own port; Default to 8080
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let noteInfo = [];

app.get("/api/notes", function(err, res) {
    try {
      noteInfo = fs.readFileSync("db/db.json", "utf8");
      // Use the parse method to ensure that it becomes an array
      noteInfo = JSON.parse(noteInfo);
  
    } catch (err) {
      console.log(err);
    }
    // Check the response
    console.log("GET request for /api/notes successfully executed");
    res.json(noteInfo);
  });
  
// Publish new notes
  app.post("/api/notes", function(req, res) {
    try {
      // Need to read the file from our directory 
      noteInfo = fs.readFileSync("db/db.json", "utf8");
      console.log(noteInfo);
  
      // Parse to get an array
      noteInfo = JSON.parse(noteInfo);
      req.body.id = noteInfo.length;

      // Push the new note to your array
      noteInfo.push(req.body);

      // Use stringify method to be able to publish to it
      noteInfo = JSON.stringify(noteInfo);

      // Publish new file
      fs.writeFile("db/db.json", noteInfo, "utf8", function(err) {
        if (err) throw err;
      });

      // Use JSON to change the content back into ojects that the browser can then interpret 
      console.log("POST request for /api/notes successfully executed");
      res.json(JSON.parse(noteInfo));
  
    } catch (err) {
      throw err;
    }
  });

  // Delete notes, follow similiar steps as done above
  
  app.delete("/api/notes/:id", function(req, res) {
    try {
      noteInfo = fs.readFileSync("db/db.json", "utf8");
      
      noteInfo = JSON.parse(noteInfo);

      noteInfo = noteInfo.filter(function(note) {
        return note.id != req.params.id;
      });

      noteInfo = JSON.stringify(noteInfo);

      fs.writeFile("db/db.json", noteInfo, "utf8", function(err) {

        if (err) throw err;

      });

      console.log("DELETE request for /api/notes/:id successfully executed");
      
      res.send(JSON.parse(noteInfo));

    } catch (err) {
      throw err;
    }
  });
  
  // GET Requests
  
  app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
    console.log("GET request for /notes successfully executed");
  });
  
  app.get("/api/notes", function(req, res) {
    console.log("GET request for /api/notes was successful.");
    return res.sendFile(path.json(__dirname, "db/db.json"));
  });

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
    console.log("GET request for home page successfully executed");
  });

  // Initialize Server
  app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
  });