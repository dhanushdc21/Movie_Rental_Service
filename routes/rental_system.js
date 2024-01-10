    const express = require('express')
    const router = express.Router()
    const bcrypt = require('bcrypt');
    const login = require('../model/login_info')
    const Order = require('../model/orders')
    const Customers = require('../model/customer')
    const EmployeeDetails = require('../model/employee');
    const Movie = require('../model/movie'); // Corrected import name
    const { addWeeks } = require('date-fns'); // Using date-fns library for date manipulation
    const path = require('path');
    let cart = [];
    const bodyParser = require('body-parser');

    // Use body-parser middleware
    router.use(bodyParser.urlencoded({ extended: true }));

    var loggedInUser = ''; // Variable to store the logged-in user
    var customer_name = '';
    function addToCart(movieId) {
        // Make an AJAX request to the server to add the movie to the cart
        $.post('http://localhost:9000/rental_system/add-to-cart', { movieId }, function (response) {
        // Handle the response if needed
        console.log(response);
        });
    }
    // Add a new route to fetch employee details based on username
   router.get('/rental_system/employee_details/:username', (req, res) => {
        // Retrieve the username from the request parameters
        const username = req.params.username;
    
        // Check if the username is defined
        if (!username) {
            // Handle the case where the username is not provided in the request
            return res.status(400).json({ error: 'Username is required.' });
        }
    
        // Rest of your code that uses the 'username' variable
        // ...
    
        // Example code snippet where 'username' is used
        Employee.findOne({ username: username }, (err, employeeDetails) => {
            if (err) {
                console.error('Error fetching employee details:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
    
            if (!employeeDetails) {
                return res.status(404).json({ error: 'Employee details not found.' });
            }
    
            // Send the employee details as a JSON response
            res.json(employeeDetails);
        });
    });

    router.delete('/login/movies/return_movie/:orderId/:movieId', async (req, res) => {
        try {
            const { orderId, movieId } = req.params;
    
            // Find the order by orderId
            const order = await Order.findById(orderId);
    
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
    
            // Remove the movie from the order
            order.movies = order.movies.filter(movie => movie._id.toString() !== movieId);
    
            // Save the updated order
            await order.save();
    
            res.json({ message: 'Movie returned successfully', order });
        } catch (error) {
            console.error('Error returning movie:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
   router.get('/login/movies/previous_orders', async (req, res) => {
        try {
            // Fetch previous orders for the logged-in customer
            const previousOrders = await Order.find({ customer_name: loggedInUser }).sort({ rent_date: -1 });
    
            // Render an HTML page or send a JSON response with previous orders data
        res.sendFile(path.join(__dirname, '..', 'previous_orders.html'));
        } catch (error) {
            console.error('Error fetching previous orders:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    
    router.get('/login/movies/previous_orders_data', async (req, res) => {
        try {
            // Fetch previous orders for the logged-in customer
            const previousOrders = await Order.find({ customer_name: loggedInUser }).sort({ rent_date: -1 });
    
            // Render an HTML page or send a JSON response with previous orders data
        res.json({ orders: previousOrders })
        } catch (error) {
            console.error('Error fetching previous orders:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    
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

    router.get('/getLoggedInUser', async (req, res) => {
        try {
            // Check if loggedInUser is defined
            if (!loggedInUser) {
                return res.status(401).json({ error: 'User not logged in.' });
            }
    
            // Find the employee details in the database based on the username
            const employee = await EmployeeDetails.findOne({ employee_name: loggedInUser.trim() });
    
            if (employee) {
                // Include employee information in the response
                res.json({ loggedInUser, isEmployee: true });
            } else {
                res.json({ loggedInUser, isEmployee: false });
            }
        } catch (error) {
            console.error('Error fetching employee details:', error);
            res.status(500).send('Internal Server Error');
        }
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
                customer_name = user.username;
                console.log(customer_name)
                // Check if the user is an employee
                const isEmployee = await EmployeeDetails.exists({ employee_name: username.trim() });
                const existingCustomer = await Customers.findOne({ customer_name: username.trim() });

                if (!existingCustomer) {
                    // If the customer's name doesn't exist, add it to the "Customers" collection
                    const newCustomer = new Customers({
                        customer_name: username.trim(),
                    });

                    await newCustomer.save();
                    console.log('Customer added to "Customers" collection.');
                }
                if (isEmployee) {
                    console.log('Employee');
                } else {
                    console.log('Not an employee');
                }
    
                // Set the loggedInUser
                loggedInUser = username;
    
                // Redirect to the movies page
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
        console.log('Adding to cart:', req.body); // Add this line
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

    router.post('/clear-cart', (req, res) => {
        // Clear the cart array
        cart = [];
        res.status(200).send('Cart cleared successfully');
    });
    module.exports = router