// API endpoint to fetch products
const apiUrl = 'https://interveiw-mock-api.vercel.app/api/getProducts';

// Getting elements from the HTML
const productContainer = document.getElementById('products-container');
const productCount = document.getElementById('product-count');
const sortDropdown = document.getElementById('sort-select');

let allProducts = [];

// Function to update the product count text
function showProductCount() {
  productCount.innerText = allProducts.length + " Products";
}

// Function to create and display all products
function showProducts(list) {
  productContainer.innerHTML = "";

  list.forEach((item, i) => {
    const name = item.title || "No name available";
    const desc = item.body_html || "No description";
    const price = item.variants?.[0]?.price || "N/A";
    const image = item.image?.src || "fallback.jpg";

    // Create product card
    const box = document.createElement('div');
    box.className = "product-card";

    box.innerHTML = `
      <img src="${image}" alt="${name}">
      <h3>${name}</h3>
      <p>${desc}</p>
      <h4>Rs. ${price}</h4>
      <button class="add-cart-btn">ADD TO CART</button>
    `;

    // Add fade-in animation with delay
    setTimeout(() => {
      box.classList.add("show");
    }, i * 100);

    productContainer.appendChild(box);
  });
}

// Fetch data from API
function loadProducts() {
  productContainer.innerHTML = "<p>Loading...</p>";

  fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("API call failed");
      }
      return response.json();
    })
    .then(function (result) {
      // Check if data is valid
      if (result && result.data && Array.isArray(result.data)) {
        // Extract inner 'product' from each item
        allProducts = result.data.map(function (item) {
          return item.product;
        });

        showProductCount();
        showProducts(allProducts);
      } else {
        productContainer.innerHTML = "<p>⚠️ No valid products found.</p>";
      }
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
      productContainer.innerHTML = "<p style='color:red;'>❌ Could not load products.</p>";
    });
}

// Sorting handler
sortDropdown.addEventListener("change", function () {
  let sortedList = [...allProducts]; // copy of original

  if (sortDropdown.value === "asc") {
    sortedList.sort(function (a, b) {
      return parseFloat(a.variants?.[0]?.price || 0) - parseFloat(b.variants?.[0]?.price || 0);
    });
  } else if (sortDropdown.value === "desc") {
    sortedList.sort(function (a, b) {
      return parseFloat(b.variants?.[0]?.price || 0) - parseFloat(a.variants?.[0]?.price || 0);
    });
  }

  showProducts(sortedList);
});

// Load everything on page load
loadProducts();
