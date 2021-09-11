
# Authentication Rest Api

Rest api for authentication with jsonwebtoken and rate limiter to endpoints

## TechStack

- Express
- JsonWebToken
- MongoDB
- Redis


  
## Documentation

- Register
https://node-rest-authentication-apiv1.herokuapp.com/auth/register

{
    "email":"exy@gmail.com"
    "password": "12345678" 
    <!-- password length should be greater than 8 -->
}
  
- Login
https://node-rest-authentication-apiv1.herokuapp.com/auth/login 

{
    "email":"exy@gmail.com"
    "password": "12345678" 
}

- Check
https://node-rest-authentication-apiv1.herokuapp.com/auth/check 

Pass Authorization header with Bearer jwt 