# Accounts and Authentication

## Add and import the library
First of all, you have to add the library as a bower dependency:
```js
bower i KanoComputing/kano-api-client.git
```
Then import and initialize it like this:
```js
import ApiClient from '../../bower_components/kano-api-client/kano-api-client.js';

const API = ApiClient({
    defaultUrl: Config.WORLD_URL,
    resolve: true,
    log: true,
});
```

## Get only the data you need
You can ask for each field you want to return, inside 'populate', in these calls:

- `Signup`
- `Login`
- `...`

The fields you can ask for return are:

- `id`
- `username`
- `avatar`
- `followers`
- `following`
- `email`
- `...`

## Signup
```js
API.create({
    params: {
        user: {
            username: 'bananabanana',
            password: 'myCoolSecretPassword',
            email: 'banana@bananacompany.me',
        },
    },
    populate: {
        id: 'user.id',
        username: 'user.username',
    },
}).then((data) => {
    /*
      The structure of data will be something like this:
      {
          id: 'reg4yDB854anyjSbd35G',
          username: 'bananabanana'
      }
    */
}).catch((err) => {
    // Oh no, we have an error!
    throw new Error(err);
});
```

## Login
```js
API.login({
    params: {
        username: 'bananabanana',
        password: 'myCoolSecretPassword',
    },
    populate: {
        id: 'user.id',
        username: 'user.username',
        email: 'user.email',
    },
}).then((data) => {
    /*
      The structure of data will be something like this:
      {
          id: 'reg4yDB854anyjSbd35G',
          username: 'bananabanana',
          email: 'banana@bananacompany.me'
      }
    */
}).catch((err) => {
    // Oh no, we have an error!
    throw new Error(err);
});
```

## Forgot Username
```js
API.forgotUsername({
    params: {
        user: {
            email,
        },
    },
}).then((result) => {
    console.log(result);
}).catch((err) => {
    throw new Error(err);
});
```

## Forgot Password
```js
API.forgotPassword({
    params: {
        user: {
            username,
        },
    },
}).then((result) => {
    console.log(result);
}).catch((err) => {
    throw new Error(err);
});
```

## Logout
```js
API.logout();
```
