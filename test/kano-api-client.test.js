import client from '../kano-api-client.js'

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
    assert.ok(API) 
  });
  test("make sure there is no user logged in yet" , () => {
    var API = client({
      defaultUrl:'./fakeApi'
    })
    assert.equal(API.isLoggedIn, false) 
  });
  test("has username been not taken", () => {
    var API = client({
      defaultUrl:'./fakeApi',
      getDataFromServer: () => {
        return new Promise((resolve) => {
          resolve({data:"false"})
        })
      },
    })
    var query = "users.marcus7778"
    API.check(query).then((exists) => {
      assert.equal(exists, false)
    })
  })
  test("has username been taken", () => {
    var API = client({
      defaultUrl:'./fakeApi',
      getDataFromServer: () => {
        return new Promise((resolve) => {
          resolve({data:"true"})
        })
      },
    })
    var query = "users.marcus7777"
    API.check(query).then((exists) => {
      assert.equal(exists, true)
    })
  })
  test("forgotUsername for a no email", () => {
    var API = client({
      defaultUrl:'./fakeApi',
    })
    try {
      API.forgotUsername({
        params: {
          user: {
          }
        }      
      })
    } catch (e) {
      assert.equal(e.message, "need a params.user.email in the Object") 
    }
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
      assert.ok(ok) 
        
    })
  })
  test("forgotUsername for a invalid email", () => {
    var API = client({
      defaultUrl:'./fakeApi/',
    })
    try {
      API.forgotUsername({
        params: {
          user: {
            email: "1234567890f7ypfy873pf1234567891234567.com"
          }
        }      
      })
    } catch(e) {
      assert.equal(e.message,"invalid email") 
    }
  })
  test("forgotPassword for a no username", () => {
    var API = client({
      defaultUrl:'./fakeApi'
    })
    try {
      API.forgotPassword({
        params: {
          user: {
          }
        }      
      })
    } catch(e) {
      assert.equal(e.message, "need a params.user.username in the Object") 
    }
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
          username: "marcus7777"
        }
      }      
    }).then((ok) => {
      assert.ok(ok)
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
    try {
      API.forgotPassword({
        params: {
          user: {
            username: "..."
          }
        }      
      }).then(() => {
        assert.equal(1,0) 
      })
    } catch(e) {
      assert.equal(e.message,"invalid username") 
    }
  })
})
suite('client user', () => {
  var name = "testing"
  var hashOfName = "z4DNiu1ILV0VJ9fccvzv+E5jJlkoSER9LcCw6H38mpA="
  var password = "m0nk3y123"
  var keyFromNameAndPassword = "U2E8RFhyMWpvho4pDlB3q-9smxdWU_WzVj_Tc1aDC7Y"

  test("can a user be created",() => {
    localStorage.clear()
    var API = client({
      defaultUrl:'./fakeApi/',
      poster: function() {
        return new Promise(function(resolve) { 
          resolve(JSON.parse(`{"data":{"duration":"57600000","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI4NjU3OTUuMTA1LCJ1c2VyIjp7ImlkIjoiNWFlOWI1ODJhODJkOWYyNmVjNmVhMmVhIiwicm9sZXMiOltdfX0.0HwbZkelvGFAxX51ihNeNFRqh79xti_jOmn_EyYNsGU","user":{"id":"5ae9b582a82d9f26ec6ea2ea","roles":[],"modified":"2018-05-02T12:56:35.075266"}},"path":"/users/5ae9b582a82d9f26ec6ea2ea"}`)
          )
        })
      }
    })
    return API.create({
      params: {
        user: {
          username: name,
          email: "marcus@kano.me",
          password,
        }
      },
      populate:{
        id:"user.id"
      }
    }).then( async (user) => {
      assert.equal(await user.id, "5ae9b582a82d9f26ec6ea2ea") 
    })
  })
  test("user is logged in",() => {
    localStorage.clear()
    var API = client({
      defaultUrl:'./fakeApi/',
      poster: () => {
        return new Promise((resolve) => {
          resolve(JSON.parse(`{"data":{"duration":"57600000","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI4NjU3OTUuMTA1LCJ1c2VyIjp7ImlkIjoiNWFlOWI1ODJhODJkOWYyNmVjNmVhMmVhIiwicm9sZXMiOltdfX0.0HwbZkelvGFAxX51ihNeNFRqh79xti_jOmn_EyYNsGU","user":{"id":"5ae9b582a82d9f26ec6ea2ea","roles":[],"modified":"2018-05-02T12:56:35.075266"}},"path":"/users/5ae9b582a82d9f26ec6ea2ea"}`))
        })
      },
      getDataFromServer: () => {
        return new Promise((resolve) => {
          resolve(JSON.parse(`{"data":{"duration":"57600000","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI4NjU3OTUuMTA1LCJ1c2VyIjp7ImlkIjoiNWFlOWI1ODJhODJkOWYyNmVjNmVhMmVhIiwicm9sZXMiOltdfX0.0HwbZkelvGFAxX51ihNeNFRqh79xti_jOmn_EyYNsGU","user":{"id":"5ae9b582a82d9f26ec6ea2ea","roles":[],"modified":"2018-05-02T12:56:35.075266"}},"path":"/users/5ae9b582a82d9f26ec6ea2ea"}`))
        })
      },
    })
    return API.login({
      params: {
        user: {
          username: name,
          password,
        }
      }    
    }).then(() => {
      assert.equal(API.isLoggedIn, name)
    })
  })
  test("user is logged in and out",() => {
    localStorage.clear()

    var API = client({
      defaultUrl:'./fakeApi/',
      poster: () => {
        return new Promise((resolve) => {
          resolve(JSON.parse(`{"data":{"duration":"57600000","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI4NjU3OTUuMTA1LCJ1c2VyIjp7ImlkIjoiNWFlOWI1ODJhODJkOWYyNmVjNmVhMmVhIiwicm9sZXMiOltdfX0.0HwbZkelvGFAxX51ihNeNFRqh79xti_jOmn_EyYNsGU","user":{"id":"5ae9b582a82d9f26ec6ea2ea","roles":[],"modified":"2018-05-02T12:56:35.075266"}},"path":"/users/5ae9b582a82d9f26ec6ea2ea"}`))
        })
      },
      getDataFromServer: () => {
        return new Promise((resolve) => {
          resolve(JSON.parse(`{"data":{"duration":"57600000","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI4NjU3OTUuMTA1LCJ1c2VyIjp7ImlkIjoiNWFlOWI1ODJhODJkOWYyNmVjNmVhMmVhIiwicm9sZXMiOltdfX0.0HwbZkelvGFAxX51ihNeNFRqh79xti_jOmn_EyYNsGU","user":{"id":"5ae9b582a82d9f26ec6ea2ea","roles":[],"modified":"2018-05-02T12:56:35.075266"}},"path":"/users/5ae9b582a82d9f26ec6ea2ea"}`))
        })
      },
    })
    return API.login({
      params: {
        user: {
          username: name,
          password,
        }
      }    
    }).then(() => {
      return API.logout()
    }).then(() => {
      assert.ok(localStorage.getItem(hashOfName), "not save encryptString")
      return assert.equal(API.isLoggedIn, false)
    })
  })
  test("logout should return promise",() => {
    localStorage.clear()

    var API = client({
      defaultUrl:'./fakeApi/',
    })
    API.logout().then(() => {
      return assert.equal(API.isLoggedIn, false)
    })
  })
  //test("user is logged in if off-line",() => {
    //localStorage.setItem(hashOfName,"yVisPTCz+wN8WRQQQjgizfnYgQooVsZHs0ehfAcVplUWgjyUJRsoffZKZiA+/jTxey+rnbpfYxG5kPdQHuhsiA9c275fWZO5JsvPbK43Pqh2xdBMqrjoZ8x0Tr85BeFjr0zKSUh5LxLU9W4Lhnqu4FL//wePrnUb7K4rAb1tjqIWhITa8oELRTqxQKjK6u5WyanQ/QfNCbFGeiOtnZ9zQ4APjFIpftSNAMAyS2c4645Qsrxk3/Sb8nxnFUzt5QXH1PZeQGk7fOUMwC4DtX/f6Vg/3EkN49j+USDH4dZtJBkAWYDzOsgbz9Knl/1mca2waD7BOGPhvt+87miEfFNMbVU4k9yVNOYX1kqTKz1+f8Ra0h9IbieHnheWlHnFzkInyW0o87BaeDSz4wKIJi0CXsl09BneBfo9noJG+oRsqhN5lSolGsJ9+C0GVd4ZZDSlTjP2F0TBp/b+iAGYiZnh20XmBngWyvNohUgEpKevm8UtqGq+cfDLwlqbIk26rIpjhM/0lw6E3BEJY+TCUZr0QJc7VB5lsaIgEJu7RyHyfIpYeUOHbykNEapTjIYSh7l5+mWZPs8W0Q4nPmEgOkLyjw51wlDaUGKyFh5QX21Akjp9PvQACKSClbxLXbNRmmg6kf3zrYxusJFjNeSfgWD96SOQHJF8M6GD6aEyn0WllBYa9/PgwL24CS3j1xvRujB95y607dIHKtIDUcIjqw2ngEFPsZ1HFMq0uS46EIdHiRN/+RhAQ36vkvl+KFPT/xlJQVY4DL/u/ztTM+zYvN5uIw8cXMaIooBJcA/TfA46LRrJgTuln/NIkIJnraX1A6A3ZuS3z67R6Gs84gXhSm3V7ykoJa/4hJDqiN5K1UsomLE8BziTnxg69e5nQY8j6D80ojoEMJX8lhEuAS3MEpQKgVq0lHT/VyfS4lxTstOO6y4QIh0H+n6Xuf91Y3tW6gxy21ZTd0sZaEINIImOBlOwKSj6dMqKn4fZgz5FRVkpY1XOsEG6kyX5osVlwlKkJY/P7v4lmIstvAtcaGwS6a/VuPaQch6YvN4mGi7qWHwcNKg=")
    //localStorage.setItem(hashOfName+"iv","103,183,10,108,1,183,119,133,4,7,122,221,35,156,167,214")
    //var API = client({
      //defaultUrl:'./fakeApi/',
      //poster: () => {
        //throw new Error('offline')
      //},
      //getDataFromServer: () => {
        //throw new Error('offline')
      //},
    //})
    //return API.login({
      //params: {
        //user: {
          //username: name,
          //password,
        //}
      //}    
    //}).then(() => {
      //assert.ok(localStorage.getItem("user"), "not load decrypted user")
      //return assert.equal(API.isLoggedIn, name)
    //})
  //})

});
