document.addEventListener('DOMContentLoaded', function () {
    // Get all elements with class "favorite"
    var favorites = document.querySelectorAll('.favorite');

    // Add click event listener to each heart icon
    favorites.forEach(function (favorite) {
        favorite.addEventListener('click', function () {
            // Toggle the "fas" (filled heart) and "far" (empty heart) classes
            if (favorite.classList.contains('fas')) {
                favorite.classList.remove('fas');
                favorite.classList.add('far');
            } else {
                favorite.classList.remove('far');
                favorite.classList.add('fas');
            }
        });
    });
});