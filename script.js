// ===== 1. DATA =====
// Every destination is an object in this array.
// The cards, the dropdown and the price total are all built from it,
// so to add or change a destination you only edit this list.
const destinations = [
  {
    name: "Nungwi Beach",
    category: "Beach",
    description: "Powdery white sand and calm turquoise water at the northern tip of the island. Famous for its sunsets.",
    price: 60,
    image: "images/nungwi.jfif"
  },
  {
    name: "Kendwa Beach",
    category: "Beach",
    description: "A relaxed stretch of sand where the water stays swimmable at any tide. Great for full-moon beach parties.",
    price: 55,
    image: "images/kendwa.jfif"
  },
  {
    name: "Stone Town",
    category: "Culture",
    description: "A UNESCO World Heritage Site of narrow alleys, carved wooden doors and centuries of Swahili history.",
    price: 40,
    image: "images/stone-town.jfif"
  },
  {
    name: "Spice Farm Tour",
    category: "Culture",
    description: "Walk through plantations of cloves, cinnamon and vanilla, and taste fruit straight from the tree.",
    price: 35,
    image: "images/spice-farm.jfif"
  },
  {
    name: "Jozani Forest",
    category: "Nature",
    description: "Zanzibar's last natural forest, home to the rare red colobus monkey found nowhere else on earth.",
    price: 45,
    image: "images/jozani.jfif"
  },
  {
    name: "Prison Island",
    category: "Nature",
    description: "A short boat ride from Stone Town to meet the giant Aldabra tortoises, some over a hundred years old.",
    price: 50,
    image: "images/prison-island.jfif"
  }
];

// ===== 2. GRAB ELEMENTS FROM THE PAGE =====
const cardsContainer = document.getElementById("cards");
const filterButtons = document.querySelectorAll(".filter-btn");
const form = document.getElementById("booking-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const destinationSelect = document.getElementById("destination");
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
          <button class="btn book-btn">Book this</button>
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

// ===== 5. DROPDOWN + "BOOK THIS" =====
// fill the dropdown from the same array so the lists always match
function fillDestinationDropdown() {
  destinations.forEach(function (dest) {
    const option = document.createElement("option");
    option.value = dest.name;
    option.textContent = dest.name;
    destinationSelect.appendChild(option);
  });
}

function selectDestination(name) {
  destinationSelect.value = name;
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

  // destination: must pick one
  if (destinationSelect.value === "") {
    showError("destination", "Please choose a destination.");
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

// ===== 7. SUBMIT THE FORM =====
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  confirmation.hidden = true;

  if (!validateForm()) {
    return; // errors are already showing, so stop here
  }

  // read the values BEFORE resetting the form
  const name = nameInput.value.trim();
  const destinationName = destinationSelect.value;
  const travelers = Number(travelersInput.value);
  const prettyDate = new Date(dateInput.value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // look up the price in the array to work out the total
  const chosen = destinations.find(function (dest) {
    return dest.name === destinationName;
  });
  const total = chosen.price * travelers;

  confirmation.textContent =
    "Thank you, " + name + "! Your request for " + destinationName +
    " on " + prettyDate + " for " + travelers +
    (travelers === 1 ? " traveler" : " travelers") +
    " has been received. Estimated total: $" + total + ".";
  confirmation.hidden = false;

  form.reset();
  travelersInput.value = 1;
});

// clear a field's error as soon as the user starts fixing it
[nameInput, emailInput, destinationSelect, dateInput, travelersInput].forEach(function (input) {
  input.addEventListener("input", function () {
    clearError(input.id);
  });
});

// ===== 8. RUN WHEN THE PAGE LOADS =====
dateInput.min = todayString(); // greys out past dates in the date picker
fillDestinationDropdown();
displayDestinations("All");
