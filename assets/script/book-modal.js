const { getHostelBookingCount } = require("../../server/controllers/bookingController");

function changeCounter(counterId, action) {
    var counter = document.getElementById(counterId);
    var val = counter.value;
    var value = parseInt(counter.textContent);

    if (action === 'increment') {
        value++;
    } else if (action === 'decrement' && value > 0) {
        value--;
    }
    counter.value = value;
    counter.textContent = value;
}

function submitNewBooking(){
    // `booking_hostel_id` INT NOT NULL AUTO_INCREMENT,
    // `user_id` INT NOT NULL,
    // `hostel_id` INT NOT NULL,
    // `date_start` DATE NULL,
    // `date_end` DATE NULL,

    var hostelId = document.querySelector('modalHostelName').value;

    var rooms = document.querySelector('#roomCounter').value;
    var adultNum = document.querySelector("#adultCounter").value;
    var childNum = document.querySelector('#childCounter').value;

    var datestart = document.querySelector("#checkInDate").value;
    var dateend = document.querySelector("#checkOutDate").value;

    var id = 1;

    var bookingNum  = getHostelBookingCount;
    bookingNum = bookingNum + 1;

    //submit to SQL DB
    const postData = {
        bookingId: bookingNum,
        id: id,
        hostelId: hostelId,
        checkInDate: datestart,
        checkOutDate: dateend
    }

    fetch('/hostel/newBooking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Handle the response data as needed
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle errors
    });
        
}

document.querySelector("#submitBookingBtn").addEventListener('click', submitNewBooking());

