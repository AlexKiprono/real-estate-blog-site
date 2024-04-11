document.addEventListener('DOMContentLoaded', function(){

  const propertyList = document.querySelector("#cardsContainer");

  // Function to render properties
  function renderProperty(posts) {
    let output = '';
    posts.forEach((post) => {
      output += `
        <div class="card lh-1">
          <img src="${post.image}" class="card-img-top m-o" alt="${post.listName}">
  
          <div class="icons justify-content-between mx-3">
              <span class="border border-1">
                  <i onclick="deleteProperty(${post.id})" class="fa fa-trash m-2 delete" aria-hidden="true" id="delete"></i>
              </span>
              <span class="border border-1">
                  <i onclick="editProperty(${post.id})" class="fa fa-pencil m-2 edit" aria-hidden="true" data-bs-toggle="modal" data-bs-target="#editProperty" id="edit"></i>
              </span>
          </div>
  
          <div class="card-body ">
              <h6 class="listName d-block m-0 text-sm">${post.listName}</h6>
              <p class="listDescription m-0">${post.listDescription}</p>
              <p class="listTimeLine">${post.listTimeLine}</p>
              <div class="last-section d-flex justify-content-between m-0">
                  <h6 class="listPrice" style="color:green;" >$${post.price}</h6>
                  <p class="ratings">${post.ratings}</p>
              </div>
          </div>
        
        </div>
      `;
    });

    propertyList.innerHTML = output;
  }

  // Fetch properties and render them
  fetch("http://localhost:5000/properties")
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })

    .then((posts) => renderProperty(posts))

    .catch((error) => console.error('Error fetching data:', error));
});


// Create Property list
document.addEventListener('DOMContentLoaded', function(){
  document.getElementById("addPostForm").addEventListener('submit', (e) => {
    e.preventDefault();
    
    const imageValue = document.querySelector('#image').value;
    const listNameValue = document.querySelector('#listName').value;
    const listDescriptionValue = document.querySelector('#listDescription').value;
    const listTimeLineValue = document.querySelector('#listTimeLine').value;
    const priceValue = document.querySelector('#listPrice').value;
    const ratings = document.querySelector('input[name="rating"]:checked').value; // Get the value of the selected radio button

    // Fetch existing properties to determine the maximum ID
    fetch('http://localhost:5000/properties')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        return response.json();
      })
      .then(properties => {
        // Determine the maximum ID
        const maxId = properties.reduce((max, property) => Math.max(max, property.id), 0);
        
        // Increment the maximum ID for the new property
        const newId = (maxId + 1);
              

        // POST the new property with the incremented ID
        return fetch('http://localhost:5000/properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: newId,
            image: imageValue,
            listName: listNameValue,
            listDescription: listDescriptionValue,
            listTimeLine: listTimeLineValue,
            price: priceValue,
            ratings: ratings
          })
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add property');
        }
        alert('Property added successfully');
      })
      .catch(error => {
        console.error(error);
        alert('Error adding property:', error);
      });
  });
});

//EDIT data in the json-server
function editProperty(id) {
  fetch(`http://localhost:5000/properties/${id}`)
  .then((response) => response.json())
  .then((post) => {
    const editProperty = document.querySelector("#editPropertyForm");

    editProperty.innerHTML = `
      <div class="mb-3">
      <label for="listName" class="form-label">Image</label>
      <input type="url" class="form-control" id="image_update" value="${post.image}" placeholder="image">
      </div>
          
      <div class="mb-3">
        <label for="update_listName" class="form-label">Property Location</label>
        <input type="text" class="form-control" id="update_listName" value="${post.listName}" placeholder="" required>
      </div>
          
      <div class="mb-3">
        <label for="update_description" class="form-label">Description</label>
        <textarea class="form-control" id="update_listDescription" rows="3" placeholder="">${post.listDescription}</textarea>
      </div>

      <div class="mb-3">
        <label for="update_listTimeLine" class="form-label">Timeline</label>
        <input type="text" class="form-control" id="update_listTimeLine" rows="3" placeholder="one night"${post.listTimeLine}>
      </div>
          
      <div class="mb-3">
        <label for="update_listPrice" class="form-label">Price</label>
        <input type="number" class="form-control" id="update_listPrice" value="${post.price}" placeholder="Price">
        <!-- Placeholder text updated for clarity -->
      </div>

      <div class="mb-3">
      <label for="ratings" class="form-label">Ratings</label>
      <div class="edit-rating">
          <input type="radio" id="star5" name="edit-rating" value="⭐⭐⭐⭐⭐"><label for="star5"></label>
          <input type="radio" id="star4" name="edit-rating" value="⭐⭐⭐⭐✩"><label for="star4"></label>
          <input type="radio" id="star3" name="edit-rating" value="⭐⭐⭐✩✩"><label for="star3"></label>
          <input type="radio" id="star2" name="edit-rating" value="⭐⭐✩✩✩"><label for="star2"></label>
          <input type="radio" id="star1" name="edit-rating" value="⭐✩✩✩✩"><label for="star1"></label>
      </div>
    </div>
  
          
      <button onClick="update_post(${id})" type="submit" class="btn btn-primary" id="submit">Submit</button>
    `;
  })
  .catch(error => console.error('Error fetching property for editing:', error));
}

//update post
function update_post(id) {
  const imageValue = document.querySelector('#image_update').value;
  const listNameValue = document.querySelector('#update_listName').value;
  const listDescriptionValue = document.querySelector('#update_listDescription').value;
  const listTimeLineValue = document.querySelector('#update_listTimeLine').value;
  const priceValue = document.querySelector('#update_listPrice').value;
  const ratings = document.querySelector('input[name="edit-rating"]:checked').value;

  fetch(`http://localhost:5000/properties/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image: imageValue,
      listName: listNameValue,
      listDescription: listDescriptionValue,
      listTimeLine: listTimeLineValue,
      price: priceValue,
      ratings: ratings
    })
  })
  .then(() => {
    alert("Property updated successfully");
  })
  .catch(error => console.error('Error updating property:', error));
}

// Function to delete property
function deleteProperty(id) {
  // Confirm before deletion
  if (confirm("Are you sure you want to delete this property?")) {
    fetch(`http://localhost:5000/properties/${id}`, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete property');
      }
      
      console.log(`Property has been deleted.`);
    })
    .catch(error => {
      console.error('Error deleting property:', error);
      alert('Error deleting property. Please try again later.');
    });
  }
}





