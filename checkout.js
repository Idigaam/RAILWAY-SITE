if (localStorage.getItem("voya_logged_in") !== "true") {
    window.location.href = "login.html";
}

// ===============================
// PAYMENT METHODS
// ===============================

const paymentOptions = document.querySelectorAll(".payment-option");

const cardPayment = document.getElementById("cardPayment");
const bankPayment = document.getElementById("bankPayment");
const paypalPayment = document.getElementById("paypalPayment");
const cryptoPayment = document.getElementById("cryptoPayment");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");

const cardNumber = document.getElementById("cardNumber");
const expiry = document.getElementById("expiry");

const confirmPayBtn = document.getElementById("confirmPayBtn");

let selectedPayment = "card";


// ===============================
// PAYMENT METHOD CLICKING
// ===============================

paymentOptions.forEach(function (option) {

    option.addEventListener("click", function () {

        // Remove selected from all options
        paymentOptions.forEach(function (item) {
            item.classList.remove("selected");
        });

        // Select clicked option
        this.classList.add("selected");

        // Save selected payment method
        selectedPayment = this.dataset.payment;

        // Hide all payment sections
        cardPayment.style.display = "none";
        bankPayment.style.display = "none";
        paypalPayment.style.display = "none";
        cryptoPayment.style.display = "none";

        // Show selected section
        if (selectedPayment === "card") {
            cardPayment.style.display = "block";
        }

        else if (selectedPayment === "bank") {
            bankPayment.style.display = "block";
        }

        else if (selectedPayment === "paypal") {
            paypalPayment.style.display = "block";
        }

        else if (selectedPayment === "crypto") {
            cryptoPayment.style.display = "block";
        }

    });

});


// ===============================
// CONFIRM PAY
// ===============================

confirmPayBtn.addEventListener("click", function (event) {

    event.preventDefault();


    // Check first name
    if (firstName.value.trim() === "") {

        alert("Please enter your first name.");

        firstName.focus();

        return;
    }


    // Check last name
    if (lastName.value.trim() === "") {

        alert("Please enter your last name.");

        lastName.focus();

        return;
    }


    // Check email
    if (email.value.trim() === "") {

        alert("Please enter your email address to receive your confirmation.");

        email.focus();

        return;
    }


    // Check email format
    if (!email.value.includes("@")) {

        alert("Please enter a valid email address.");

        email.focus();

        return;
    }


    // Check phone
    if (phone.value.trim() === "") {

        alert("Please enter your phone number.");

        phone.focus();

        return;
    }


    // ===============================
    // CREDIT CARD
    // ===============================

    if (selectedPayment === "card") {

        if (cardNumber.value.trim() === "") {

            alert("Please enter your card number.");

            cardNumber.focus();

            return;
        }

        if (expiry.value.trim() === "") {

            alert("Please enter your card expiry date.");

            expiry.focus();

            return;
        }

    }


    // ===============================
    // CREATE BOOKING
    // ===============================

    const bookingReference =
        "VOYA-" +
        Math.floor(100000 + Math.random() * 900000);


    const booking = {

        reference: bookingReference,

        firstName: firstName.value.trim(),

        lastName: lastName.value.trim(),

        email: email.value.trim(),

        phone: phone.value.trim(),

        route: "New York → London",

        date: "Sat, 14 Nov 2026",

        departure: "08:40",

        arrival: "14:10",

        duration: "5h 30m",

        class: "Economy",

        travelers: 1,

        paymentMethod: selectedPayment,

        total: "$840.00",

        status: "Confirmed"

    };


    // Save booking in browser
    localStorage.setItem(
        "voyaBooking",
        JSON.stringify(booking)
    );


    // Show success message
    alert(
        "Payment successful! 🎉\n\n" +
        "Your booking has been confirmed.\n\n" +
        "Booking reference: " +
        bookingReference
    );


    // Go to confirmation page
    window.location.href = "confirmation.html";

});