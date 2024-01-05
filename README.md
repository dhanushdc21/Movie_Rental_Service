# Movie Rental System

![Project Image]([url_to_project_image](https://raw.githubusercontent.com/dhanushdc21/Movie_Rental_Service/main/images/Screenshot%202024-01-06%20012956.png))

> A web-based movie rental system implemented using Node.js, Express, MongoDB, and jQuery.

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Description

The Movie Rental System is a web application that allows users to browse, rent, and order movies online. It provides features such as user authentication, cart management, and order placement. The backend is implemented using Node.js and Express, and MongoDB is used as the database. The frontend uses HTML, CSS, and jQuery.

---

## Features

- User authentication and login
- Employee and non-employee roles
- Browse and view movie details
- Add movies to the cart
- Place orders with rental dates
- Employee details display for employees
- Responsive design for various devices

---

## Screenshots

Include screenshots or GIFs that showcase your application.

![Screenshot 1]([url_to_screenshot1](https://raw.githubusercontent.com/dhanushdc21/Movie_Rental_Service/main/images/Screenshot%202024-01-06%20012956.png))
![Screenshot 2]([url_to_screenshot2](https://raw.githubusercontent.com/dhanushdc21/Movie_Rental_Service/main/images/Screenshot%202024-01-06%20013014.png))
![Screenshot 3]([https://raw.githubusercontent.com/dhanushdc21/Movie_Rental_Service/main/images/Screenshot%202024-01-06%20013030.png))
![Screenshot 4]([https://raw.githubusercontent.com/dhanushdc21/Movie_Rental_Service/main/images/Screenshot%202024-01-06%20013043.png))


---

## Installation

1. Clone the repository.

```bash
git clone https://github.com/dhanushdc21/movie-rental-system.git
cd movie-rental-system
```
2. Install dependencies.
```
npm install
```
3. Set up MongoDB.
- Make sure MongoDB is installed and running.
- Update the MongoDB connection string in config.js or .env file.

4. Start the application.
```
npm start
```

## Usage

1. Open your browser and navigate to http://localhost:9000/rental_system/login.
2. Log in with your credentials.
3. Explore movies, add them to the cart, and place orders.

## API Endpoints

1. GET /api/movies: Get a list of all movies.
2. GET /rental_system/cart: Get the current items in the user's cart.
3. POST /rental_system/add-to-cart: Add a movie to the user's cart.
4. POST /rental_system/order: Place an order with selected movies.
 For more details on API endpoints, refer to the source code in routes/rental_system.js.

## License

This project is licensed under the MIT License.
