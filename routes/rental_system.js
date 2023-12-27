const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const login = require('../model/login_info')
const Order = require('../model/orders')
const Movie = require('../model/movie'); // Corrected import name
const { addWeeks } = require('date-fns'); // Using date-fns library for date manipulation
const path = require('path');
let cart = [];
const bodyParser = require('body-parser');

// Use body-parser middleware
router.use(bodyParser.urlencoded({ extended: true }));

var loggedInUser = ''; // Variable to store the logged-in user

function addToCart(movieId) {
    // Make an AJAX request to the server to add the movie to the cart
    $.post('http://localhost:9000/rental_system/add-to-cart', { movieId }, function (response) {
      // Handle the response if needed
      console.log(response);
    });
  }
  
router.get('/', async(req,res) => {
    try{
        const movie = await Movie.find(); 
        //HTML FILE
        res.sendFile(path.join(__dirname, '..', 'login_page.html'));
    }catch(err){
        res.send('ERROR' +err)
    }
})

router.post("/",(req,res,next)=>{
    cart = []; // Clear the cart before fetching new items
    res.sendFile(path.join(__dirname, '..',"movies_page.html")); 
});
// Add a new endpoint to get the logged-in user
router.get('/getLoggedInUser', (req, res) => {
    res.json({ loggedInUser });
});

router.post('/order', async (req, res) => {
    try {
        console.log('Received order request:', req.body);
        if (!loggedInUser) {
            return res.send('Please login first.');
        }

        const rentDate = new Date(req.body.rent_date);
        const returnDate = addWeeks(rentDate, 2);
        const moviesInCart = req.body.moviesInCart;

        const moviesArray = [];
        let totalCost = 0;

        for (const movieName of moviesInCart) {
            const foundMovie = await Movie.findOne({ Title: movieName });

            if (foundMovie && foundMovie.rentaCost) {
                const movieDetails = {
                    title: foundMovie.Title,
                    year: foundMovie.Year,
                };

                moviesArray.push(movieDetails);
                totalCost += foundMovie.rentaCost;
            } else {
                console.log(`Movie with name ${movieName} not found in the database`);
                return res.status(404).send('Movie not found');
            }
        }
        console.log('user:', loggedInUser);

        const newOrder = new Order({
            
            customer_name: loggedInUser, // Use loggedInUser as the customer_name
            rent_date: rentDate,
            return_date: returnDate,
            movies: moviesArray,
        });
        const savedOrder = await newOrder.save();
        res.json({ message: 'Order placed successfully!', order: savedOrder });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error: ' + err.message);
    }
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username and password are provided
        if (!username || !password) {
            console.log('Username and password are required');
            return res.status(400).send('Username and password are required');
        }

        // Find the user by username
        const user = await login.findOne({ username: username.trim() });

        // Check if the user exists and the password matches
        if (user && password === user.password) {
            loggedInUser = username;
            res.redirect('/rental_system/login/movies');
        } else {
            console.log('Invalid username or password');
            res.redirect('/rental_system/login');
    }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/login', async (req, res) => {
    //res.send('Invalid username or password');
    res.sendFile(path.join(__dirname, '..', 'login_page.html'));
});

router.get('/api/movies', async (req, res) => {
    const movies = await Movie.find();
    res.json(movies);
});

router.get('/login/movies', async(req, res) => {
    res.sendFile(path.join(__dirname, '..', 'movies_page.html'));
});


router.get('/add-to-cart', (req, res) => {
    // Handle GET request for /add-to-cart if needed
     res.redirect('/rental_system/login/movies/cart');
     res.sendFile(path.join(__dirname, '..', 'cart.html'));
});

router.post('/add-to-cart', async (req, res) => {
    const movieName = req.body.movieName;

    try {
        // Find the movie in the database based on the movie name
        const foundMovie = await Movie.findOne({ Title: movieName });

        if (foundMovie) {
            // Include relevant details in the cart
            const newMovie = {
                _id: foundMovie._id,
                Title: foundMovie.Title,
                Year: foundMovie.Year,
                // Include other fields as needed
            };

            cart.push(newMovie);
            console.log(`Added movie with MongoDB ID ${foundMovie._id} to the cart`);
            //console.log('Movie details:', foundMovie);
            res.status(200).send('OK');

        } else {
            console.log(`Movie with name ${movieName} not found in the database`);
            res.status(404).send('Movie not found');
        }
    } catch (error) {
        console.error('Error finding movie:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/cart', async (req, res) => {
    try {
        const cartItems = await Promise.all(cart.map(async (cartItem) => {
            const movie = await Movie.findById(cartItem._id);
            return {
                _id: cartItem._id,
                Title: movie.Title,
                Year: movie.Year,
                rentaCost: movie.rentaCost,  // Include rentaCost in the cart item
            };
        }));

        console.log('Sending cart items:', cartItems);
        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/login/movies/cart', (req, res) => {
    
    res.sendFile(path.join(__dirname, '..', 'cart.html'));
});

module.exports = router