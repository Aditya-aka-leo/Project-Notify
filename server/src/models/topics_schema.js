const poolPromise = require("../utils/topics");



const getUser = async (req,res) => {
    try {
        const pool = await poolPromise
        const request = pool.request()
        request.input('email', sql.VarChar, email)
        const result = await request.query('SELECT * FROM users WHERE email = @email')
        return result.recordset[0]
    } catch (err) {
        console.log(err)
        return null
    }
}