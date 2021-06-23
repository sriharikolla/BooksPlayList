const express = require('express')
//const graphqlHTTP = require('express-graphql')
//const { expressGraphQL } = require('express-graphql')
const expressGraphQL = require('express-graphql').graphqlHTTP
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
//allow cross orgin

app.use(cors())
mongoose.connect('mongodb+srv://Sri:test123@cluster0.ggsqf.mongodb.net/BookStoreDB?retryWrites=true&w=majority',{ useUnifiedTopology: true },{ useNewUrlParser: true })
//mongoose.connect('mongodb+srv://Sri:test123@cluster0.ggsqf.mongodb.net/test')
mongoose.connection.once('open',()=>
{console.log('connected to mongoose DB')}
)
app.use('/graphql',expressGraphQL({
    schema:schema,
    graphiql: true
    

}))
app.listen(4000,()=>{console.log("Now Listening the requests on Port# 4000");})