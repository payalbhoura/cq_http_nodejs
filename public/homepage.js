window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

const productList = document.getElementById('product-list');
const loadMoreButton = document.getElementById('load-more-btn');
let productCount = 1;

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts(1);
});

loadMoreButton.addEventListener('click', () => {
  productCount += 1;
  fetchProducts(productCount);
});

function fetchProducts(count) {
  fetch(`/products?count=${count}`)
    .then((response) => response.json())
    .then((products) => {
      console.log(products);
      for (const product of products) {
        const productCard = document.createElement('div');
        productCard.innerHTML = `
          <div class="product-card" id=${product.id}>
            <img src="${product.image}" alt="${product.name}">
            <h2>
              ${product.name}
            </h2>
            <p><strong>Price:</strong>
              ${product.price}
            </p>
            <div  class="" style="margin-top: 3rem;display: flex; justify-content: space-between; justify-items: center;">
              <button id='update-btn'>Update</button>
              <button id='delete-btn'>Delete</button>
              <div class="view-button" style="cursor:pointer;margin-top:8px;text-decoration: underline; color:#2d3748">View Details</div>
            </div>
          </div>
        `;
        const viewButton = productCard.querySelector('.view-button');
        viewButton.addEventListener('click', () => {
          fetchProductDetails(product.id).then((productDetails) => {
            renderPopup(productDetails);
          });
        });
        let deleteButton = productCard.querySelector('#delete-btn');
        deleteButton.addEventListener('click', () => {
          fetch(`/products?id=${product.id}`, {
            method: 'delete',
          }).then((response) => {
            if (response.status === 200) {
              console.log('Product deleted successfully');
              productList.removeChild(productCard);
            }
          });
        });
        let updateButton = productCard.querySelector('#update-btn');
        updateButton.addEventListener('click', () => {
          let dialog = document.getElementById('edit-product-dialog');
          dialog.showModal();

          // Pre-fill the form with the current product details
          document.getElementById('edit-product-name').value = product.name;
          document.getElementById('edit-product-price').value = product.price;

          document
            .getElementById('edit-product-form')
            .addEventListener('submit', function (e) {
              e.preventDefault();

              // Get the updated product details from the form
              let updatedName =
                document.getElementById('edit-product-name').value;
              let updatedPrice =
                document.getElementById('edit-product-price').value;

              // Update the product details in the products array
              product.name = updatedName;
              product.price = updatedPrice;

              // Send a PUT request to the server
              fetch(`/products?id=${product.id}`, {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
              }).then((response) => {
                if (response.status === 200) {
                  // Close the dialog box
                  dialog.close();
                  // Update the product card with the new details
                  let productCard = document.getElementById(product.id);
                  productCard.querySelector('h2').innerText = updatedName;
                  productCard.querySelector(
                    'p',
                  ).innerHTML = `<strong>Price:</strong> ${updatedPrice}`;
                }
              });
            });
        });
        productList.appendChild(productCard);
      }
    });
}
function UpdateUi(count) {
  for (let i = 1; i <= count; i++) {
    fetchProducts(i);
  }
}

function fetchProductDetails(productId) {
  return fetch(`/productDetails?id=${productId}`)
    .then((response) => response.json())
    .then((productDetails) => {
      return productDetails;
    });
}

function renderPopup(productDetails) {
  const popupElement = document.getElementById('popup');
  const popup = document.createElement('div');
  popupElement.innerHTML = '';
  popup.innerHTML = `<div class="product-popup">
  <div class="product-popup-content">
    <button class="product-popup-close">&times;</button>
    <div class="product-popup-header">
      <h2 class="product-popup-title">${productDetails.name}</h2>
    </div>
    <div class="product-popup-body">
      <div class="product-popup-image">
        <img src="${productDetails.image}" alt="Product Name">
      </div>
      <div class="product-popup-details">
        <p class="product-popup-price">&#x20b9;${productDetails.price}</p>
        <div class="product-popup-sizes">
        <select id="size-select">
        <option value="small">${productDetails.sizes[0]}</option>
        <option value="medium">${productDetails.sizes[1]}</option>
        <option value="large">${productDetails.sizes[2]}</option>
        <option value="large">${productDetails.sizes[3]}</option>
        </select>
        </div>
      </div>
      </div>
      <p class="productDescription">${productDetails.description}</p>
  </div>
</div>`;
  const closeButton = popup.querySelector('.product-popup-close');
  closeButton.addEventListener('click', () => {
    popupElement.innerHTML = '';
  });
  popupElement.appendChild(popup);
}

document.getElementById('close-dialog').addEventListener('click', function () {
  document.getElementById('edit-product-dialog').close();
});
