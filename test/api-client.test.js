import client from '../api-client.js'

suite('client base', () => {
  test('client loads', () => {
    assert.equal(!!client, true);
  });
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
      defaultUrl:'./fakeApi'
    })
    API.forgotUsername({
      params: {
        user: {
          email: "marcus@hhost.me"
        }
      }      
    }).then((ok) => {
      assert.equal(ok, true) 
    })
  })
  test("forgotUsername for a invalid email", () => {
    var API = client({
      defaultUrl:'./fakeApi/'
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
  test("can a user be created",() => {
    localStorage.clear()
    var API = client({
        defaultUrl:'./fakeApi/'
    })
    var name = "test" + (Math.random()+"").replace(".","")
    API.create({
      params: {
        user: {
          username: name,
          email: "marcus@kano.me",
          password: "342340bab5uxexeuee4",
        }
      }
    }).then(() => {
      assert.equal(API.isLoggedIn, name) 
    })
  })
});
