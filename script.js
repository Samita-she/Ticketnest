document.addEventListener("DOMContentLoaded", () => {
    const moviePoster = document.getElementById("movie-poster");
    const movieTitle = document.getElementById("movie-title");
    const movieRuntime = document.getElementById("movie-runtime");
    const movieShowtime = document.getElementById("movie-showtime");
    const availableTickets = document.getElementById("available-tickets");
    const filmsList = document.getElementById("films");
    let currentMovie = {}; // Store movie data for PATCH request

    // Function to fetch and display movie details
    function displayMovieDetails(movie) {
        currentMovie = movie; // Store selected movie details
        moviePoster.src = movie.poster;
        movieTitle.textContent = movie.title;
        movieRuntime.textContent = movie.runtime;
        movieShowtime.textContent = movie.showtime;
        const ticketsAvailable = movie.capacity - movie.tickets_sold;
        availableTickets.textContent = ticketsAvailable;
    }

    // Fetch and display the first movie's details
    fetch("http://localhost:3000/films/1")
        .then(response => response.json())
        .then(movie => {
            displayMovieDetails(movie);
        })
        .catch(error => console.error("Error fetching first movie details:", error));

    // Fetch and display all movies in the sidebar
    fetch("http://localhost:3000/films")
        .then(response => response.json())
        .then(movies => {
            movies.forEach(movie => {
                const listItem = document.createElement("li");
                listItem.textContent = movie.title;
                listItem.classList.add("film", "item");

                listItem.addEventListener("click", () => {
                    displayMovieDetails(movie);
                });

                filmsList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching movie list:", error));

    // Buy Ticket Button Functionality
    document.getElementById("buy-ticket").addEventListener("click", () => {
        const currentTickets = parseInt(availableTickets.textContent);
        console.log(`Current Tickets Available: ${currentTickets}`);

        if (currentTickets > 0) {
            const updatedTicketsSold = parseInt(currentMovie.capacity) - (currentTickets - 1);
            console.log(`Updated Tickets Sold: ${updatedTicketsSold}`);

            fetch(`http://localhost:3000/films/${currentMovie.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ tickets_sold: updatedTicketsSold })
            })
                .then(response => response.json())
                .then(updatedMovie => {
                    console.log("Updated Movie Data:", updatedMovie);
                    availableTickets.textContent = updatedMovie.capacity - updatedMovie.tickets_sold;
                })
                .catch(error => console.error("Error updating tickets:", error));
        } else {
            alert("Sorry, this movie is sold out!");
        }
    });
});
