document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. RETRIEVE & POPULATE SEARCH DATA
  // ==========================================
  const savedTripJSON = localStorage.getItem('voya_selected_trip');
  let selectedTrip = savedTripJSON ? JSON.parse(savedTripJSON) : null;

  // DOM Elements to update dynamically
  const routeHeader = document.querySelector('.trip-route-lg');
  const routeMeta = document.querySelector('.trip-meta');
  const departureStation = document.querySelectorAll('.timeline-station')[0];
  const destinationStation = document.querySelectorAll('.timeline-station')[2];
  const departureTime = document.querySelectorAll('.timeline-time')[0];
  const destinationTime = document.querySelectorAll('.timeline-time')[2];

  if (selectedTrip) {
    if (routeHeader) routeHeader.textContent = `${selectedTrip.origin.split(' ')[0]} → ${selectedTrip.destination.split(' ')[0]}`;
    if (routeMeta) routeMeta.textContent = `${selectedTrip.date} · Departs ${selectedTrip.departs} · Arrives ${selectedTrip.arrives} · ${selectedTrip.duration}`;
    
    // Update timeline stations and times
    if (departureStation) departureStation.textContent = selectedTrip.origin;
    if (destinationStation) destinationStation.textContent = selectedTrip.destination;
    if (departureTime) departureTime.textContent = selectedTrip.departs;
    if (destinationTime) destinationTime.textContent = selectedTrip.arrives;
  }

  // ==========================================
  // 2. CLASS SELECTION & PRICE RECALCULATION
  // ==========================================
  const classCards = document.querySelectorAll('.class-card');
  const ticketBaseAmt = document.querySelectorAll('.ticket-row .amt')[0];
  const ticketRowsTotal = document.querySelectorAll('.ticket-row.total span')[1];
  const fareSummarySubtext = document.querySelector('.card-box div[style*="font-size:13px"]');
  const fareSummaryItemAmt = document.querySelectorAll('.fare-total-row span:last-child')[0];
  const fareSummaryTotalAmt = document.querySelectorAll('.fare-total-row.total span')[1];
  const continueBtn = document.querySelector('a.btn-orange.btn-block');

  // Define prices for Economy and First Class
  const classPricing = {
    'Economy': {
      base: 649,
      surcharge: 120,
      demand: 80,
      total: 849
    },
    'First Class': {
      base: 1849,
      surcharge: 184,
      demand: 160,
      total: 2193
    }
  };

  let currentSelectedClass = 'Economy';

  const updatePriceUI = (className) => {
    const pricing = classPricing[className];
    if (!pricing) return;

    // Update breakdown in Ticket details card
    if (ticketBaseAmt) ticketBaseAmt.textContent = `$${pricing.base}`;
    if (ticketRowsTotal) ticketRowsTotal.textContent = `$${pricing.total}`;

    // Update Fare summary card
    const originCity = selectedTrip ? selectedTrip.origin.split(' ')[0] : 'New York';
    const destCity = selectedTrip ? selectedTrip.destination.split(' ')[0] : 'London';

    if (fareSummarySubtext) fareSummarySubtext.textContent = `${originCity} → ${destCity} · ${className}`;
    if (fareSummaryItemAmt) fareSummaryItemAmt.textContent = `$${pricing.total}`;
    if (fareSummaryTotalAmt) fareSummaryTotalAmt.textContent = `$${pricing.total}`;
  };

  classCards.forEach(card => {
    card.addEventListener('click', () => {
      // Clear selection from all cards
      classCards.forEach(c => {
        c.classList.remove('selected');
        const check = c.querySelector('.class-check');
        if (check) check.remove();
      });

      // Highlight clicked card and insert checkmark badge
      card.classList.add('selected');
      const checkBadge = document.createElement('span');
      checkBadge.className = 'class-check';
      checkBadge.textContent = '✓';
      card.prepend(checkBadge);

      // Determine selected class name and recalculate UI
      const heading = card.querySelector('h5')?.textContent.trim();
      currentSelectedClass = heading;
      updatePriceUI(currentSelectedClass);
    });
  });

  // ==========================================
  // 3. CONTINUE TO CHECKOUT STEP
  // ==========================================
  if (continueBtn) {
    continueBtn.addEventListener('click', (e) => {
      // Read current state
      const finalPrice = classPricing[currentSelectedClass].total;

      const updatedTrip = {
        ...(selectedTrip || {
          departs: '08:40',
          arrives: '14:10',
          origin: 'New York',
          destination: 'London',
          duration: '5h 30m',
          date: 'Sat, 14 Nov 2026'
        }),
        selectedClass: currentSelectedClass,
        totalPrice: `$${finalPrice}`
      };

      // Save updated trip choice back to localStorage
      localStorage.setItem('voya_selected_trip', JSON.stringify(updatedTrip));
    });
  }
});