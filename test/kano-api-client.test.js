import client from '../kano-api-client.js';

const fakeApiUrl = './fakeApi/';

const ls = {
    _data: {},
    setItem(id, val) { return this._data[id] = val; },
    getItem(id) { return this._data[id]; },
    removeItem(id) { return delete this._data[id]; },
    clear() { return this._data = {}; },
};

suite('client base', () => {
    test('client throws if no settings', () => {
        try {
            client();
        } catch (e) {
            assert.equal(e.message, "settings are needed eg. client({defaultUrl:'./fakeApi'})");
        }
    });
    test('client throws if settings but no default url', () => {
        try {
            client({});
        } catch (e) {
            assert.equal(e.message, "defaultUrl is needed eg. client({defaultUrl:'./fakeApi'})");
        }
    });
    test("client loads if client({defaultUrl:'./fakeApi'})", () => {
        const API = client({
            defaultUrl: fakeApiUrl,
        });
        assert.ok(API);
    });
    test('make sure there is no user logged in yet', () => {
        const API = client({
            defaultUrl: fakeApiUrl,
        });
        assert.equal(API.isLoggedIn, false);
    });
    test('has username been not taken', () => {
        const API = client({
            defaultUrl: fakeApiUrl,
            getDataFromServer: () => new Promise((resolve) => {
                resolve({ data: 'false' });
            }),
        });
        const query = 'users.marcus7778';
        API.check(query).then((exists) => {
            assert.equal(exists, false);
        });
    });
    test('has username been taken', () => {
        const API = client({
            defaultUrl: fakeApiUrl,
            getDataFromServer: () => new Promise((resolve) => {
                resolve({ data: 'true' });
            }),
        });
        const query = 'users.marcus7777';
        API.check(query).then((exists) => {
            assert.equal(exists, true);
        });
    });
    test('forgotUsername for a no email', () => {
        const API = client({
            defaultUrl: fakeApiUrl,
        });
        try {
            API.forgotUsername({
                params: {
                    user: {
                    },
                },
            });
        } catch (e) {
            assert.equal(e.message, 'need a params.user.email in the Object');
        }
    });
    test('forgotUsername for a valid email', () => {
        const API = client({
            defaultUrl: fakeApiUrl,
            poster() {
                return new Promise(((resolve, reject) => {
                    resolve({
                        data: 'true',
                    });
                }));
            },
        });
        API.forgotUsername({
            params: {
                user: {
                    email: 'marcus@hhost.me',
                },
            },
        }).then((ok) => {
            assert.ok(ok);
        });
    });
    test('forgotUsername for a invalid email', () => {
        const API = client({
            defaultUrl: fakeApiUrl,
        });
        try {
            API.forgotUsername({
                params: {
                    user: {
                        email: '1234567890f7ypfy873pf1234567891234567.com',
                    },
                },
            });
        } catch (e) {
            assert.equal(e.message, 'invalid email');
        }
    });
    test('forgotPassword for a no username', () => {
        const API = client({
            defaultUrl: fakeApiUrl,
        });
        try {
            API.forgotPassword({
                params: {
                    user: {
                    },
                },
            });
        } catch (e) {
            assert.equal(e.message, 'need a params.user.username in the Object');
        }
    });
    test('forgotPassword for a valid username', () => {
        const API = client({
            defaultUrl: fakeApiUrl,
            poster() {
                return new Promise(((resolve, reject) => {
                    resolve({
                        data: 'true',
                    });
                }));
            },
        });
        API.forgotPassword({
            params: {
                user: {
                    username: 'marcus7777',
                },
            },
        }).then((ok) => {
            assert.ok(ok);
        });
    });
    test('forgotPassword for a invalid username', () => {
        const API = client({
            defaultUrl: fakeApiUrl,
            poster() {
                return new Promise(((resolve, reject) => {
                    reject();
                }));
            },
        });
        try {
            API.forgotPassword({
                params: {
                    user: {
                        username: '...',
                    },
                },
            }).then(() => {
                assert.equal(1, 0);
            });
        } catch (e) {
            assert.equal(e.message, 'invalid username');
        }
    });
});
suite('client user', () => {
    const name = 'testing';
    const hashOfName = 'z4DNiu1ILV0VJ9fccvzv+E5jJlkoSER9LcCw6H38mpA=';
    const password = 'm0nk3y123';
    const keyFromNameAndPassword = 'U2E8RFhyMWpvho4pDlB3q-9smxdWU_WzVj_Tc1aDC7Y';

    test('can a user be created', () => {
        localStorage.clear();
        const API = client({
            defaultUrl: fakeApiUrl,
            poster() {
                return new Promise(((resolve) => {
                    resolve(JSON.parse('{"data":{"duration":"57600000","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI4NjU3OTUuMTA1LCJ1c2VyIjp7ImlkIjoiNWFlOWI1ODJhODJkOWYyNmVjNmVhMmVhIiwicm9sZXMiOltdfX0.0HwbZkelvGFAxX51ihNeNFRqh79xti_jOmn_EyYNsGU","user":{"id":"5ae9b582a82d9f26ec6ea2ea","roles":[],"modified":"2018-05-02T12:56:35.075266"}},"path":"/users/5ae9b582a82d9f26ec6ea2ea"}'),
                    );
                }));
            },
        });
        return API.create({
            params: {
                user: {
                    username: name,
                    email: 'marcus@kano.me',
                    password,
                },
            },
            populate: {
                id: 'user.id',
            },
        }).then(async (user) => {
            assert.equal(await user.id, '5ae9b582a82d9f26ec6ea2ea');
        });
    });
    test('user is logged in', () => {
        localStorage.clear();
        const API = client({
            defaultUrl: fakeApiUrl,
            poster: () => new Promise((resolve) => {
                resolve(JSON.parse('{"data":{"duration":"57600000","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI4NjU3OTUuMTA1LCJ1c2VyIjp7ImlkIjoiNWFlOWI1ODJhODJkOWYyNmVjNmVhMmVhIiwicm9sZXMiOltdfX0.0HwbZkelvGFAxX51ihNeNFRqh79xti_jOmn_EyYNsGU","user":{"id":"5ae9b582a82d9f26ec6ea2ea","roles":[],"modified":"2018-05-02T12:56:35.075266"}},"path":"/users/5ae9b582a82d9f26ec6ea2ea"}'));
            }),
            getDataFromServer: () => new Promise((resolve) => {
                resolve(JSON.parse('{"data":{"duration":"57600000","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI4NjU3OTUuMTA1LCJ1c2VyIjp7ImlkIjoiNWFlOWI1ODJhODJkOWYyNmVjNmVhMmVhIiwicm9sZXMiOltdfX0.0HwbZkelvGFAxX51ihNeNFRqh79xti_jOmn_EyYNsGU","user":{"id":"5ae9b582a82d9f26ec6ea2ea","roles":[],"modified":"2018-05-02T12:56:35.075266"}},"path":"/users/5ae9b582a82d9f26ec6ea2ea"}'));
            }),
        });
        return API.login({
            params: {
                user: {
                    username: name,
                    password,
                },
            },
        }).then(() => {
            assert.equal(API.isLoggedIn, name);
        });
    });
    test('user is logged in and out', () => {
        localStorage.clear();

        const API = client({
            defaultUrl: fakeApiUrl,
            poster: () => new Promise((resolve) => {
                resolve(JSON.parse('{"data":{"duration":"57600000","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI4NjU3OTUuMTA1LCJ1c2VyIjp7ImlkIjoiNWFlOWI1ODJhODJkOWYyNmVjNmVhMmVhIiwicm9sZXMiOltdfX0.0HwbZkelvGFAxX51ihNeNFRqh79xti_jOmn_EyYNsGU","user":{"id":"5ae9b582a82d9f26ec6ea2ea","roles":[],"modified":"2018-05-02T12:56:35.075266"}},"path":"/users/5ae9b582a82d9f26ec6ea2ea"}'));
            }),
            getDataFromServer: () => new Promise((resolve) => {
                resolve(JSON.parse('{"data":{"duration":"57600000","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODI4NjU3OTUuMTA1LCJ1c2VyIjp7ImlkIjoiNWFlOWI1ODJhODJkOWYyNmVjNmVhMmVhIiwicm9sZXMiOltdfX0.0HwbZkelvGFAxX51ihNeNFRqh79xti_jOmn_EyYNsGU","user":{"id":"5ae9b582a82d9f26ec6ea2ea","roles":[],"modified":"2018-05-02T12:56:35.075266"}},"path":"/users/5ae9b582a82d9f26ec6ea2ea"}'));
            }),
        });
        return API.login({
            params: {
                user: {
                    username: name,
                    password,
                },
            },
        }).then(() => API.logout()).then(() => {
            assert.ok(localStorage.getItem(hashOfName), 'not save encryptString');
            return assert.equal(API.isLoggedIn, false);
        });
    });
    test('logout should return promise', () => {
        localStorage.clear();

        const API = client({
            defaultUrl: fakeApiUrl,
        });
        API.logout().then(() => assert.equal(API.isLoggedIn, false));
    });
    test('user is logged in if off-line', () => {
        ls.setItem(hashOfName, 'xyEQklDaPj/JfcGsZ+y3WGSmmBBB30exF/Yr6Br86nkgNvvpG0aKdR3wkCyxcDDOAGhNcbLFTWLKG8ov2PPxKz95tYuLMrDa1NE9Fn9AJHVMiYHlgkWzKe+vRaUMO2YGtAZyB/y7U1lX+un8JQfauX/Az7myXeeLq6C4+YzHzTRBuE5Q3bxh1uG9mmHEwqN/cYDA87MpqiTprhMCuUpod8Ven3jpgoVnHuCLkOaUDycgJXwLnasa4PVKoCBiGICLQ/nc78uNmJuL1NgHL2pE64I42ha2+cUDKYf6Zbpzop9H4+P2HTl0v+OZYJMumYaP+iN9NWVRV+yyP7ub4fpHFJb7jyp42kN1eT4lNiq74DcUHks2kBCZunKqeJDmE+xPciql9C53AQVr5+5q/YBxgqw0oOoWeXI5pZ2nXwpn+Fuo4+mzXN414PqTD3omlIJzojCmsIC8u24ZdQxuaT3kq0NL2KxsWM3XQ+GGP4Ol4bUTiUwwIhbmLvyhtylutjiBY/2GDpbX5bCPlEU2WGijsBmRaQIBe2y4nliUNyvT8dT85PBNNBWGU/2eICLxXcxwdAycSoJ/1kqPsdnw4+i95WFhI9iARCosnBzMZQ8tkilrBVD82wN1pAO7rcxwwBmm69vEUm3Tdbm0lXwTx45NKU2dPFr0EUvWV4Mo/0CAyg6qqLKqj1dm9CdvIVK4N+OBao2EoajUepQhOUADM+zX92lJr01/0r+945nupwOlaul2mrPDbjlnEzx4zCFjbFajZIAv0sE9Nh+uIriGo2IegtJa2pIiTzTVEaV+Wd0WZdxReKkfpIYcat1D2kWnQZirkAwI3h+XuVndUbwTo5NQheQIl9hayVXPyaoomIe4jlH8+3VanW8U6DVU90P64AZT');
        ls.setItem(`${hashOfName}iv`, '136,179,253,164,23,155,253,237,52,133,22,146,93,125,19,237');

        const API = client({
            defaultUrl: fakeApiUrl,
            poster: () => {
                throw new Error('offline');
            },
            getDataFromServer: () => {
                throw new Error('offline');
            },
            localStorage: ls,
        });
        return API.login({
            params: {
                user: {
                    username: name,
                    password,
                },
            },
        }).then(() => {
            assert.ok(ls.getItem('user'), 'not load decrypted user');
            return assert.equal(API.isLoggedIn, name);
        });
    });
});
