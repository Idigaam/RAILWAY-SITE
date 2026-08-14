/* =========================================================
   VOYA RAIL — SEARCH PAGE JAVASCRIPT
   COMPLETE / SAFE VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const searchForm =
        document.getElementById("trainSearchForm");

    const originInput =
        document.getElementById("origin");

    const destinationInput =
        document.getElementById("destination");

    const travelDateInput =
        document.getElementById("travelDate");

    const travelClassInput =
        document.getElementById("travelClass");

    const searchButton =
        document.getElementById("searchBtn");

    const resultCards =
        Array.from(
            document.querySelectorAll(".departure-card")
        );

    const filterButtons =
        Array.from(
            document.querySelectorAll(".filter-chip")
        );

    const resultsCount =
        document.getElementById("resultsCount");

    const noResults =
        document.getElementById("noResults");

    const resetSearch =
        document.getElementById("resetSearch");

    const loadMoreButton =
        document.getElementById("loadMoreBtn");

    const trainResults =
        document.getElementById("trainResults");


    /* =====================================================
       TODAY
    ===================================================== */

    const today =
        new Date().toISOString().split("T")[0];


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

        }

        else if (count === 1) {

            resultsCount.textContent =
                "1 departure available";

        }

        else {

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

            if (currentFilter === "Economy") {

                matchesFilter =
                    cardClass === "Economy";

            }

            else if (currentFilter === "Business") {

                matchesFilter =
                    cardClass === "Business";

            }

            else if (currentFilter === "First Class") {

                matchesFilter =
                    cardClass === "First Class";

            }

            else if (currentFilter === "Direct") {

                matchesFilter =
                    isDirect;

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

                card.style.display = "";

                visibleCards.push(card);

            }

            else {

                card.classList.add("hidden");

                card.style.display = "none";

            }

        });


        /* ---------------------------------------------
           NO RESULTS
        --------------------------------------------- */

        if (noResults) {

            noResults.hidden =
                visibleCards.length !== 0;

        }


        /* ---------------------------------------------
           LOAD MORE
        --------------------------------------------- */

        if (loadMoreButton) {

            loadMoreButton.style.display =
                visibleCards.length === 0
                    ? "none"
                    : "inline-flex";

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
       SEARCH BUTTON
    ===================================================== */

    if (searchForm) {

        searchForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                /* -----------------------------------------
                   GET VALUES
                ----------------------------------------- */

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


                /* -----------------------------------------
                   VALIDATE ORIGIN
                ----------------------------------------- */

                if (!origin) {

                    if (originInput) {

                        originInput.focus();

                        originInput.setCustomValidity(
                            "Please enter your departure station."
                        );

                        originInput.reportValidity();

                    }

                    return;

                }


                /* -----------------------------------------
                   VALIDATE DESTINATION
                ----------------------------------------- */

                if (!destination) {

                    if (destinationInput) {

                        destinationInput.focus();

                        destinationInput.setCustomValidity(
                            "Please enter your destination."
                        );

                        destinationInput.reportValidity();

                    }

                    return;

                }


                /* -----------------------------------------
                   VALIDATE DATE
                ----------------------------------------- */

                if (!date) {

                    if (travelDateInput) {

                        travelDateInput.focus();

                        travelDateInput.setCustomValidity(
                            "Please choose a travel date."
                        );

                        travelDateInput.reportValidity();

                    }

                    return;

                }


                /* -----------------------------------------
                   CLEAR ERRORS
                ----------------------------------------- */

                if (originInput) {
                    originInput.setCustomValidity("");
                }

                if (destinationInput) {
                    destinationInput.setCustomValidity("");
                }

                if (travelDateInput) {
                    travelDateInput.setCustomValidity("");
                }


                /* -----------------------------------------
                   SEARCH BUTTON
                ----------------------------------------- */

                if (searchButton) {

                    const originalText =
                        searchButton.innerHTML;


                    searchButton.disabled = true;


                    searchButton.innerHTML =
                        "Searching...";


                    setTimeout(() => {

                        searchButton.disabled = false;


                        searchButton.innerHTML =
                            originalText;


                        filterTrains();


                        /* -----------------------------
                           SCROLL TO RESULTS
                        ----------------------------- */

                        if (trainResults) {

                            trainResults.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }

                    }, 450);

                }

                else {

                    filterTrains();

                }

            }
        );

    }


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

        input.addEventListener(
            "input",
            () => {

                input.setCustomValidity("");

            }
        );


        input.addEventListener(
            "change",
            () => {

                input.setCustomValidity("");

            }
        );

    });


    /* =====================================================
       RESET SEARCH
    ===================================================== */

    if (resetSearch) {

        resetSearch.addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (searchForm) {

                    searchForm.reset();

                }


                if (travelDateInput) {

                    travelDateInput.min =
                        today;

                }


                currentFilter =
                    "all";


                /* -----------------------------
                   RESET FILTER BUTTONS
                ----------------------------- */

                filterButtons.forEach(button => {

                    button.classList.remove(
                        "active"
                    );

                });


                const allButton =
                    document.querySelector(
                        '.filter-chip[data-filter="all"]'
                    );


                if (allButton) {

                    allButton.classList.add(
                        "active"
                    );

                }


                /* -----------------------------
                   SHOW ALL TRAINS
                ----------------------------- */

                resultCards.forEach(card => {

                    card.classList.remove(
                        "hidden"
                    );

                    card.style.display = "";

                });


                if (noResults) {

                    noResults.hidden = true;

                }


                if (loadMoreButton) {

                    loadMoreButton.style.display =
                        "inline-flex";

                }


                updateResultsCount(
                    resultCards
                );

            }
        );

    }


    /* =====================================================
       SELECT TRAIN
    ===================================================== */

    document
        .querySelectorAll(".select-train")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    /* -----------------------------
                       COLLECT TRAIN DATA
                    ----------------------------- */

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


                    /* -----------------------------
                       SAVE TRAIN
                    ----------------------------- */

                    localStorage.setItem(
                        "selectedTrain",
                        JSON.stringify(trainData)
                    );


                    /* -----------------------------
                       GO TO CONFIRMATION PAGE
                    ----------------------------- */

                    const destinationPage =
                        button.dataset.confirmation;


                    if (destinationPage) {

                        window.location.href =
                            destinationPage;

                    }

                    else if (
                        button.tagName === "A" &&
                        button.href
                    ) {

                        window.location.href =
                            button.href;

                    }

                }
            );

        });


    /* =====================================================
       LOAD MORE
    ===================================================== */

    if (loadMoreButton) {

        loadMoreButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const originalText =
                    loadMoreButton.textContent;


                loadMoreButton.disabled =
                    true;


                loadMoreButton.textContent =
                    "Loading...";


                setTimeout(() => {

                    loadMoreButton.disabled =
                        false;


                    loadMoreButton.textContent =
                        originalText;


                    alert(
                        "More departures will be available soon."
                    );

                }, 600);

            }
        );

    }


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateResultsCount(
        resultCards
    );

});