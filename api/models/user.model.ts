import query from "../utils/DB";
import {comparePassword} from "../utils/Security";

export function findUser(username, password) {
    return new Promise((resolve, reject) => {
        query(`SELECT * FROM users WHERE username = '${username}'`).then((user) => {
            // @ts-ignore
            if (user.length > 0) {
                comparePassword(password, user[0].password, (err, isMatch) => {
                    resolve(user[0])
                   // if (isMatch) {
                   //     resolve(user[0])
                   // } else {
                   //     reject()
                   // }
                })
            }
        })
    })
}