//validation

function validateProduct(name, image, price, description) {
  let isValid = true;
  //console.log(isNaN(price));
  if (name.length === 0) {
    alert("name cannot be empty");
    isValid = false;
  }

  if (price.length === 0) {
    alert("price cannot be empty");
    isValid = false;
  }
  if (isNaN(price) || parseFloat(price) <= 0) {
    alert("price cannot be <= 0");
    isValid = false;
  }
  if (description.length > 250) {
    alert("Description cannot be more than 250 characters");
    isValid = false;
  }
  return isValid;
}

//edit product after validating
function validateAndEditProduct(productID) {
  //assign values by id
  const name = document.getElementById("name").value;
  const image = document.getElementById("imageUrl").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  const isValid = validateProduct(name, image, price, description);
  if (isValid) {
    const product = {
      name: name,
      image: image,
      price: parseFloat(price),
      description: description,
    };
    editProduct(product, productID);
    alert("Product Successfully edited");
  }
}

function validateAndAddProduct() {
  const name = document.getElementById("name").value;
  const image = document.getElementById("imageUrl").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  const isValid = validateProduct(name, image, price, description);
  if (isValid) {
    const newProduct = {
      name: name,
      image: image,
      price: parseFloat(price),
      description: description,
    };
    addProduct(newProduct); // calling a function for adding product
    alert("Product Successfully added");
    window.location = "./index.html";
  }
}

//editing products value
function editProduct(newProduct, productID) {
  const products = JSON.parse(localStorage.getItem("products"));
  const product = products[productID];

  if (product === undefined) {
    return;
  }
  products[productID] = newProduct;
  localStorage.setItem("products", JSON.stringify(products));
}

//adding products
function addProduct(newProduct) {
  const randomId = Math.round(Math.random() * 1000); // To get random integers from 0-1000
  const id = "P" + randomId; // P123 P36 etc.

  let products = JSON.parse(localStorage.getItem("products"));
  if (products === null) {
    products = {};
  }
  // console.log("adding product");
  // console.log(products);
  products[id] = newProduct;
  // console.log(products);
  localStorage.setItem("products", JSON.stringify(products));
}

//uploading onscreen
function addProductToTable(product, productID) {
  const table = document.getElementById("productsTable");
  const row = table.insertRow();
  //console.log("adding product to table");
  //row.setAttribute("class", "productRow");
  const idCell = row.insertCell();
  const nameCell = row.insertCell();
  const priceCell = row.insertCell();
  const descrCell = row.insertCell();
  const actionCell = row.insertCell();

  idCell.innerHTML = productID;
  nameCell.innerHTML = product.name;
  priceCell.innerHTML = product.price;
  descrCell.innerHTML = product.description;
  actionCell.innerHTML = `     <span class="actions">
            <a href="viewProduct.html?id=${productID}" class="view">View</a>
            <a href="editProduct.html?id=${productID}" class="edit">Edit</a>
            <button class="sub" style="width:100px" onClick="deleteProduct('${productID}')" class="delete">Delete</button>
        </span> 
    `;
  // console.log("here");
  // console.log(actionCell.innerHTML);
}

//deleting product
function deleteProduct(productID) {
  const products = JSON.parse(localStorage.getItem("products"));
  delete products[productID];
  // console.log("Deleted");
  // console.log(products);
  alert("Product Successfully Deleted");
  localStorage.setItem("products", JSON.stringify(products));
  window.location = "/index.html";
}

//filtering
function filterAndDisplayProducts(searchQuery, sortBy, sortOrder) {
  const table = document.getElementById("productsTable");
  while (table.rows.length > 1) {
    table.deleteRow(-1);
  }

  const products = JSON.parse(localStorage.getItem("products"));
  /*
  {p755:{name:"dhruvi", lname:"shah"}
p345:{name:"vkd", lname:"patel"}}
  */
  let productArray = [];
  //   console.log(sortBy);
  //   console.log(sortOrder);
  for (const productID in products) {
    if (!searchQuery || productID === searchQuery) {
      const product = {
        id: productID,
        name: products[productID].name,
        image: products[productID].image,
        description: products[productID].description,
        price: products[productID].price,
      };

      productArray.push(product);
    }
  }
  if (sortBy !== undefined) {
    productArray = productArray.sort(function (productA, productB) {
      //console.log(productA[sortBy]);
      if (sortOrder === "asc") {
        return productA[sortBy] < productB[sortBy] ? 1 : -1;
      } else {
        return productA[sortBy] > productB[sortBy] ? 1 : -1;
      }
    });
  }
  //   console.log(productArray);
  for (const product of productArray) {
    addProductToTable(product, product.id);
  }
}
