document.addEventListener("DOMContentLoaded", function () {

    const selectButtons = document.querySelectorAll(".select-train");

    selectButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const train = {
                departure: this.dataset.time,
                arrival: this.dataset.arrival,
                duration: this.dataset.duration,
                route: this.dataset.route,
                price: this.dataset.price,
                class: this.dataset.class
            };

            // Save selected train
            localStorage.setItem(
                "voya_selected_train",
                JSON.stringify(train)
            );

        });

    });

});