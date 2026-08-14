/* =========================================================
   VOYA RAIL — CHECKOUT JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       1. LOGIN CHECK
    ===================================================== */

    if (
        localStorage.getItem("voya_logged_in") !== "true"
    ) {

        window.location.href = "login.html";

        return;

    }


    /* =====================================================
       2. LOAD SELECTED TRIP
    ===================================================== */

    const savedTrip =
        localStorage.getItem("voya_selected_trip");


    let selectedTrip = null;


    if (savedTrip) {

        try {

            selectedTrip =
                JSON.parse(savedTrip);

        } catch (error) {

            console.error(
                "VOYA: Could not load selected trip.",
                error
            );

        }

    }


    /*
     * If there is no selected trip, use safe defaults.
     */

    if (!selectedTrip) {

        selectedTrip = {

            origin: "New York",

            destination: "London",

            date: "Sat, 14 Nov 2026",

            departs: "08:40",

            arrives: "14:10",

            duration: "5h 30m",

            selectedClass: "Economy",

            totalPrice: "$840",

            baseFare: 640,

            citySurcharge: 120,

            seasonalDemand: 80

        };

    }


    /* =====================================================
       3. HELPER FUNCTIONS
    ===================================================== */

    function cleanCity(value) {

        if (!value) {
            return "";
        }

        return String(value)
            .split("—")[0]
            .split("|")[0]
            .trim();

    }


    function cityCode(city) {

        const cleaned =
            cleanCity(city);

        const codes = {

            "New York": "NYC",

            "London": "LON",

            "Paris": "PAR",

            "Berlin": "BER",

            "Madrid": "MAD",

            "Rome": "ROM",

            "Amsterdam": "AMS"

        };

        return (
            codes[cleaned] ||
            cleaned
                .replace(/[^a-zA-Z]/g, "")
                .substring(0, 3)
                .toUpperCase()
        );

    }


    function getTotal() {

        if (
            typeof selectedTrip.totalPrice === "number"
        ) {

            return selectedTrip.totalPrice;

        }


        const number =
            parseFloat(
                String(
                    selectedTrip.totalPrice || "840"
                )
                .replace(/[^0-9.]/g, "")
            );


        return Number.isFinite(number)
            ? number
            : 840;

    }


    function money(amount) {

        return "$" +
            Number(amount).toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    /* =====================================================
       4. TRIP INFORMATION
    ===================================================== */

    const origin =
        cleanCity(
            selectedTrip.origin
        ) || "New York";


    const destination =
        cleanCity(
            selectedTrip.destination
        ) || "London";


    const selectedClass =
        selectedTrip.selectedClass ||
        "Economy";


    const total =
        getTotal();


    /* =====================================================
       5. ELEMENTS
    ===================================================== */

    const checkoutSubtitle =
        document.getElementById(
            "checkoutSubtitle"
        );


    const summaryOrigin =
        document.getElementById(
            "summaryOrigin"
        );


    const summaryDestination =
        document.getElementById(
            "summaryDestination"
        );


    const summaryMeta =
        document.getElementById(
            "summaryMeta"
        );


    const summaryFare =
        document.getElementById(
            "summaryFare"
        );


    const summaryTotal =
        document.getElementById(
            "summaryTotal"
        );


    /* =====================================================
       6. UPDATE CHECKOUT INFORMATION
    ===================================================== */

    if (checkoutSubtitle) {

        checkoutSubtitle.textContent =
            `${origin} → ${destination} · ` +
            `${selectedTrip.date || "Sat, 14 Nov"} · ` +
            `${selectedClass}`;

    }


    if (summaryOrigin) {

        summaryOrigin.textContent =
            cityCode(origin);

    }


    if (summaryDestination) {

        summaryDestination.textContent =
            cityCode(destination);

    }


    if (summaryMeta) {

        summaryMeta.textContent =
            `${selectedTrip.date || "Sat, 14 Nov"} · ` +
            `${selectedClass} · 1 traveler`;

    }


    if (summaryFare) {

        summaryFare.textContent =
            money(total);

    }


    if (summaryTotal) {

        summaryTotal.textContent =
            money(total);

    }


    /* =====================================================
       7. TRAVELER ELEMENTS
    ===================================================== */

    const firstName =
        document.getElementById("firstName");


    const lastName =
        document.getElementById("lastName");


    const email =
        document.getElementById("email");


    const phone =
        document.getElementById("phone");


    const ageCategory =
        document.getElementById(
            "ageCategory"
        );


    /* =====================================================
       8. RESTORE SAVED TRAVELER INFORMATION
    ===================================================== */

    const savedTraveler =
        localStorage.getItem(
            "voya_traveler"
        );


    if (savedTraveler) {

        try {

            const traveler =
                JSON.parse(savedTraveler);


            if (firstName) {

                firstName.value =
                    traveler.firstName || "";

            }


            if (lastName) {

                lastName.value =
                    traveler.lastName || "";

            }


            if (email) {

                email.value =
                    traveler.email || "";

            }


            if (phone) {

                phone.value =
                    traveler.phone || "";

            }


            if (
                ageCategory &&
                traveler.ageCategory
            ) {

                ageCategory.value =
                    traveler.ageCategory;

            }

        } catch (error) {

            console.warn(
                "VOYA: Could not restore traveler.",
                error
            );

        }

    }


    /* =====================================================
       9. PAYMENT ELEMENTS
    ===================================================== */

    const paymentOptions =
        document.querySelectorAll(
            ".payment-option"
        );


    const cardPayment =
        document.getElementById(
            "cardPayment"
        );


    const bankPayment =
        document.getElementById(
            "bankPayment"
        );


    const paypalPayment =
        document.getElementById(
            "paypalPayment"
        );


    const cryptoPayment =
        document.getElementById(
            "cryptoPayment"
        );


    const cardNumber =
        document.getElementById(
            "cardNumber"
        );


    const expiry =
        document.getElementById(
            "expiry"
        );


    let selectedPayment = "card";


    /* =====================================================
       10. SHOW PAYMENT SECTION
    ===================================================== */

    function showPaymentSection(payment) {

        if (cardPayment) {
            cardPayment.style.display = "none";
        }

        if (bankPayment) {
            bankPayment.style.display = "none";
        }

        if (paypalPayment) {
            paypalPayment.style.display = "none";
        }

        if (cryptoPayment) {
            cryptoPayment.style.display = "none";
        }


        if (payment === "card" && cardPayment) {

            cardPayment.style.display = "block";

        }


        if (payment === "bank" && bankPayment) {

            bankPayment.style.display = "block";

        }


        if (payment === "paypal" && paypalPayment) {

            paypalPayment.style.display = "block";

        }


        if (payment === "crypto" && cryptoPayment) {

            cryptoPayment.style.display = "block";

        }

    }


    /* =====================================================
       11. PAYMENT BUTTONS
    ===================================================== */

    paymentOptions.forEach(function (option) {

        option.addEventListener(
            "click",
            function () {

                paymentOptions.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                this.classList.add(
                    "selected"
                );


                selectedPayment =
                    this.dataset.payment;


                showPaymentSection(
                    selectedPayment
                );

            }
        );

    });


    /* =====================================================
       12. CONFIRM PAYMENT
    ===================================================== */

    const confirmPayBtn =
        document.getElementById(
            "confirmPayBtn"
        );


    if (!confirmPayBtn) {

        console.error(
            "VOYA: confirmPayBtn was not found."
        );

        return;

    }


    confirmPayBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            /* ==============================
               FIRST NAME
            ============================== */

            if (
                !firstName ||
                firstName.value.trim() === ""
            ) {

                alert(
                    "Please enter your first name."
                );

                if (firstName) {
                    firstName.focus();
                }

                return;

            }


            /* ==============================
               LAST NAME
            ============================== */

            if (
                !lastName ||
                lastName.value.trim() === ""
            ) {

                alert(
                    "Please enter your last name."
                );

                if (lastName) {
                    lastName.focus();
                }

                return;

            }


            /* ==============================
               EMAIL
            ============================== */

            if (
                !email ||
                email.value.trim() === ""
            ) {

                alert(
                    "Please enter your email address."
                );

                if (email) {
                    email.focus();
                }

                return;

            }


            if (
                !email.value.includes("@")
            ) {

                alert(
                    "Please enter a valid email address."
                );

                email.focus();

                return;

            }


            /* ==============================
               PHONE
            ============================== */

            if (
                !phone ||
                phone.value.trim() === ""
            ) {

                alert(
                    "Please enter your phone number."
                );

                if (phone) {
                    phone.focus();
                }

                return;

            }


            /* ==============================
               CARD VALIDATION
            ============================== */

            if (selectedPayment === "card") {

                if (
                    !cardNumber ||
                    cardNumber.value.trim() === ""
                ) {

                    alert(
                        "Please enter your card number."
                    );

                    if (cardNumber) {
                        cardNumber.focus();
                    }

                    return;

                }


                if (
                    !expiry ||
                    expiry.value.trim() === ""
                ) {

                    alert(
                        "Please enter your card expiry date."
                    );

                    if (expiry) {
                        expiry.focus();
                    }

                    return;

                }

            }


            /* =================================================
               SAVE TRAVELER INFORMATION
            ================================================= */

            const traveler = {

                firstName:
                    firstName.value.trim(),

                lastName:
                    lastName.value.trim(),

                email:
                    email.value.trim(),

                phone:
                    phone.value.trim(),

                ageCategory:
                    ageCategory
                        ? ageCategory.value
                        : ""

            };


            localStorage.setItem(
                "voya_traveler",
                JSON.stringify(traveler)
            );


            /* =================================================
               CREATE BOOKING REFERENCE
            ================================================= */

            const bookingReference =
                "VOYA-" +
                Math.floor(
                    100000 +
                    Math.random() * 900000
                );


            /* =================================================
               BOOKING OBJECT
            ================================================= */

            const booking = {

                reference:
                    bookingReference,

                firstName:
                    traveler.firstName,

                lastName:
                    traveler.lastName,

                email:
                    traveler.email,

                phone:
                    traveler.phone,

                ageCategory:
                    traveler.ageCategory,

                route:
                    `${origin} → ${destination}`,

                origin:
                    origin,

                destination:
                    destination,

                date:
                    selectedTrip.date ||
                    "Sat, 14 Nov 2026",

                departure:
                    selectedTrip.departs ||
                    "08:40",

                arrival:
                    selectedTrip.arrives ||
                    "14:10",

                duration:
                    selectedTrip.duration ||
                    "5h 30m",

                class:
                    selectedClass,

                travelers:
                    1,

                paymentMethod:
                    selectedPayment,

                total:
                    money(total),

                status:
                    "Confirmed",

                createdAt:
                    new Date().toISOString()

            };


            /* =================================================
               SAVE BOOKING
            ================================================= */

            localStorage.setItem(
                "voyaBooking",
                JSON.stringify(booking)
            );


            /*
             * Also keep a bookings array so the
             * My Bookings page can display previous bookings.
             */

            let bookings = [];


            try {

                bookings =
                    JSON.parse(
                        localStorage.getItem(
                            "voyaBookings"
                        )
                    ) || [];

            } catch (error) {

                bookings = [];

            }


            bookings.push(booking);


            localStorage.setItem(
                "voyaBookings",
                JSON.stringify(bookings)
            );


            /* =================================================
               SUCCESS
            ================================================= */

            alert(
                "Payment successful! 🎉\n\n" +
                "Your booking has been confirmed.\n\n" +
                "Booking reference: " +
                bookingReference
            );


            /* =================================================
               CONFIRMATION
            ================================================= */

            window.location.href =
                "confirmation.html";

        }
    );


    /* =====================================================
       13. INITIAL PAYMENT STATE
    ===================================================== */

    showPaymentSection("card");

});