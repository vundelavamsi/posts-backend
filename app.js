// Required Depedencies
require("dotenv").config();

const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

// AWS Config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();
const myBucket = process.env.AWS_BUCKET_NAME;

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: myBucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    Key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

//Express instance
const app = express();

const dbPath = path.join(__dirname, "posts.db");

// Database Connection Establishment
let db = null;
const initializeDbServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log("Database Connected");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDbServer();

app.use(bodyParser.json());
app.use(cors());

// Get Request to get all posts with includeed paramaters as wll
app.get("/posts", async (req, res) => {
  try {

    const { sortBy, page, pageSize, keyword, tag} = req.query;
    const limit = pageSize ? parseInt(pageSize) : 10;
    const offset = page ? (parseInt(page) - 1) * limit : 0;
    const orderBy = sortBy ? sortBy : "id";

    let whereClause = "";
    if (keyword) {
      whereClause += `title LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`;
    }
    if (tag) {
      whereClause += whereClause ? ` AND tag = '${tag}'` : `tag = '${tag}'`;
    }

    const query = `SELECT * FROM posts ${whereClause ? `WHERE ${whereClause}` : ''} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`;
    const posts = await db.all(query);
    res.send(posts);
  
} catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
});

// Post request to create a new post and upload image to AWS S3 Bucket and get the url and post it to database.
app.post("/posts", upload.single("myPic"), async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const imageUrl = req.file ? req.file.location : null;
    const post = await db.run(
      `INSERT INTO Posts (title, description, tag, imageUrl) VALUES (?, ?, ?, ?)`,
      [title, description, tag, imageUrl]
    );
    console.log(req.file);
    res.send("Successfully Uploaded");
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
});
