const graphql = require('graphql')
const _ = require('lodash')
const Book = require('../models/book')
const Author = require('../models/author')
const {GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema
    } = graphql

// var books =[ {name:'BOOKONEFRICTION',genre:'FRICTION',id:'1',authorid:'1'},
// {name:'BOOKTWOFRICTION',genre:'FRICTION',id:'2',authorid:'2'},
// {name:'BOOKTHREESCIFI',genre:'SCIFI',id:'3',authorid:'3'},
// {name:'BOOKFOURSCIFI',genre:'SCIFI',id:'4',authorid:'2'},
// {name:'BOOKFIVEFANTASY',genre:'FANTASY',id:'5',authorid:'3'},
// {name:'BOOKSIXFRICTION',genre:'FRICTION',id:'6',authorid:'3'}]


// var authors =[ {name:'AuthorONEFRICTION',age:'39',id:'1'},
// {name:'AuthorTWOFRICTION',age:'59',id:'2'},
// {name:'AuthorTHREESCIFI',age:'66',id:'3'}]

const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
           // return _.find(authors,{id:parent.authorid})
           return Author.findById(parent.authorid)
            }
        }        
    })
})

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
         age:{type:GraphQLInt},
         books:{type:new GraphQLList(BookType),
            resolve(parent,args)
                {
                 //   return _.filter(books,{authorid:parent.id})
                 return Book.find({authorid:parent.id})
            }
        
        }
        
        
    })
})


    const RootQuery = new GraphQLObjectType({
        name:'RootQueryType',
        fields:{
            book:{
            type:BookType,
            args: { id:{type:GraphQLID}},
            resolve(parent,args){
                //code to get DB from data source
               //return _.find(books,{id:args.id})
               return Book.findById(args.id)
              }

            },      
            author: {
            type:AuthorType,
            args:{ id:{type:GraphQLID}},
            resolve(parent,args){
                //code to get DB from data source
             //  return _.find(authors,{id:args.id})
             return Author.findById(args.id)
             }

          },
          books:{
              type: new GraphQLList(BookType),
              resolve(parent,args)
              {
                //  return books
                return Book.find({})
              }
             
          },
          authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args)
            {
              //  return authors
              return Author.find({})
            }
           
        }
        }    
        
    })
       
const Mutation = new GraphQLObjectType({
                name:'Mutation',
                fields:{
                    addAuthor:{
                        type:AuthorType,
                        args:{
                            name:{type:new GraphQLNonNull(GraphQLString)},
                            age: {type:new GraphQLNonNull( GraphQLInt)}

                        },
                        resolve(parent,args){
                            let author = new Author({
                                name: args.name,
                                age: args.age
                            })
                            author.save()
                        }

                    },
                    addBook:{
                        type:BookType,
                        args:{
                            name:{type: new GraphQLNonNull(GraphQLString)},
                            genre: {type: new GraphQLNonNull(GraphQLString)},
                            authorid: {type:  new GraphQLNonNull(GraphQLID)}

                        },
                        resolve(parent,args){
                            let book = new Book({
                                name: args.name,
                                genre: args.genre,
                                authorid:args.authorid
                            })
                            book.save()
                        }

                    }
                }

            })

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
})