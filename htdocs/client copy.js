(function () {
  "use strict";

  //----------------------------------------------------------------- main ---
  window.addEventListener("DOMContentLoaded", function (event) {
    // A reference to Stripe.js initialized with your real test publishable API key.
    const stripe = Stripe(
      "pk_test_51GxBXtBaAL5MTpCuXDqjccAhtRYfVzeTVPdgxM6EHIMeYypX8Z1op6fLfDYOVA6Q4KvU8U1jD1J6eNdA1GLlC5Yh00Fs3BqlVy"
    );

    // The items the customer wants to buy
    const input_amount = document.querySelector("#form_payment_amount");
    console.log(input_amount.value);

    const purchase = {
      items: [{ participation: input_amount.value }],
    };

    // Disable the button until we have Stripe set up on the page
    // document.querySelector("button").disabled = true;
    const stripe_button = document.querySelector("button");
    stripe_button.disabled = true;
    stripe_button.classList.add("btn");

    fetch("/create.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchase),
    })
      .then(function (result) {
        return result.json();
      })
      .then(function (data) {
        console.log(data);
        const elements = stripe.elements();

        const style = {
          base: {
            color: "#32325d",
            fontFamily: "Arial, sans-serif",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#32325d",
            },
          },
          invalid: {
            fontFamily: "Arial, sans-serif",
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        };

        const card = elements.create("card", { style: style });
        // Stripe injects an iframe into the DOM
        card.mount("#card-element");

        card.on("change", function (event) {
          // Disable the Pay button if there are no card details in the Element
          document.querySelector("button").disabled = event.empty;
          document.querySelector("#card-error").textContent = event.error
            ? event.error.message
            : "";
        });

        const form = document.getElementById("payment-form");
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          // Complete payment when the submit button is clicked
          payWithCard(stripe, card, data.clientSecret);
        });
      });

    // Calls stripe.confirmCardPayment
    // If the card requires authentication Stripe shows a pop-up modal to
    // prompt the user to enter authentication details without leaving your page.
    const payWithCard = function (stripe, card, clientSecret) {
      loading(true);
      stripe
        .confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
          },
        })
        .then(function (result) {
          if (result.error) {
            // Show error to your customer
            showError(result.error.message);
          } else {
            // The payment succeeded!
            orderComplete(result.paymentIntent.id);
          }
        });
    };

    /* ------- UI helpers ------- */

    // Shows a success message when the payment is complete
    const orderComplete = function (paymentIntentId) {
      loading(false);
      document
        .querySelector(".result-message a")
        .setAttribute(
          "href",
          "https://dashboard.stripe.com/test/payments/" + paymentIntentId
        );
      document.querySelector(".result-message").classList.remove("hidden");
      document.querySelector("button").disabled = true;
    };

    // Show the customer the error from Stripe if their card fails to charge
    const showError = function (errorMsgText) {
      loading(false);
      const errorMsg = document.querySelector("#card-errors");
      errorMsg.textContent = errorMsgText;
      setTimeout(function () {
        errorMsg.textContent = "";
      }, 4000);
    };

    // Show a spinner on payment submission
    const loading = function (isLoading) {
      if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
      } else {
        document.querySelector("button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
      }
    };

    const timer_x = newTimer().toggle();
    const timer_o = newTimer();
    const board = newBoard();

    const view_context = newContext();
    for (let i = 0; i < 9; i++) {
      const name = i.toString();
      view_context.put(name, newObservable < string > name);
    }

    const board_context = newContext()
      .put("timer_x", timer_x.observable.value)
      .put("timer_o", timer_o.observable.value)
      .put("board_x", board.x)
      .put("board_o", board.o)
      .put("turn", board.turn)
      .merge(view_context)
      .musterPins()
      .activatePins();
    /* No links used for this game */
    // .musterLinks()
    // .activateLinks();

    const timer_x_container: Element =
      document.querySelector(".timer-x") ?? document.createElement("p");
    const timer_o_container: Element =
      document.querySelector(".timer-o") ?? document.createElement("p");

    /**
     * Translate board state to observable view context.
     *
     * @todo Update diff subscriber only, even if setting an observable to
     *       its current value does not cause further notify calls.
     */
    const boardView = function (value: number): void {
      const x = board.x.value;
      const o = board.o.value;
      for (let i = 0; i < 9; i++) {
        const mask = 1 << i;
        const name = i.toString();
        if (x & mask) {
          view_context.observables[name].set("X");
        } else {
          if (o & mask) {
            view_context.observables[name].set("O");
          } else {
            view_context.observables[name].set("");
          }
        }
      }
    };
    /**
     * Add Board state subscriber to refresh view.
     */
    board_context.observables.board_x.subscribe(boardView);
    board_context.observables.board_o.subscribe(boardView);

    /**
     * Add turn subscriber to toggle timers.
     */
    board_context.observables.turn.subscribe((value) => {
      let msg = "";
      switch (value) {
        case Turn.x:
        case Turn.o:
          timer_x.toggle();
          timer_o.toggle();
          timer_x_container.classList.toggle("active");
          timer_o_container.classList.toggle("active");
          return;
        case Turn.draw:
          msg = ": Draw game !";
          break;
        case Turn.win:
          msg = "wins !";
          break;
        default:
          msg = ": something weird happened !";
          break;
      }
      if (timer_x.isOn()) {
        timer_x.toggle();
        timer_x.observable.value.set(msg);
      }
      if (timer_o.isOn()) {
        timer_o.toggle();
        timer_o.observable.value.set(msg);
      }
    });

    //------------------------------------------------------------- grid
    const squares = [...document.querySelectorAll(".square")];
    for (let i = 0, length = squares.length; i < length; i++) {
      squares[i].addEventListener(
        "mousedown",
        function (event) {
          board.play(i);
        },
        false
      );
    }

    //------------------------------------------------------ reset_button
    const reset_button: Element =
      document.querySelector("button[name=reset]") ??
      document.createElement("button");

    reset_button.addEventListener(
      "click",
      function (event: Event): void {
        board.reset();
        timer_x.reset().toggle();
        timer_o.reset();
        timer_x_container.classList.add("active");
        timer_o_container.classList.remove("active");
        event.stopPropagation();
      },
      false
    );
    /**
     * @todo Render single component.
     * @todo Batch renders.
     */
  }); /* DOMContentLoaded */
})(); /* IIFE */
