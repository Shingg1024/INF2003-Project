function changeCounter(counterId, action) {
    var counter = document.getElementById(counterId);
    var value = parseInt(counter.textContent);

    if (action === 'increment') {
        value++;
    } else if (action === 'decrement' && value > 0) {
        value--;
    }

    counter.textContent = value;
}

