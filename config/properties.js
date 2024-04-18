require ('dotenv').config()

user=process.env.user
password=process.env.password
db=process.env.db

module.exports = {
    PORT:3000,
    DB: `mongodb+srv://${user}:${password}@cluster0.pyncer0.mongodb.net/${db}?retryWrites=true&w=majority`

}

