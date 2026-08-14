document.addEventListener("DOMContentLoaded", () => {

    // SEARCH BAR
    const searchBar = document.querySelector(".search-bar");

    if (searchBar) {

        const inputs = searchBar.querySelectorAll(".input");

        const originInput = inputs[0];
        const destInput = inputs[1];
        const dateInput = inputs[2];
        const classSelect = inputs[3];

        const searchBtn = searchBar.querySelector(".btn-orange");

        if (dateInput) {
            dateInput.type = "date";
        }

        if (searchBtn) {
            searchBtn.addEventListener("click", (e) => {

                e.preventDefault();

                const origin = originInput.value.trim();
                const destination = destInput.value.trim();

                if (!origin && !destination) {
                    alert("Please enter at least an origin or destination.");
                    originInput.focus();
                    return;
                }

                const searchParams = {
                    origin: origin || "New York",
                    destination: destination || "London",
                    date: dateInput.value || "2026-11-14",
                    selectedClass: classSelect.value
                };

                localStorage.setItem(
                    "voya_search_params",
                    JSON.stringify(searchParams)
                );

                window.location.href = "search.html";
            });
        }
    }


    // POPULAR ROUTES
    const routeCards = document.querySelectorAll(".route-card");

    routeCards.forEach(card => {

        card.style.cursor = "pointer";

        card.addEventListener("click", () => {

            const routeName =
                card.querySelector(".route-name")?.textContent.trim() || "London";

            localStorage.setItem(
                "voya_search_params",
                JSON.stringify({
                    origin: "New York",
                    destination: routeName,
                    date: "2026-11-14",
                    selectedClass: "Economy"
                })
            );

            window.location.href = "search.html";
        });
    });


    // BUSINESS BUTTON
    const heroBusinessBtn =
        document.querySelector(".hero-card .btn-orange");

    if (heroBusinessBtn) {

        heroBusinessBtn.addEventListener("click", (e) => {

            e.preventDefault();

            localStorage.setItem(
                "voya_search_params",
                JSON.stringify({
                    origin: "New York",
                    destination: "London",
                    date: "2026-11-14",
                    selectedClass: "First Class"
                })
            );

            window.location.href = "search.html";
        });
    }


    // LEISURE BUTTON
    const heroLeisureBtn =
        document.querySelector(".hero-card .btn-teal");

    if (heroLeisureBtn) {

        heroLeisureBtn.addEventListener("click", (e) => {

            e.preventDefault();

            localStorage.setItem(
                "voya_search_params",
                JSON.stringify({
                    origin: "New York",
                    destination: "Paris",
                    date: "2026-11-14",
                    selectedClass: "Economy"
                })
            );

            window.location.href = "search.html";
        });
    }

});