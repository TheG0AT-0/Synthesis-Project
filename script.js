// ===== 1. DATA =====
// Every destination is an object in this array.
// The cards, the checkboxes and the price total are all built from it,
// so to add or change a destination you only edit this list.
const destinations = [
  {
    name: "Nungwi Beach",
    category: "Beach",
    description: "Powdery white sand and calm turquoise water at the northern tip of the island. Famous for its sunsets.",
    price: 600,
    image: "images/nungwi.jfif"
  },
  {
    name: "Kendwa Beach",
    category: "Beach",
    description: "A relaxed stretch of sand where the water stays swimmable at any tide. Great for full-moon beach parties.",
    price: 550,
    image: "images/kendwa.jfif"
  },
  {
    name: "Stone Town",
    category: "Culture",
    description: "A UNESCO World Heritage Site of narrow alleys, carved wooden doors and centuries of Swahili history.",
    price: 400,
    image: "images/stone-town.jfif"
  },
  {
    name: "Spice Farm Tour",
    category: "Culture",
    description: "Walk through plantations of cloves, cinnamon and vanilla, and taste fruit straight from the tree.",
    price: 350,
    image: "images/spice-farm.jfif"
  },
  {
    name: "Jozani Forest",
    category: "Nature",
    description: "Zanzibar's last natural forest, home to the rare red colobus monkey found nowhere else on earth.",
    price: 450,
    image: "images/jozani.jfif"
  },
  {
    name: "Prison Island",
    category: "Nature",
    description: "A short boat ride from Stone Town to meet the giant Aldabra tortoises, some over a hundred years old.",
    price: 500,
    image: "images/prison-island.jfif"
  }
];

// ===== 2. GRAB ELEMENTS FROM THE PAGE =====
const cardsContainer = document.getElementById("cards");
const filterButtons = document.querySelectorAll(".filter-btn");
const form = document.getElementById("booking-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const destinationList = document.getElementById("destination-list"); // holds the checkboxes
const dateInput = document.getElementById("date");
const travelersInput = document.getElementById("travelers");
const confirmation = document.getElementById("confirmation");

// ===== 3. SHOW DESTINATION CARDS =====
function displayDestinations(category) {
  // clear whatever cards are there now
  cardsContainer.innerHTML = "";

  // keep everything for "All", otherwise only the matching category
  const filtered = category === "All"
    ? destinations
    : destinations.filter(function (dest) {
        return dest.category === category;
      });

  // build one card for each destination
  filtered.forEach(function (dest) {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <img src="${dest.image}" alt="${dest.name}">
      <div class="card-body">
        <span class="category-tag">${dest.category}</span>
        <h3>${dest.name}</h3>
        <p>${dest.description}</p>
        <div class="card-footer">
          <span class="price">From $${dest.price} per person</span>
          <button class="btn book-btn">Book</button>
        </div>
      </div>
    `;

    // when "Book this" is clicked, fill in the form for that destination
    const bookButton = card.querySelector(".book-btn");
    bookButton.addEventListener("click", function () {
      selectDestination(dest.name);
    });

    cardsContainer.appendChild(card);
  });
}

// ===== 4. FILTER BUTTONS =====
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // move the "active" highlight to the clicked button
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    // show only that category
    displayDestinations(button.dataset.category);
  });
});

// ===== 5. CHECKBOXES + "BOOK THIS" =====
// build one checkbox per destination from the same array so the lists always match
function fillDestinationCheckboxes() {
  destinations.forEach(function (dest) {
    const label = document.createElement("label");
    label.className = "checkbox-item";
    label.innerHTML = `
      <input type="checkbox" name="destination" value="${dest.name}">
      <span>${dest.name}</span>
      <span class="checkbox-price">$${dest.price} pp</span>
    `;
    destinationList.appendChild(label);
  });
}

// returns the names of all ticked boxes, e.g. ["Nungwi Beach", "Stone Town"]
function getSelectedDestinations() {
  const ticked = destinationList.querySelectorAll("input:checked");
  return Array.from(ticked).map(function (box) {
    return box.value;
  });
}

function selectDestination(name) {
  // tick the matching box (this adds to the selection, it never unticks anything)
  const box = destinationList.querySelector('input[value="' + name + '"]');
  box.checked = true;
  clearError("destination");
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
}

// ===== 6. FORM VALIDATION =====
function showError(field, message) {
  document.getElementById(field + "-error").textContent = message;
  document.getElementById(field).classList.add("invalid");
}

function clearError(field) {
  document.getElementById(field + "-error").textContent = "";
  document.getElementById(field).classList.remove("invalid");
}

function validateForm() {
  let isValid = true;
  const fields = ["name", "email", "destination", "date", "travelers"];
  fields.forEach(clearError);

  // name: at least 2 characters
  if (nameInput.value.trim().length < 2) {
    showError("name", "Please enter your full name.");
    isValid = false;
  }

  // email: simple pattern check (something@something.something)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  }

  // destinations: at least one box must be ticked
  if (getSelectedDestinations().length === 0) {
    showError("destination", "Please choose at least one destination.");
    isValid = false;
  }

  // date: must be filled in and not in the past
  if (dateInput.value === "") {
    showError("date", "Please choose a travel date.");
    isValid = false;
  } else if (dateInput.value < todayString()) {
    showError("date", "The date cannot be in the past.");
    isValid = false;
  }

  // travelers: a whole number from 1 to 10
  const travelers = Number(travelersInput.value);
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 10) {
    showError("travelers", "Enter a whole number from 1 to 10.");
    isValid = false;
  }

  return isValid;
}

// today's date as YYYY-MM-DD (the same format a date input uses)
function todayString() {
  return new Date().toISOString().split("T")[0];
}

// turns ["A"] into "A", ["A", "B"] into "A and B", ["A", "B", "C"] into "A, B and C"
function joinNames(list) {
  if (list.length === 1) {
    return list[0];
  }
  return list.slice(0, -1).join(", ") + " and " + list[list.length - 1];
}

// ===== 7. SUBMIT THE FORM =====
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  confirmation.hidden = true;

  if (!validateForm()) {
    return; // errors are already showing, so stop here
  }

  // read the values BEFORE resetting the form
  const name = nameInput.value.trim();
  const selected = getSelectedDestinations();
  const travelers = Number(travelersInput.value);
  const prettyDate = new Date(dateInput.value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // add up the price of every chosen destination, then multiply by travelers
  const chosen = destinations.filter(function (dest) {
    return selected.includes(dest.name);
  });
  const pricePerPerson = chosen.reduce(function (sum, dest) {
    return sum + dest.price;
  }, 0);
  const total = pricePerPerson * travelers;

  confirmation.textContent =
    "Thank you, " + name + "! Your request for " + joinNames(selected) +
    " on " + prettyDate + " for " + travelers +
    (travelers === 1 ? " traveler" : " travelers") +
    " has been received. Estimated total: $" + total + ".";
  confirmation.hidden = false;

  form.reset();
  travelersInput.value = 1;
});

// clear a field's error as soon as the user starts fixing it
[nameInput, emailInput, dateInput, travelersInput].forEach(function (input) {
  input.addEventListener("input", function () {
    clearError(input.id);
  });
});

// same for the checkboxes: ticking one clears the destination error
destinationList.addEventListener("change", function () {
  clearError("destination");
});

// ===== 8. RUN WHEN THE PAGE LOADS =====
dateInput.min = todayString(); // greys out past dates in the date picker
fillDestinationCheckboxes();
displayDestinations("All");
