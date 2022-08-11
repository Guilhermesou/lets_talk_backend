# Let'sTalk Backend

Let'sTalk is a prototype of simple social network build with nodejs API CRUD for studies purpose.

# How to run?

  1. Install all dependencies:
  
    npm install
  
  2. Install Redis server on your machine
  3. Create a .env file with the variables below:
  
    * MONGO_URL
    * PORT (This is the port that the server will use to run)
    * SECRET
    * JWTTOKENEXPIRESIN (Time that the token expires)
    
   4. Run the application with:

     npm start
    
# Routes

  To use all the routes a token has to be provided. The token is obteined in the login route.
  
  ## Authentication routes and logout
  
   * `api/auth/login`
   * `api/auth/register`
   * `api/auth/logout`
   
  ## Users routes
  
   * `GET api/users/`
   * `PUT api/users/:id`
   * `DELETE api/users/:id`
   * `PUT api/users/:id/follow`
   * `PUT api/users/:id/unfollow`

  ## Posts routes
  
  * `POST api/posts/`
  * `GET api/posts/:id`
  * `PUT api/posts/:id`
  * `DELETE api/posts/:id`
  * `PUT api/posts/:id/like`
  * `GET api/posts/profile/:username`
  * `GET api/posts/timeline/:userId`
  
# To do

- [x] Implement acess token
- [ ] Implement refresh token
- [ ] To some refactoring in the code
- [ ] Resolve some bugs
