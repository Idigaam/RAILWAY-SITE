
if (localStorage.getItem("voya_logged_in") !== "true") {
    window.location.href = "login.html";
}
document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. RETRIEVE & POPULATE TICKET DATA
  // ==========================================
  const savedTripJSON = localStorage.getItem('voya_selected_trip');
  const selectedTrip = savedTripJSON ? JSON.parse(savedTripJSON) : null;

  // DOM elements on ticket card
  const routeHeader = document.querySelector('.ticket-top span:first-child');
  const classBadge = document.querySelector('.ticket-top .badge');
  const bookingRef = document.querySelector('.ticket-ref');
  const departsVal = document.querySelectorAll('.ticket-grid .ticket-value')[1]; // Departs
  const arrivesVal = document.querySelectorAll('.ticket-grid .ticket-value')[2]; // Arrives
  const paidVal = document.querySelectorAll('.ticket-grid .ticket-value')[4];    // Paid

  if (selectedTrip) {
    // 1. Route header (e.g. "NYC → LON")
    if (routeHeader) {
      const originCode = selectedTrip.origin ? selectedTrip.origin.substring(0, 3).toUpperCase() : 'NYC';
      const destCode = selectedTrip.destination ? selectedTrip.destination.substring(0, 3).toUpperCase() : 'LON';
      routeHeader.textContent = `${originCode} → ${destCode}`;
    }

    // 2. Class Badge
    if (classBadge) {
      const className = selectedTrip.selectedClass || 'ECONOMY';
      classBadge.textContent = className.toUpperCase();
      
      // Toggle badge class styling
      classBadge.className = 'badge';
      if (className.toLowerCase().includes('business')) {
        classBadge.classList.add('badge-business');
      } else if (className.toLowerCase().includes('first')) {
        classBadge.classList.add('badge-first');
      } else {
        classBadge.classList.add('badge-economy');
      }
    }

    // 3. Generate or retrieve booking reference
    if (bookingRef) {
      const existingRef = localStorage.getItem('voya_booking_ref');
      if (existingRef) {
        bookingRef.textContent = existingRef;
      } else {
        const randomRef = 'LK-' + Math.floor(1000 + Math.random() * 9000) + 'VO';
        bookingRef.textContent = randomRef;
        localStorage.setItem('voya_booking_ref', randomRef);
      }
    }

    // 4. Departures & Arrivals
    if (departsVal && selectedTrip.departs) {
      departsVal.textContent = `${selectedTrip.date || 'Sat, 14 Nov'} · ${selectedTrip.departs}`;
    }
    if (arrivesVal && selectedTrip.arrives) {
      arrivesVal.textContent = `${selectedTrip.date || 'Sat, 14 Nov'} · ${selectedTrip.arrives}`;
    }

    // 5. Total Paid
    if (paidVal) {
      const price = selectedTrip.totalPrice || selectedTrip.price || '$840';
      paidVal.textContent = `${price} · Credit card`;
    }
  }

  // ==========================================
  // 2. RATING & FEEDBACK INTERACTION
  // ==========================================
  const ratingCard = document.querySelector('.rating-card');
  if (ratingCard) {
    const starsContainer = ratingCard.querySelector('.stars');
    const submitBtn = ratingCard.querySelector('button');
    const textarea = ratingCard.querySelector('textarea');

    if (starsContainer) {
      const totalStars = 5;
      starsContainer.innerHTML = '';
      starsContainer.style.cursor = 'pointer';

      for (let i = 1; i <= totalStars; i++) {
        const star = document.createElement('span');
        star.textContent = '★';
        star.dataset.value = i;
        star.style.fontSize = '24px';
        star.style.marginRight = '4px';
        star.style.color = i <= 4 ? '#ff9800' : '#ccc'; // Default 4 stars selected
        starsContainer.appendChild(star);
      }

      const starSpans = starsContainer.querySelectorAll('span');
      let currentRating = 4;

      const setStarColor = (count) => {
        starSpans.forEach((star, index) => {
          star.style.color = index < count ? '#ff9800' : '#ccc';
        });
      };

      starSpans.forEach(star => {
        star.addEventListener('mouseover', () => setStarColor(star.dataset.value));
        star.addEventListener('mouseout', () => setStarColor(currentRating));
        star.addEventListener('click', () => {
          currentRating = star.dataset.value;
          setStarColor(currentRating);
        });
      });

      // Submit Feedback Action
      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          const feedbackText = textarea ? textarea.value.trim() : '';
          
          // Display success state
          ratingCard.innerHTML = `
            <h3>Thank you for your feedback!</h3>
            <p style="color:var(--muted);margin-top:8px">We appreciate your response. Your rating helps us improve VOYA Rail.</p>
          `;
        });
      }
    }
  }
});