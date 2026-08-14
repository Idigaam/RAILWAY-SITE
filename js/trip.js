/* =========================================================
   VOYA RAIL — TRIP DETAILS JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. DEFAULT TRIP
    ===================================================== */

    const defaultTrip = {
        origin: "New York",
        destination: "London",
        date: "Sat, 14 Nov 2026",
        departs: "08:40",
        arrives: "14:10",
        duration: "5h 30m",
        rating: "4.8"
    };


    /* =====================================================
       2. LOAD SAVED TRIP
    ===================================================== */

    let selectedTrip = defaultTrip;

    const savedTrip =
        localStorage.getItem("voya_selected_trip");

    if (savedTrip) {

        try {

            const parsedTrip =
                JSON.parse(savedTrip);

            selectedTrip = {
                ...defaultTrip,
                ...parsedTrip
            };

        } catch (error) {

            console.warn(
                "VOYA: Could not read saved trip.",
                error
            );

            selectedTrip = defaultTrip;
        }
    }


    /* =====================================================
       3. CLEAN CITY NAME
    ===================================================== */

    function cleanCity(value) {

        if (!value) {
            return "";
        }

        return value
            .split("—")[0]
            .split("|")[0]
            .trim();
    }


    const origin =
        cleanCity(selectedTrip.origin) || "New York";

    const destination =
        cleanCity(selectedTrip.destination) || "London";


    /* =====================================================
       4. PAGE ELEMENTS
    ===================================================== */

    const routeTitle =
        document.getElementById("routeTitle");

    const tripMeta =
        document.getElementById("tripMeta");

    const departureCity =
        document.getElementById("departureCity");

    const destinationCity =
        document.getElementById("destinationCity");

    const fareRoute =
        document.getElementById("fareRoute");


    /* =====================================================
       5. DISPLAY TRIP INFORMATION
    ===================================================== */

    if (routeTitle) {

        routeTitle.textContent =
            `${origin} → ${destination}`;

    }


    if (tripMeta) {

        tripMeta.textContent =
            `${selectedTrip.date} · ` +
            `Departs ${selectedTrip.departs} · ` +
            `Arrives ${selectedTrip.arrives} · ` +
            `${selectedTrip.duration}`;

    }


    if (departureCity) {

        departureCity.textContent =
            origin;

    }


    if (destinationCity) {

        destinationCity.textContent =
            destination;

    }


    /* =====================================================
       6. CLASS PRICING
    ===================================================== */

    const classPricing = {

        "Economy": {
            base: 640,
            surcharge: 120,
            demand: 80,
            total: 840
        },

        "First Class": {
            base: 1849,
            surcharge: 184,
            demand: 160,
            total: 2193
        }

    };


    /* =====================================================
       7. CURRENT CLASS
    ===================================================== */

    let currentClass = "Economy";


    if (
        selectedTrip.selectedClass &&
        classPricing[selectedTrip.selectedClass]
    ) {

        currentClass =
            selectedTrip.selectedClass;

    }


    /* =====================================================
       8. PRICE ELEMENTS
    ===================================================== */

    const baseFare =
        document.getElementById("baseFare");

    const citySurcharge =
        document.getElementById("citySurcharge");

    const seasonalDemand =
        document.getElementById("seasonalDemand");

    const ticketTotal =
        document.getElementById("ticketTotal");

    const travelerPrice =
        document.getElementById("travelerPrice");

    const fareTotal =
        document.getElementById("fareTotal");


    /* =====================================================
       9. CONTINUE BUTTON
    ===================================================== */

    const continueButton =
        document.getElementById("continueButton");


    /* =====================================================
       10. MONEY FORMAT
    ===================================================== */

    function money(amount) {

        return "$" +
            Number(amount).toLocaleString("en-US");

    }


    /* =====================================================
       11. UPDATE PRICE DISPLAY
    ===================================================== */

    function updatePriceUI(className) {

        const pricing =
            classPricing[className];

        if (!pricing) {
            return;
        }


        if (baseFare) {

            baseFare.textContent =
                money(pricing.base);

        }


        if (citySurcharge) {

            citySurcharge.textContent =
                money(pricing.surcharge);

        }


        if (seasonalDemand) {

            seasonalDemand.textContent =
                money(pricing.demand);

        }


        if (ticketTotal) {

            ticketTotal.textContent =
                money(pricing.total);

        }


        if (travelerPrice) {

            travelerPrice.textContent =
                money(pricing.total);

        }


        if (fareTotal) {

            fareTotal.textContent =
                money(pricing.total);

        }


        if (fareRoute) {

            fareRoute.textContent =
                `${origin} → ${destination} · ${className}`;

        }


        /* Update class card prices */

        document
            .querySelectorAll(".class-card")
            .forEach(function (card) {

                const cardClass =
                    card.dataset.class;

                const price =
                    classPricing[cardClass];

                if (!price) {
                    return;
                }

                const priceElement =
                    card.querySelector("strong");

                if (priceElement) {

                    priceElement.textContent =
                        money(price.total);

                }

            });

    }


    /* =====================================================
       12. CLASS CARDS
    ===================================================== */

    const classCards =
        document.querySelectorAll(".class-card");


    function selectClass(className) {

        if (!classPricing[className]) {
            return;
        }


        currentClass =
            className;


        classCards.forEach(function (card) {

            const cardClass =
                card.dataset.class;

            const check =
                card.querySelector(".selected-check");


            if (cardClass === className) {

                card.classList.add("selected");

                if (check) {

                    check.classList.remove("hidden");

                }

            } else {

                card.classList.remove("selected");

                if (check) {

                    check.classList.add("hidden");

                }

            }

        });


        updatePriceUI(currentClass);

    }


    /* =====================================================
       13. CLASS CARD CLICK
    ===================================================== */

    classCards.forEach(function (card) {

        card.addEventListener("click", function () {

            const selectedClass =
                card.dataset.class;

            selectClass(selectedClass);

        });

    });


    /* =====================================================
       14. INITIAL CLASS
    ===================================================== */

    selectClass(currentClass);


    /* =====================================================
       15. CONTINUE TO BOOKING
    ===================================================== */

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                /* Get selected price */

                const pricing =
                    classPricing[currentClass];


                if (!pricing) {

                    alert(
                        "Please select a travel class first."
                    );

                    return;

                }


                /* Create complete booking trip */

                const bookingTrip = {

                    ...selectedTrip,

                    origin: origin,

                    destination: destination,

                    date: selectedTrip.date,

                    departs: selectedTrip.departs,

                    arrives: selectedTrip.arrives,

                    duration: selectedTrip.duration,

                    selectedClass: currentClass,

                    baseFare: pricing.base,

                    citySurcharge:
                        pricing.surcharge,

                    seasonalDemand:
                        pricing.demand,

                    totalPrice:
                        money(pricing.total)

                };


                /* Save trip */

                localStorage.setItem(
                    "voya_selected_trip",
                    JSON.stringify(bookingTrip)
                );


                /* Go to checkout */

                window.location.href =
                    "checkout.html";

            }
        );

    } else {

        console.error(
            "VOYA: #continueButton was not found."
        );

    }


    /* =====================================================
       16. BACK BUTTON
    ===================================================== */

    const backLink =
        document.querySelector(".back-link");


    if (backLink) {

        backLink.addEventListener(
            "click",
            function () {

                localStorage.setItem(
                    "voya_selected_trip",
                    JSON.stringify(selectedTrip)
                );

            }
        );

    }

});