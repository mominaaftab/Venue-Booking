document.addEventListener('DOMContentLoaded', () => {
  // Helper: show JSON error or message
  function handleJsonResponse(responseJson) {
    if (responseJson.error) {
      alert('Error: ' + responseJson.error);
      return false;
    }
    if (responseJson.message) {
      // success message
      console.log('Success: ' + responseJson.message);
    }
    return true;
  }

  // STUDENT LOGIN
  const studentLoginForm = document.getElementById('studentLoginForm');
  if (studentLoginForm) {
    studentLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('studentEmail').value.trim();
      const password = document.getElementById('studentPassword').value;

      try {
        const res = await fetch('../../backend/routes/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!handleJsonResponse(data)) return;
        // If login successful, redirect to venues page
        if (data.user && data.user.role === 'user') {
          window.location.href = 'venues.html';
        } else {
          alert('Logged in, but role is not student.');
        }
      } catch (err) {
        alert('Network or server error.');
        console.error(err);
      }
    });
  }

  // STUDENT REGISTRATION
  const studentRegisterForm = document.getElementById('studentRegisterForm');
  if (studentRegisterForm) {
    studentRegisterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('studentName').value.trim();
      const email = document.getElementById('studentEmailReg').value.trim();
      const password = document.getElementById('studentPasswordReg').value;

      try {
        const res = await fetch('../../backend/routes/register.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role: 'user' })
        });
        const data = await res.json();
        if (!handleJsonResponse(data)) return;
        // If registration successful, redirect to venues
        window.location.href = 'venues.html';
      } catch (err) {
        alert('Network or server error.');
        console.error(err);
      }
    });
  }

  // ADMIN LOGIN
  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('adminEmail').value.trim();
      const password = document.getElementById('adminPassword').value;

      try {
        const res = await fetch('../../backend/routes/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!handleJsonResponse(data)) return;
        // If login successful and role is admin, redirect to admin/dashboard.html
        if (data.user && data.user.role === 'admin') {
          window.location.href = 'dashboard.html';
        } else {
          alert('Logged in, but role is not admin.');
        }
      } catch (err) {
        alert('Network or server error.');
        console.error(err);
      }
    });
  }

  // ADMIN REGISTRATION
  const adminRegisterForm = document.getElementById('adminRegisterForm');
  if (adminRegisterForm) {
    adminRegisterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('adminName').value.trim();
      const email = document.getElementById('adminEmailReg').value.trim();
      const password = document.getElementById('adminPasswordReg').value;

      try {
        const res = await fetch('../../backend/routes/register.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role: 'admin' })
        });
        const data = await res.json();
        if (!handleJsonResponse(data)) return;
        // If registration successful, redirect to admin dashboard
        window.location.href = 'dashboard.html';
      } catch (err) {
        alert('Network or server error.');
        console.error(err);
      }
    });
  }

  // ADD VENUE (Admin)
  const addVenueForm = document.getElementById('addVenueForm');
  if (addVenueForm) {
    addVenueForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('venueName').value.trim();
      const description = document.getElementById('venueDescription').value.trim();
      const capacity = parseInt(document.getElementById('venueCapacity').value, 10);
      const location = document.getElementById('venueLocation') 
                       ? document.getElementById('venueLocation').value.trim()
                       : ''; 
      // If you didn’t include a “location” input, default to empty string,
      // adjust your form or backend accordingly.

      try {
        const res = await fetch('../../backend/routes/venues.php?action=create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, location, capacity, description })
        });
        const data = await res.json();
        if (!handleJsonResponse(data)) return;
        // After adding, stay on page or redirect
        alert('Venue added successfully.');
        addVenueForm.reset();
      } catch (err) {
        alert('Network or server error.');
        console.error(err);
      }
    });
  }

  // BOOK VENUE (Student)
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const venueIdValue = document.getElementById('venueSelect').value;
      const bookingDate = document.getElementById('bookingDate').value;
      const timeSlot = document.getElementById('bookingTime').value;

      // For simplicity, we assume timeSlot maps to start/end times:
      let start_time = '';
      let end_time = '';
      if (timeSlot === '9AM-12PM') {
        start_time = '09:00:00';
        end_time = '12:00:00';
      } else if (timeSlot === '1PM-4PM') {
        start_time = '13:00:00';
        end_time = '16:00:00';
      } else if (timeSlot === '5PM-8PM') {
        start_time = '17:00:00';
        end_time = '20:00:00';
      }

      // You might need to look up the actual venue_id integer,
      // here we assume the <select> value is the numeric ID.

      const venue_id = parseInt(venueIdValue, 10);

      try {
        const res = await fetch('../../backend/routes/bookings.php?action=create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ venue_id, booking_date: bookingDate, start_time, end_time })
        });
        const data = await res.json();
        if (!handleJsonResponse(data)) return;
        alert('Booking created, pending admin approval.');
        bookingForm.reset();
      } catch (err) {
        alert('Network or server error.');
        console.error(err);
      }
    });
  }

  // APPROVE / REJECT / CANCEL Buttons (Admin View Bookings)
  document.querySelectorAll('.btn-approve').forEach(btn => {
    btn.addEventListener('click', async () => {
      const row = btn.closest('tr');
      const bookingId = row.dataset.bookingId; // assume <tr data-booking-id="123">
      if (!bookingId) return;

      try {
        const res = await fetch(`../../backend/routes/bookings.php?action=updateStatus&id=${bookingId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' })
        });
        const data = await res.json();
        if (!handleJsonResponse(data)) return;
        alert('Booking approved.');
        window.location.reload();
      } catch (err) {
        alert('Network or server error.');
      }
    });
  });

  document.querySelectorAll('.btn-reject').forEach(btn => {
    btn.addEventListener('click', async () => {
      const row = btn.closest('tr');
      const bookingId = row.dataset.bookingId;
      if (!bookingId) return;

      try {
        const res = await fetch(`../../backend/routes/bookings.php?action=updateStatus&id=${bookingId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'cancelled' })
        });
        const data = await res.json();
        if (!handleJsonResponse(data)) return;
        alert('Booking rejected.');
        window.location.reload();
      } catch (err) {
        alert('Network or server error.');
      }
    });
  });
});
