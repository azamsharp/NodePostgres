
const express = require('express')
const app = express()
var bodyParser = require('body-parser');
var promise = require('bluebird')

const mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var options = {
  promiseLib :promise
}

var pgp = require('pg-promise')(options)
var connectionString = 'postgres://localhost:5432/nadiasgarden'
var db = pgp(connectionString)

app.post('/dishes',function(req,res){

    let title = req.body.title
    let description = req.body.description
    let price = req.body.price
    let course = req.body.course
    let imageURL = req.body.imageURL

    req.body.price = parseFloat(req.body.price)

    db.none('insert into dishes(title,description,price,course,"imageURL") values($1,$2,$3,$4,$5)',[title,description,price,course,imageURL])
    .then(function(data){
      //console.log(data.id)
      res.status(200).json({status:'success'})
    }).catch(function(error){
      console.log(error)
    })

})

app.get('/dishes',function(req,res){

  db.any('select * from dishes').then(function(data){
    console.log(data)
    res.render('dishes',{'dishes':data})
  })
})


app.get('/',function(req,res){
  db.any('select * from dishes').then(function(data){
    res.status(200).json({
      status : 'success',
      data: data
    })

  })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
