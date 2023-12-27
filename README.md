# Movie Rental System

## Overview

The Movie Rental System is a web application that allows users to browse movies, add them to their cart, and place rental orders. The system supports user authentication, allowing users to log in, view available movies, and place orders for selected movies.

## Features

- **User Authentication:** Users can create accounts, log in, and log out.
- **Browse Movies:** Users can view a list of available movies with details such as title, release year, and rental cost.
- **Add to Cart:** Users can add movies to their cart for rental.
- **Place Orders:** Users can place orders for the movies in their cart, specifying the rental date and return date.
- **Total Cost Calculation:** The system calculates the total cost of the order based on the rental cost of selected movies.

## Technologies Used

- **Frontend:**
  - HTML, CSS, JavaScript
  - jQuery for AJAX requests and DOM manipulation

- **Backend:**
  - Node.js
  - Express.js for handling routes and requests
  - MongoDB for storing movie and user data

- **Database:**
  - MongoDB

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/dhanushdc21/movie-rental-system.git
    ```

2. Install dependencies:

    ```bash
    cd movie-rental-system
    npm install
    ```

3. Configure the MongoDB connection:
    - Edit the `config.js` file to set up your MongoDB connection details.

4. Run the application:

    ```bash
    npm start
    ```

    The application should be accessible at [http://localhost:9000](http://localhost:9000).

## Usage

1. Access the application in your web browser.

2. Create an account or log in with existing credentials.

3. Browse available movies, add them to your cart, and proceed to place an order.

4. View your cart, confirm the order details, and place the order.

5. Check the total cost and receive a success message upon successful order placement.

## License

This project is licensed under the [MIT License](LICENSE).


Feel free to enhance this README with additional details, instructions, or acknowledgments relevant to your project. Make sure to include a license file (e.g., `LICENSE`) if you haven't already.
