document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const passwordToggle = document.getElementById("passwordToggle");
    const staySignedIn = document.querySelector(
        '.remember input[type="checkbox"]'
    );


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener("click", () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                passwordToggle.setAttribute(
                    "aria-label",
                    "Hide password"
                );

                passwordToggle.classList.add("password-visible");

            } else {

                passwordInput.type = "password";

                passwordToggle.setAttribute(
                    "aria-label",
                    "Show password"
                );

                passwordToggle.classList.remove(
                    "password-visible"
                );

            }

        });

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    if (loginBtn) {

        loginBtn.addEventListener("click", () => {

            const email = emailInput
                ? emailInput.value.trim()
                : "";

            const password = passwordInput
                ? passwordInput.value.trim()
                : "";


            /* -------------------------
               EMAIL CHECK
            ------------------------- */

            if (!email) {

                alert("Please enter your email address.");

                emailInput.focus();

                return;
            }


            /* -------------------------
               PASSWORD CHECK
            ------------------------- */

            if (!password) {

                alert("Please enter your password.");

                passwordInput.focus();

                return;
            }


            /* -------------------------
               SAVE LOGIN
            ------------------------- */

            localStorage.setItem(
                "voya_logged_in",
                "true"
            );

            localStorage.setItem(
                "voya_user_email",
                email
            );


            /* -------------------------
               STAY SIGNED IN
            ------------------------- */

            if (staySignedIn) {

                localStorage.setItem(
                    "voya_stay_signed_in",
                    staySignedIn.checked ? "true" : "false"
                );

            }


            /* -------------------------
               SUCCESS
            ------------------------- */

            alert("Login successful! Welcome to VOYA.");


            /* -------------------------
               GO HOME
            ------------------------- */

            window.location.href = "index.html";

        });

    }

});
