function getHostelBookingCount() {
  return fetch('/booking/getHostelBookingCount')
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        return data[0].num;
      } else {
        console.error('Invalid response format:', data);
        return 0;
      }
    })
    .catch(error => {
      console.error('Error fetching booking count:', error);
      return 0;
    });
}


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

function submitNewBooking() {
  getHostelBookingCount()
    .then(bookingCount => {
      var hostelId = document.getElementById("itemHostelId").value;
      var sessionId = document.getElementById("sessionId").value;
      var datestart = document.querySelector("#checkInDate").value;
      var dateend = document.querySelector("#checkOutDate").value;

      //console.log("booking: " + bookingCount);
      var bookingNum = parseInt(bookingCount) + 1;

      // submit to SQL DB
      const postData = {
        bookingId: bookingNum,
        user_id: parseInt(sessionId),
        hostelId: parseInt(hostelId),
        date_start: datestart,
        date_end: dateend
      };

      //console.log(postData);

      return fetch('/hostel/newBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
    })
    .then(response => {
      if (response.ok) {
        alert("Thank You for Booking");
      } else {
        console.error('Error:', response.statusText);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

document.querySelector("#submitBookingBtn").addEventListener('click', submitNewBooking);