/**
 * Booking Module — Handles appointment creation and management.
 */

const SERVICE_PRICES = {
  haircut: 25,
  shave: 20,
  beard_trim: 15,
  hair_color: 45,
  combo: 40,
  premium: 65,
};

function initBooking() {
  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', handleBookingSubmit);
  }

  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  updateBookingUI();
}

function updateBookingUI() {
  const form = document.getElementById('bookingForm');
  const prompt = document.getElementById('bookingLoginPrompt');

  if (isLoggedIn()) {
    form.classList.remove('hidden');
    prompt.classList.add('hidden');
  } else {
    form.classList.add('hidden');
    prompt.classList.remove('hidden');
  }
}

async function handleBookingSubmit(e) {
  e.preventDefault();

  const service = document.getElementById('bookingService').value;
  const date = document.getElementById('bookingDate').value;
  const timeSlot = document.getElementById('bookingTime').value;
  const notes = document.getElementById('bookingNotes').value;
  const price = SERVICE_PRICES[service];

  if (!service || !date || !timeSlot) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  try {
    await API.post('/bookings', {
      service,
      date,
      timeSlot,
      price,
      notes,
      barber: 'default',
      duration: 30,
    });
    showToast('Booking confirmed! We look forward to seeing you.', 'success');
    e.target.reset();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function loadMyBookings() {
  try {
    const data = await API.get('/bookings');
    return data.bookings;
  } catch (err) {
    showToast('Failed to load bookings', 'error');
    return [];
  }
}

async function cancelBooking(bookingId) {
  try {
    await API.patch(`/bookings/${bookingId}/cancel`);
    showToast('Booking cancelled', 'info');
  } catch (err) {
    showToast(err.message, 'error');
  }
}
