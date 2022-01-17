const {db, pgp} = require('./db');
const _db = require('./db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nFetch = require('node-fetch');

exports.checkLogin =async (username, password) => {
    const table = new pgp.helpers.TableName({table: 'account', schema: 'public'})
    const qStr = pgp.as.format(`Select * From $1 where $2:name=$3` , [table, 'username', username]);
    try{
        const user = await db.any(qStr);
        const checkPassword = await bcrypt.compare(password, user[0].password);
        if (checkPassword && !user[0].locked)
            return user[0];
        return null;
    } catch(e){console.log(e)}
    return null;
}   

exports.add = async (user, role) =>{
    const table = new pgp.helpers.TableName({table: 'account', schema: 'public'})
    let users = null;
    const qS = pgp.as.format(`Select * From $1 where $2:name=$3` , [table, 'username', user.username]);
    try{
        users = await db.any(qS);
        if (users.length != 0){
            return null;
        }
    } catch(e){console.log(e)}

    await bcrypt.genSalt(saltRounds, function(err, salt){
        bcrypt.hash(user.password, salt ,async function (err, hash) {
            const _user = {
                username: user.username,
                password: hash,
                role: role,
                locked: false
            }
            const qStr = pgp.helpers.insert(_user, null, table) + 'RETURNING *';
            try{
                users = await db.any(qStr);
            } catch(e){console.log(e)}
        });
    })
    if (role === 'patient'){
        await nFetch('https:/mysterious-coast-09473.herokuapp.com/account/signup', {method: 'POST',
        headers: {"Accept": "application/json","Content-Type": "application/json"},
        body: JSON.stringify({
            username: user.username,
            password: user.password
        }),
        }).then(async(response)=>{})
    return null;
    }
    return true;
}

exports.changePassword = async (user) =>{
    const table = new pgp.helpers.TableName({table: 'account', schema: 'public'})
    const qStr = pgp.as.format(`Select * From $1 where $2:name=$3` , [table, 'username', user.username]);
    try{
        const users = await db.any(qStr);
        const checkPassword = await bcrypt.compare(user.curPassword, users[0].password);
        if (checkPassword){
            await bcrypt.genSalt(saltRounds, function(err, salt){
                bcrypt.hash(user.password, salt ,async function (err, hash) {
                _db.getQuery(`update account set password = '${hash}' where username = '${user.username}'`)
                });
            })
            return true;
        }
        return null;
    } catch(e){console.log(e)}
}

exports.checkAdmin = async () =>{
    const user = await _db.getQuery(`select * from account where role = 'admin'`);
    if (user.length > 0) 
        return true;
    return null;
}

exports.get = async (username) =>{
    const user = await _db.getQuery(`select * from account where username = '${username}'`);
    if (user.length > 0) 
        return user[0];
    return null;
}

exports.loginPayment = async(user) =>{
    await nFetch('https:/mysterious-coast-09473.herokuapp.com/account/login', {method: 'POST',
        headers: {"Accept": "application/json","Content-Type": "application/json"},
        body: JSON.stringify({
            username: user.username,
            password: user.password
        }),
        }).then(async(response)=>{const token = await response.json();console.log(token); setToken(token.data.authToken); })
    return token;
}

let token = null;
function setToken(k){
    token = k;
}