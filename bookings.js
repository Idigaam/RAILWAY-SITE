if (localStorage.getItem("voya_logged_in") !== "true") {
    window.location.href = "login.html";
    return;
}

document.addEventListener('DOMContentLoaded', () => {
  // Clear localStorage once to ensure clean test data if needed
  // localStorage.removeItem('voya_past_bookings');

  // ==========================================
  // 1. INITIAL SETUP & MOCK STORAGE SEEDING
  // ==========================================
  if (!localStorage.getItem('voya_past_bookings')) {
    const initialPastTrips = [
      {
        id: 'past-1',
        route: 'London — Tokyo',
        meta: '12 Jul 2024 · Economy',
        rating: 5,
        review: 'Smooth boarding, fare matched what I paid.',
        hasBadge: true
      },
      {
        id: 'past-2',
        route: 'Cape Town — Sydney',
        meta: '3 Mar 2024 · First Class',
        rating: 0,
        review: null,
        hasBadge: false
      },
      {
        id: 'past-3',
        route: 'Bangkok — Rome',
        meta: '19 Dec 2023 · Economy',
        rating: 4,
        review: "Good value, would've liked more legroom.",
        hasBadge: true
      }
    ];
    localStorage.setItem('voya_past_bookings', JSON.stringify(initialPastTrips));
  }

  // ==========================================
  // 2. TAB SWITCHING
  // ==========================================
  const tabs = document.querySelectorAll('.tabs .tab');
  const bookingCard = document.querySelector('.booking-card');
  const pastGrid = document.querySelector('.past-grid');
  const eyebrowLabels = document.querySelectorAll('.section .eyebrow');

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');

      const tabName = e.target.textContent.trim();

      if (tabName.startsWith('Upcoming')) {
        if (eyebrowLabels[0]) {
          eyebrowLabels[0].style.display = 'block';
          eyebrowLabels[0].textContent = 'Upcoming';
        }
        if (bookingCard) bookingCard.style.display = 'flex';

        if (eyebrowLabels[1]) {
          eyebrowLabels[1].style.display = 'block';
          eyebrowLabels[1].textContent = 'Past trips — rate your ride';
        }
        if (pastGrid) pastGrid.style.display = 'grid';

      } else if (tabName.startsWith('Past trips')) {
        if (eyebrowLabels[0]) eyebrowLabels[0].style.display = 'none';
        if (bookingCard) bookingCard.style.display = 'none';

        if (eyebrowLabels[1]) {
          eyebrowLabels[1].style.display = 'block';
          eyebrowLabels[1].textContent = 'All Past Trips';
        }
        if (pastGrid) pastGrid.style.display = 'grid';

      } else {
        if (eyebrowLabels[0]) {
          eyebrowLabels[0].style.display = 'block';
          eyebrowLabels[0].textContent = tabName;
        }
        if (bookingCard) bookingCard.style.display = 'none';
        if (eyebrowLabels[1]) eyebrowLabels[1].style.display = 'none';
        if (pastGrid) pastGrid.style.display = 'none';
      }
    });
  });

  // ==========================================
  // 3. VISUAL & INTERACTIVE STAR RATING SYSTEM
  // ==========================================
  const renderPastTrips = () => {
    const pastTrips = JSON.parse(localStorage.getItem('voya_past_bookings')) || [];
    if (!pastGrid) return;

    pastGrid.innerHTML = ''; 

    pastTrips.forEach(trip => {
      const card = document.createElement('div');
      card.className = 'past-card';

      // Header row
      const topDiv = document.createElement('div');
      topDiv.className = 'past-card-top';
      topDiv.innerHTML = `
        <div>
          <h4>${trip.route}</h4>
          <div class="meta">${trip.meta}</div>
        </div>
        ${trip.hasBadge ? '<span class="badge-dot" style="color:#4caf50; font-weight:bold;">✓</span>' : ''}
      `;

      // Star container with forced visual styling & positioning
      const starsDiv = document.createElement('div');
      starsDiv.className = 'stars';
      starsDiv.style.display = 'flex';
      starsDiv.style.gap = '6px';
      starsDiv.style.margin = '10px 0';
      starsDiv.style.position = 'relative';
      starsDiv.style.zIndex = '10'; // Ensures clicks are never blocked by adjacent elements

      // Render 5 Star elements
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.textContent = '★';
        star.style.fontSize = '24px';
        star.style.lineHeight = '1';
        star.style.transition = 'transform 0.15s ease, color 0.15s ease';
        star.style.color = i <= trip.rating ? '#ff9800' : '#d1d5db'; // Bright orange or neutral light gray
        star.style.cursor = trip.rating > 0 ? 'default' : 'pointer';

        // Hover & Click events for unrated trips
        if (trip.rating === 0) {
          // Hover in: highlight up to hovered star & scale up slightly
          star.addEventListener('mouseenter', () => {
            Array.from(starsDiv.children).forEach((child, index) => {
              child.style.color = index < i ? '#ff9800' : '#d1d5db';
            });
            star.style.transform = 'scale(1.25)';
          });

          // Hover out: reset scale
          star.addEventListener('mouseleave', () => {
            star.style.transform = 'scale(1)';
          });

          // Direct Click: Save rating
          star.addEventListener('click', (e) => {
            e.stopPropagation();

            const userReview = prompt(`Rate ${trip.route} (${i} Stars):\nEnter a review comment:`);

            // Update local storage
            trip.rating = i;
            trip.review = userReview ? userReview : 'Rated by passenger.';
            trip.hasBadge = true;

            const updatedTrips = pastTrips.map(t => t.id === trip.id ? trip : t);
            localStorage.setItem('voya_past_bookings', JSON.stringify(updatedTrips));

            // Re-render UI immediately
            renderPastTrips();
          });
        }

        starsDiv.appendChild(star);
      }

      // Reset all stars to gray when leaving star block (if unrated)
      if (trip.rating === 0) {
        starsDiv.addEventListener('mouseleave', () => {
          Array.from(starsDiv.children).forEach(child => {
            child.style.color = '#d1d5db';
          });
        });
      }

      card.appendChild(topDiv);
      card.appendChild(starsDiv);

      // Render Review Quote once rated
      if (trip.review) {
        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'quote';
        quoteDiv.style.fontStyle = 'italic';
        quoteDiv.style.color = '#555';
        quoteDiv.textContent = `"${trip.review}"`;
        card.appendChild(quoteDiv);
      }

      pastGrid.appendChild(card);
    });
  };

  renderPastTrips();

  // ==========================================
// 4. SHOW CONFIRMED BOOKING
// ==========================================

const savedBooking = JSON.parse(
    localStorage.getItem("voyaBooking")
);

if (savedBooking && bookingCard) {

    const bookingInfo = bookingCard.querySelector(".booking-card > div:first-child");

    if (bookingInfo) {
        bookingInfo.innerHTML = `
            <a class="back-link" href="search.html" style="color:var(--muted)">
                ← Back to results
            </a>

            <h3>${savedBooking.route}</h3>

            <div class="meta">
                ${savedBooking.date} · 
                Departs ${savedBooking.departure} · 
                Arrives ${savedBooking.arrival} · 
                ${savedBooking.duration}
            </div>

            <div class="meta" style="margin-top:8px">
                Passenger: ${savedBooking.firstName} ${savedBooking.lastName}
                · ${savedBooking.class}
            </div>

            <div class="meta" style="margin-top:4px">
                Booking reference: ${savedBooking.reference}
                · ${savedBooking.status}
            </div>
        `;
    }

    const viewTicket = bookingCard.querySelector(".btn-orange");

    if (viewTicket) {
        viewTicket.href = "confirmation.html";
    }
}
});