/* =========================================================
   VOYA RAIL — SEARCH PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const searchForm = document.getElementById("trainSearchForm");
    const originInput = document.getElementById("origin");
    const destinationInput = document.getElementById("destination");
    const travelDateInput = document.getElementById("travelDate");
    const travelClassInput = document.getElementById("travelClass");
    const searchButton = document.getElementById("searchBtn");

    const resultCards = Array.from(
        document.querySelectorAll(".departure-card")
    );

    const filterButtons = Array.from(
        document.querySelectorAll(".filter-chip")
    );

    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");
    const resetSearch = document.getElementById("resetSearch");
    const loadMoreButton = document.getElementById("loadMoreBtn");
    const trainResults = document.getElementById("trainResults");


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (!searchForm) {
        console.error("VOYA Rail: #trainSearchForm was not found.");
        return;
    }


    /* =====================================================
       MINIMUM DATE
    ===================================================== */

    const today = new Date().toISOString().split("T")[0];

    if (travelDateInput) {
        travelDateInput.min = today;
    }


    /* =====================================================
       CURRENT FILTER
    ===================================================== */

    let currentFilter = "all";


    /* =====================================================
       UPDATE RESULTS COUNT
    ===================================================== */

    function updateResultsCount(cards) {

        if (!resultsCount) return;

        const count = cards.length;

        if (count === 0) {

            resultsCount.textContent =
                "No departures available";

        } else if (count === 1) {

            resultsCount.textContent =
                "1 departure available";

        } else {

            resultsCount.textContent =
                `${count} departures available`;

        }
    }


    /* =====================================================
       FILTER TRAIN CARDS
    ===================================================== */

    function filterTrains() {

        const selectedClass =
            travelClassInput
                ? travelClassInput.value
                : "all";

        const visibleCards = [];


        resultCards.forEach(card => {

            const cardClass =
                card.dataset.class || "";

            const isDirect =
                card.dataset.direct === "true";


            let matchesFilter = true;
            let matchesClass = true;


            /* ---------------------------------------------
               FILTER CHIP
            --------------------------------------------- */

            switch (currentFilter) {

                case "Economy":

                    matchesFilter =
                        cardClass === "Economy";

                    break;


                case "Business":

                    matchesFilter =
                        cardClass === "Business";

                    break;


                case "First Class":

                    matchesFilter =
                        cardClass === "First Class";

                    break;


                case "Direct":

                    matchesFilter =
                        isDirect;

                    break;


                case "all":

                default:

                    matchesFilter = true;

                    break;
            }


            /* ---------------------------------------------
               CLASS SELECT
            --------------------------------------------- */

            if (
                selectedClass !== "all" &&
                cardClass !== selectedClass
            ) {

                matchesClass = false;
            }


            const shouldShow =
                matchesFilter &&
                matchesClass;


            if (shouldShow) {

                card.classList.remove("hidden");

                visibleCards.push(card);

            } else {

                card.classList.add("hidden");
            }

        });


        /* ---------------------------------------------
           EMPTY STATE
        --------------------------------------------- */

        if (visibleCards.length === 0) {

            if (noResults) {
                noResults.hidden = false;
            }

            if (loadMoreButton) {
                loadMoreButton.style.display = "none";
            }

        } else {

            if (noResults) {
                noResults.hidden = true;
            }

            if (loadMoreButton) {
                loadMoreButton.style.display = "inline-flex";
            }
        }


        updateResultsCount(visibleCards);
    }


    /* =====================================================
       FILTER BUTTONS
    ===================================================== */

    filterButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();


            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });


            button.classList.add("active");


            currentFilter =
                button.dataset.filter || "all";


            filterTrains();

        });

    });


    /* =====================================================
       SEARCH FORM
    ===================================================== */

    searchForm.addEventListener("submit", event => {

        event.preventDefault();


        const origin =
            originInput
                ? originInput.value.trim()
                : "";

        const destination =
            destinationInput
                ? destinationInput.value.trim()
                : "";

        const date =
            travelDateInput
                ? travelDateInput.value
                : "";


        /* ---------------------------------------------
           VALIDATION
        --------------------------------------------- */

        if (!origin) {

            if (originInput) {

                originInput.setCustomValidity(
                    "Please enter your departure station."
                );

                originInput.focus();
                originInput.reportValidity();

            }

            return;
        }


        if (!destination) {

            if (destinationInput) {

                destinationInput.setCustomValidity(
                    "Please enter your destination."
                );

                destinationInput.focus();
                destinationInput.reportValidity();

            }

            return;
        }


        if (!date) {

            if (travelDateInput) {

                travelDateInput.setCustomValidity(
                    "Please choose a travel date."
                );

                travelDateInput.focus();
                travelDateInput.reportValidity();

            }

            return;
        }


        /* ---------------------------------------------
           CLEAR VALIDATION
        --------------------------------------------- */

        if (originInput) {
            originInput.setCustomValidity("");
        }

        if (destinationInput) {
            destinationInput.setCustomValidity("");
        }

        if (travelDateInput) {
            travelDateInput.setCustomValidity("");
        }


        /* ---------------------------------------------
           SEARCH BUTTON
        --------------------------------------------- */

        if (!searchButton) {

            filterTrains();

            if (trainResults) {
                trainResults.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            return;
        }


        const originalHTML =
            searchButton.innerHTML;


        searchButton.disabled = true;

        searchButton.innerHTML =
            "Searching...";


        setTimeout(() => {

            searchButton.disabled = false;

            searchButton.innerHTML =
                originalHTML;


            filterTrains();


            if (trainResults) {

                trainResults.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }, 450);

    });


    /* =====================================================
       CLEAR VALIDATION
    ===================================================== */

    [
        originInput,
        destinationInput,
        travelDateInput
    ]
    .filter(Boolean)
    .forEach(input => {

        input.addEventListener("input", () => {

            input.setCustomValidity("");

        });

        input.addEventListener("change", () => {

            input.setCustomValidity("");

        });

    });


    /* =====================================================
       RESET SEARCH
    ===================================================== */

    if (resetSearch) {

        resetSearch.addEventListener("click", event => {

            event.preventDefault();


            searchForm.reset();


            if (travelDateInput) {
                travelDateInput.min = today;
                travelDateInput.setCustomValidity("");
            }


            if (originInput) {
                originInput.setCustomValidity("");
            }

            if (destinationInput) {
                destinationInput.setCustomValidity("");
            }


            currentFilter = "all";


            filterButtons.forEach(button => {

                button.classList.remove("active");

            });


            const allButton =
                document.querySelector(
                    '.filter-chip[data-filter="all"]'
                );


            if (allButton) {
                allButton.classList.add("active");
            }


            resultCards.forEach(card => {

                card.classList.remove("hidden");

            });


            if (noResults) {
                noResults.hidden = true;
            }


            if (loadMoreButton) {
                loadMoreButton.style.display =
                    "inline-flex";
            }


            updateResultsCount(resultCards);

        });

    }


    /* =====================================================
       SELECT TRAIN BUTTONS
    ===================================================== */

    document
        .querySelectorAll(".select-train")
        .forEach(button => {

            button.addEventListener("click", () => {

                const trainData = {

                    time:
                        button.dataset.time || "",

                    arrival:
                        button.dataset.arrival || "",

                    duration:
                        button.dataset.duration || "",

                    route:
                        button.dataset.route || "",

                    price:
                        button.dataset.price || "",

                    class:
                        button.dataset.class || ""

                };


                localStorage.setItem(
                    "selectedTrain",
                    JSON.stringify(trainData)
                );

            });

        });


    /* =====================================================
       LOAD MORE
    ===================================================== */

    if (loadMoreButton) {

        loadMoreButton.addEventListener("click", event => {

            event.preventDefault();


            const originalText =
                loadMoreButton.textContent;


            loadMoreButton.disabled = true;

            loadMoreButton.textContent =
                "Loading...";


            setTimeout(() => {

                loadMoreButton.disabled = false;

                loadMoreButton.textContent =
                    originalText;


                alert(
                    "More departures will be available soon."
                );

            }, 600);

        });

    }


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateResultsCount(resultCards);

});