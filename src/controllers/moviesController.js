const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render("moviesAdd")
    },
    create: function (req, res) {
        db.Movie.create({
            title: req.body.title,
            rating: req.body.rating,
            awards: req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length

        })
        .then(function(){
            res.redirect("/movies")
        })
        .catch(function(error){
            console.log(error)
        })
    },
    edit: function(req, res) {
        Movies.findByPk(req.params.id)
        .then(function(movie){
            res.render("moviesEdit", {Movie: movie})
        })
        .catch(error=> res.send(error))
        
    },
    update: function (req,res) {
        Movies.update({
            title: req.body.title,
            rating: req.body.rating,
            awards: req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length

        },{
            where:{
                id: req.params.id
            }
        })
        .then(function(){
            res.redirect("/movies")
        })
        .catch(function(error){
            res.send(error)
        })
    },
    delete: function (req, res) {
        Movies.findByPk(req.params.id)
        .then(function(movie){
            res.render("moviesDelete", {Movie: movie})
        })
        .catch(error=> res.send(error))
    },
    destroy: function (req, res) {
        Movies.destroy({where:{
            id: req.params.id
        },
            force:true
        })
        .then(function(){
            res.redirect("/movies")
        })
        .catch(error=> res.send(error))
    }

}

module.exports = moviesController;