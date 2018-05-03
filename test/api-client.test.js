import client from '../api-client.js'

suite('client base', () => {
  test('client throws if no settings', () => {
    try {
      client()
    } catch(e) { 
      assert.equal(e.message, "settings are needed eg. client({defaultUrl:'./fakeApi'})");
    }
  });
  test('client throws if settings but no default url' , () => {
    try {
      client({})
    } catch(e) { 
      assert.equal(e.message, "defaultUrl is needed eg. client({defaultUrl:'./fakeApi'})");
    }
  });
  test("client loads if client({defaultUrl:'./fakeApi'})" , () => {
    var API = client({
      defaultUrl:'./fakeApi'
    })
    assert.equal(!!API,true) 
  });
  test("make sure there is no user logged in yet" , () => {
    var API = client({
      defaultUrl:'./fakeApi'
    })
    assert.equal(API.isLoggedIn, false) 
  });
  test("has username been not taken", () => {
    var API = client({
      defaultUrl:'./fakeApi'
    })
    var query = "users.marcus7778"
    API.check(query).then((exists) => {
      assert.equal(exists, false)
    })
  })
  test("has username been taken", () => {
    var API = client({
      defaultUrl:'./fakeApi'
    })
    var query = "users.marcus7777"
    API.check(query).then((exists) => {
      assert.equal(exists, true)
    })
  })
  test("forgotUsername for a no email", () => {
    var API = client({
      defaultUrl:'./fakeApi'
      poster: function() {
        return new Promise(function(resolve, reject) { 
          resolve({
            data:"invalid email"
          })
        })
      }
    })
    API.forgotUsername({
      params: {
        user: {
        }
      }      
    }).catch((e) => {
      assert.equal(e.message, "need a params.user.email in the Object") 
    })
  })
  test("forgotUsername for a valid email", () => {
    var API = client({
      defaultUrl:'./fakeApi',
      poster: function() {
        return new Promise(function(resolve, reject) { 
          resolve({
            data: "true"
          })
        })
      }
    })
    API.forgotUsername({
      params: {
        user: {
          email: "marcus@hhost.me"
        }
      }      
    }).then((ok) => {
      assert.equal(!!ok, true) 
    })
  })
  test("forgotUsername for a invalid email", () => {
    var API = client({
      defaultUrl:'./fakeApi/',
      poster: function() {
        return new Promise(function(resolve, reject) { 
          reject()
        })
      }
    })
    API.forgotUsername({
      params: {
        user: {
          email: "1234567890f7ypfy873pf12345678912@34567.com"
        }
      }      
    }).then(() => {
      assert.equal(1,0) 
    }).catch((e) => {
      assert.equal(e.message,"invalid email") 
    })
  })
  test("forgotPassword for a no username", () => {
    var API = client({
      defaultUrl:'./fakeApi'
    })
    API.forgotPassword({
      params: {
        user: {
        }
      }      
    }).catch((e) => {
      assert.equal(e.message, "need a params.user.username in the Object") 
    })
  })
  test("forgotPassword for a valid username", () => {
    var API = client({
      defaultUrl:'./fakeApi',
      poster: function() {
        return new Promise(function(resolve, reject) { 
          resolve({
            data:"true"
          })
        })
      }
    })
    API.forgotPassword({
      params: {
        user: {
          username: "marcus@hhost.me"
        }
      }      
    }).then((ok) => {
      assert.equal(!!ok, true) 
    })
  })
  test("forgotPassword for a invalid username", () => {
    var API = client({
      defaultUrl:'./fakeApi/',
      poster: function() {
        return new Promise(function(resolve, reject) { 
          reject()
        })
      }
    })
    API.forgotPassword({
      params: {
        user: {
          username: "1234567890f7ypfy873pf12345678912@34567.com"
        }
      }      
    }).then(() => {
      assert.equal(1,0) 
    }).catch((e) => {
      assert.equal(e.message,"invalid email") 
    })
  })
  test("can a user be created",() => {
    localStorage.clear()
    var name = "test" + (Math.random()+"").replace(".","")
    var API = client({
      defaultUrl:'./fakeApi/',
      poster: function() {
        return new Promise(function(resolve) { 
          resolve(JSON.parse(`{"data":{"duration":"57600000","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI4NjU3OTUuMTA1LCJ1c2VyIjp7ImlkIjoiNWFlOWI1ODJhODJkOWYyNmVjNmVhMmVhIiwicm9sZXMiOltdfX0.0HwbZkelvGFAxX51ihNeNFRqh79xti_jOmn_EyYNsGU","user":{"id":"5ae9b582a82d9f26ec6ea2ea","roles":[],"modified":"2018-05-02T12:56:35.075266"}},"path":"/users/5ae9b582a82d9f26ec6ea2ea"}`)
          )
        })
      }
    })
    API.create({
      params: {
        user: {
          username: name,
          email: "marcus@kano.me",
          password: "342340bab5uxexeuee4",
        }
      },
      populate:{
        id:"user.id"
      }
    }).then((user) => {
      assert.equal(user.id, "5ae9b582a82d9f26ec6ea2ea") 
    })
  })
});
