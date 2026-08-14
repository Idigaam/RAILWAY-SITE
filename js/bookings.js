/* =========================
   VOYA BOOKINGS
========================= */

if (localStorage.getItem("voya_logged_in") !== "true") {
    window.location.href = "login.html";
} else {

    document.addEventListener("DOMContentLoaded", () => {

        /* =========================
           TAB SWITCHING
        ========================= */

        const tabs = document.querySelectorAll(".tabs .tab");
        const contents = document.querySelectorAll(".tab-content");

        tabs.forEach((tab, index) => {

            tab.addEventListener("click", () => {

                tabs.forEach(item => {
                    item.classList.remove("active");
                });

                contents.forEach(content => {
                    content.classList.remove("active-content");
                });

                tab.classList.add("active");

                if (contents[index]) {
                    contents[index].classList.add("active-content");
                }

            });

        });


        /* =========================
           PAST TRIPS
        ========================= */

        if (!localStorage.getItem("voya_past_bookings")) {

            const initialPastTrips = [
                {
                    id: "past-1",
                    route: "London — Tokyo",
                    meta: "12 Jul 2024 · Economy",
                    rating: 5,
                    review: "Smooth boarding, fare matched what I paid.",
                    hasBadge: true
                },
                {
                    id: "past-2",
                    route: "Cape Town — Sydney",
                    meta: "3 Mar 2024 · First Class",
                    rating: 0,
                    review: null,
                    hasBadge: false
                },
                {
                    id: "past-3",
                    route: "Bangkok — Rome",
                    meta: "19 Dec 2023 · Economy",
                    rating: 4,
                    review: "Good value, would've liked more legroom.",
                    hasBadge: true
                }
            ];

            localStorage.setItem(
                "voya_past_bookings",
                JSON.stringify(initialPastTrips)
            );
        }


        const pastGrid = document.querySelector(".past-grid");


        function renderPastTrips() {

            if (!pastGrid) return;

            const pastTrips =
                JSON.parse(
                    localStorage.getItem("voya_past_bookings")
                ) || [];

            pastGrid.innerHTML = "";


            pastTrips.forEach(trip => {

                const card = document.createElement("div");

                card.className = "past-card";


                /* TRIP HEADER */

                const topDiv =
                    document.createElement("div");

                topDiv.className = "past-card-top";


                topDiv.innerHTML = `
                    <div>
                        <h4>${trip.route}</h4>

                        <div class="meta">
                            ${trip.meta}
                        </div>
                    </div>

                    ${
                        trip.hasBadge
                            ? '<span class="badge-dot">✓</span>'
                            : ''
                    }
                `;


                /* STARS */

                const starsDiv =
                    document.createElement("div");

                starsDiv.className = "stars";


                for (let i = 1; i <= 5; i++) {

                    const star =
                        document.createElement("span");

                    star.textContent = "★";

                    star.style.fontSize = "22px";
                    star.style.marginRight = "4px";

                    star.style.color =
                        i <= trip.rating
                            ? "#f2c94c"
                            : "#d1d5db";


                    if (trip.rating === 0) {

                        star.style.cursor = "pointer";


                        star.addEventListener(
                            "mouseenter",
                            () => {

                                Array.from(
                                    starsDiv.children
                                ).forEach(
                                    (child, index) => {

                                        child.style.color =
                                            index < i
                                                ? "#f2c94c"
                                                : "#d1d5db";

                                    }
                                );

                            }
                        );


                        star.addEventListener(
                            "click",
                            () => {

                                const review =
                                    prompt(
                                        `Rate ${trip.route} (${i} Stars):\nEnter a review comment:`
                                    );


                                trip.rating = i;

                                trip.review =
                                    review ||
                                    "Rated by passenger.";

                                trip.hasBadge = true;


                                const updatedTrips =
                                    pastTrips.map(item =>
                                        item.id === trip.id
                                            ? trip
                                            : item
                                    );


                                localStorage.setItem(
                                    "voya_past_bookings",
                                    JSON.stringify(
                                        updatedTrips
                                    )
                                );


                                renderPastTrips();

                            }
                        );

                    }


                    starsDiv.appendChild(star);

                }


                /* ADD CONTENT */

                card.appendChild(topDiv);

                card.appendChild(starsDiv);


                /* REVIEW */

                if (trip.review) {

                    const quote =
                        document.createElement("div");

                    quote.className = "quote";

                    quote.textContent =
                        `"${trip.review}"`;

                    card.appendChild(quote);

                }


                pastGrid.appendChild(card);

            });

        }


        renderPastTrips();


        /* =========================
           CONFIRMED BOOKING
        ========================= */

        const bookingCard =
            document.querySelector(".booking-card");


        const savedBooking =
            JSON.parse(
                localStorage.getItem("voyaBooking")
            );


        if (savedBooking && bookingCard) {

            const bookingInfo =
                bookingCard.querySelector(
                    ".booking-card > div:first-child"
                );


            if (bookingInfo) {

                bookingInfo.innerHTML = `

                    <a
                        class="back-link"
                        href="search.html"
                    >
                        ← Back to results
                    </a>

                    <h3>
                        ${savedBooking.route}
                    </h3>

                    <div class="meta">
                        ${savedBooking.date}
                        · Departs ${savedBooking.departure}
                        · Arrives ${savedBooking.arrival}
                        · ${savedBooking.duration}
                    </div>

                    <div
                        class="meta"
                        style="margin-top:8px"
                    >
                        Passenger:
                        ${savedBooking.firstName}
                        ${savedBooking.lastName}
                        · ${savedBooking.class}
                    </div>

                    <div
                        class="meta"
                        style="margin-top:4px"
                    >
                        Booking reference:
                        ${savedBooking.reference}
                        · ${savedBooking.status}
                    </div>

                `;

            }


            const viewTicket =
                bookingCard.querySelector(
                    ".btn-orange"
                );


            if (viewTicket) {
                viewTicket.href =
                    "confirmation.html";
            }


            /* REMOVE LOGIN BUTTON */

            const loginButton =
                bookingCard.querySelector(
                    "#loginBtn"
                );


            if (loginButton) {
                loginButton.remove();
            }

        }

    });

}
```
