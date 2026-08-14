/* =========================================================
   VOYA RAIL — CONFIRMATION PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       LOGIN PROTECTION
    ===================================================== */

    if (localStorage.getItem("voya_logged_in") !== "true") {
        window.location.href = "login.html";
        return;
    }


    /* =====================================================
       GET SAVED TRIP
    ===================================================== */

    let selectedTrip = null;

    const savedTrip =
        localStorage.getItem("voya_selected_trip");

    if (savedTrip) {

        try {
            selectedTrip = JSON.parse(savedTrip);
        }

        catch (error) {
            console.error(
                "VOYA: Could not read saved trip.",
                error
            );
        }

    }


    /* =====================================================
       HELPER
    ===================================================== */

    function get(id) {
        return document.getElementById(id);
    }


    /* =====================================================
       TRIP INFORMATION
    ===================================================== */

    if (selectedTrip) {

        const origin =
            selectedTrip.origin || "New York";

        const destination =
            selectedTrip.destination || "London";


        const originCode =
            origin.substring(0, 3).toUpperCase();

        const destinationCode =
            destination.substring(0, 3).toUpperCase();


        if (get("route")) {

            get("route").textContent =
                originCode + " → " + destinationCode;

        }


        /* CLASS */

        const className =
            selectedTrip.selectedClass || "Economy";

        if (get("travelClass")) {

            get("travelClass").textContent =
                className.toUpperCase();

        }


        /* PASSENGER */

        const firstName =
            selectedTrip.firstName ||
            localStorage.getItem("voya_first_name") ||
            "Esther";

        const lastName =
            selectedTrip.lastName ||
            localStorage.getItem("voya_last_name") ||
            "Tochukwu";


        if (get("passengerName")) {

            get("passengerName").textContent =
                firstName + " " +
                lastName.charAt(0) + ".";

        }


        /* DEPARTURE */

        if (get("departure")) {

            get("departure").textContent =
                (selectedTrip.date || "Sat, 14 Nov") +
                " · " +
                (selectedTrip.departs || "08:40");

        }


        /* ARRIVAL */

        if (get("arrival")) {

            get("arrival").textContent =
                (selectedTrip.date || "Sat, 14 Nov") +
                " · " +
                (selectedTrip.arrives || "14:10");

        }


        /* PAYMENT */

        if (get("paymentDetails")) {

            const total =
                selectedTrip.totalPrice || "$840";

            get("paymentDetails").textContent =
                total + " · Credit card";

        }

    }


    /* =====================================================
       BOOKING REFERENCE
    ===================================================== */

    let bookingRef =
        localStorage.getItem("voya_booking_ref");


    if (!bookingRef) {

        bookingRef =
            "LK-" +
            Math.floor(
                1000 + Math.random() * 9000
            ) +
            "NY";

        localStorage.setItem(
            "voya_booking_ref",
            bookingRef
        );

    }


    if (get("bookingReference")) {

        get("bookingReference").textContent =
            bookingRef;

    }


    if (get("barcodeNumber")) {

        get("barcodeNumber").textContent =
            bookingRef;

    }


    /* =====================================================
       STAR RATING
    ===================================================== */

    let currentRating = 4;

    const stars =
        document.querySelectorAll(
            "#confirmation .star"
        );


    function updateStars(rating) {

        stars.forEach(function (star) {

            const value =
                Number(star.dataset.rating);

            if (value <= rating) {

                star.classList.add("active");

            } else {

                star.classList.remove("active");

            }

        });

    }


    /* Make sure stars show immediately */

    updateStars(currentRating);


    stars.forEach(function (star) {

        /* Hover */

        star.addEventListener(
            "mouseenter",
            function () {

                const rating =
                    Number(this.dataset.rating);

                stars.forEach(function (item) {

                    const value =
                        Number(item.dataset.rating);

                    if (value <= rating) {

                        item.classList.add("active");

                    } else {

                        item.classList.remove("active");

                    }

                });

            }
        );


        /* Click */

        star.addEventListener(
            "click",
            function () {

                currentRating =
                    Number(this.dataset.rating);

                updateStars(currentRating);

            }
        );

    });


    /* =====================================================
       FEEDBACK BUTTON
    ===================================================== */

    const feedbackBtn =
        get("feedbackBtn");


    if (feedbackBtn) {

        feedbackBtn.addEventListener(
            "click",
            function () {

                const textarea =
                    get("feedback");

                const comment =
                    textarea
                        ? textarea.value.trim()
                        : "";


                localStorage.setItem(
                    "voya_feedback",
                    JSON.stringify({

                        rating: currentRating,

                        comment: comment

                    })
                );


                const ratingCard =
                    get("ratingCard");


                if (ratingCard) {

                    ratingCard.innerHTML = `

                        <div style="
                            text-align:center;
                            padding:20px;
                        ">

                            <div style="
                                font-size:42px;
                                margin-bottom:10px;
                            ">
                                ★
                            </div>

                            <h3>
                                Thank you for your feedback!
                            </h3>

                            <p>
                                We appreciate your response.
                                Your rating helps us improve
                                VOYA Rail.
                            </p>

                        </div>

                    `;

                }

            }
        );

    }


    /* =====================================================
       BACK TO BOOKINGS
    ===================================================== */

    const backButton =
        get("backToBookings");


    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "booking.html";

            }
        );

    }


    /* =====================================================
       NAVBAR BACK BUTTON
       IF YOU HAVE ONE WITH href
    ===================================================== */

    const navbarBack =
        document.querySelector(
            "#confirmation .navbar .btn"
        );


    if (navbarBack) {

        navbarBack.addEventListener(
            "click",
            function () {

                window.location.href =
                    "booking.html";

            }
        );

    }

});