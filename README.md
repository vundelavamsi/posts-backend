# NodeJS REST API(POSTS)

This is a simple REST API built using Node.js with Express and SQLite for database management. The API allows you to perform CRUD operations on posts, including uploading images to AWS S3.

## Installation
1. Clone this repository:
```bash
    git clone https://github.com/vundelavamsi/posts-backend
```

2. Install dependencies:
```bash
    cd nodejs-rest-api
    npm install
```

3. Set up environment variables:Create a .env file in the root directory with the following variables:
```bash
    PORT = 3000
    AWS_ACCESS_KEY_ID = your_aws_access_key_id
    AWS_SECRET_ACCESS_KEY = your_aws_secret_access_key
    AWS_BUCKET_NAME = your_s3_bucket_name
```
Replace your_aws_access_key_id, your_aws_secret_access_key, and your_s3_bucket_name with your AWS credentials and bucket name.

4. Start the server:
```bash
    node app.js
```


# API Endpoints

## Get All Posts
 - URL: /posts
 - Method: GET
 - Description: Fetches all posts with optional parameters for sorting, pagination, keyword search, and tag filtering.
 - Query Parameters:
    - **sortBy**: Sorts the results by the specified field (default: id DESC).
    - **page**: Specifies the page number for pagination.
    - **pageSize**: Specifies the number of posts per page.
    - **keyword**: Filters posts by keyword in title or description.
    - **tag**: Filters posts by a specific tag.
 - Example:
 ```bash
    https://posts-backend-dp5n.onrender.com/posts?keyword=Titanic
 ```

## Create a New Post
 - URL: /posts
 - Method: POST
 - Description: Creates a new post with title, description, tag, and optional image upload.
 - Request Body:
     - title: Title of the post.
     - description: Description of the post.
     - tag: Tag associated with the post.
     - myPic: Image file to upload.
 - Example
    ```bash
        POST https://posts-backend-dp5n.onrender.com/posts
        Content-Type: multipart/form-data

        title: Example Title
        description: Example Description
        tag: Example Tag
    ```