import {dbQuery} from "../utils/DB";
import {comparePassword} from "../utils/Security";
import {IUser} from "../interfaces/express.interface";

export function findUser(username, password) {
    return new Promise((resolve, reject) => {
        dbQuery(`SELECT * FROM users WHERE username = '${username}'`).then((user) => {
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
            } else {
                reject(401)
            }
        })
    })
}


export function getUserById(id) {
    return dbQuery(`SELECT * FROM users WHERE id = '${id}'`).then((user: any[]) => {
        if (user.length > 0) {
            return user[0]
        } else {
            return false
        }
    })

}

export function getUserByIdAndCheckIfAdmin(id) {
    return getUserById(id).then((user: IUser) => {
        return user.role === 1;
    })
}

