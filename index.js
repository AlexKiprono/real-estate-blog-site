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

                  <div class="likes-section" data-image-id="${post.id}">
                  <span class="likes">${post.likesCount} likes</span>
                  <i class="fa fa-heart like-button" aria-hidden="true"></i>
                  </div>

              </div>
          </div>


          <a href="#" class="btn text-decoration-none btn-primary mb-3 viewAll" id="viewAll" data-bs-toggle="modal" data-bs-target="#viewAllDetails" data-postId="${post.id}">View more...</a>
        
        
        </div>
      `;
    });

    propertyList.innerHTML = output;
  }

  // Fetch properties and render them
  fetch("http://localhost:3000/properties")
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })

    .then((posts) => renderProperty(posts))

    .catch((error) => console.error('Error fetching data:', error));



        // update likes
    document.addEventListener('click',(e) => {
        if (e.target.classList.contains('like-button')) {
            const likeButton = e.target;
            const likesSection = likeButton.closest('.likes-section');
            const postId = likesSection.dataset.postId;
            const likesSpan = likesSection.querySelector('.likes');
            let likes = parseInt(likesSpan.textContent);
            if (!isNaN(likes)) {
                likes++;
                updateLikes(postId, likes);
                likesSpan.textContent = `${likes} likes`;
            }
        }
    });


    // Function to update likes on the server and in the page
    function updateLikes(postId, likes) {
      fetch(`http://localhost:3000/properties/${postId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ likes: likes }),
      })
      .then(response => response.json())
      .then(updatedPost => {
          const likesCount = document.querySelector(`#like-count[${postId}"] .likes`);
          likesCount.textContent = `${updatedPost.likes} likes`;
      })
      .catch(error => console.error('Error updating likes:', error));
    }



    //view all data on a modal

// Event listener for "viewAll" links
document.addEventListener('DOMContentLoaded', function() {
  // Event listener for "viewAll" links
  document.querySelectorAll(".viewAll").forEach(link => {
      link.addEventListener("click", (event) => {
          event.preventDefault();
          const postId = event.target.dataset.postid; // Corrected to dataset.postid
          // Fetch the post data from your API using postId
          fetch(`http://localhost:3000/properties/${postId}`)
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Failed to fetch post data');
                  }
                  return response.json();
              })
              .then(post => {
                  // Populate modal with post details
                  const modalBody = document.getElementById('viewAllDetails');
                  modalBody.innerHTML = `
                      <div class="card lh-1">
                          <img src="${post.image}" class="card-img-top m-o" alt="${post.listName}">
                          <div class="card-body">
                              <h5 class="card-title">${post.listName}</h5>
                              <p class="card-text">${post.listDescription}</p>
                              <p class="card-text"><small class="text-muted">${post.listTimeLine}</small></p>
                              <p class="card-text" style="color:green;">Price: $${post.price}</p>
                          </div>
                          <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          </div>

                          <div class="mb-3">
                          <label for="comments" class="form-label">Leave your Comments</label>
                          <textarea class="form-control" id="comments" rows="3" placeholder=""></textarea>
                        </div>
                      </div>
                  `;

                  const viewAllModal = new bootstrap.Modal(document.getElementById('viewAllDetails'));
                  viewAllModal.show();
              })
              .catch(error => console.error('Error fetching post data:', error));
      });
  });
});







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

    // Fetch existing properties to determine the maximum ID
    fetch('http://localhost:3000/properties')
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
        return fetch('http://localhost:3000/properties', {
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
            price: priceValue
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
  fetch(`http://localhost:3000/properties/${id}`)
  .then((response) => response.json())
  .then((post) => {
    const editProperty = document.querySelector("#editPropertyForm");

    editProperty.innerHTML = `
      <div class="input-group mb-3">
        <label class="input-group-text" for="inputGroupFile01">Edit Image</label>
        <input type="file" class="form-control" id="image_update" value="${post.image}" accept="images/*">
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
          
      <button onClick="update_post(${id})" type="submit" class="btn btn-primary" id="submit">Submit</button>
    `;
  })
  .catch(error => console.error('Error fetching property for editing:', error));
}

//update
function update_post(id) {
  const imageValue = document.querySelector('#image_update').value;
  const listNameValue = document.querySelector('#update_listName').value;
  const listDescriptionValue = document.querySelector('#update_listDescription').value;
  const listTimeLineValue = document.querySelector('#update_listTimeLine').value;
  const priceValue = document.querySelector('#update_listPrice').value;

  fetch(`http://localhost:3000/properties/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image: imageValue,
      listName: listNameValue,
      listDescription: listDescriptionValue,
      listTimeLine: listTimeLineValue,
      price: priceValue
    })
  })
  .then(() => {
    alert("Property updated successfully");
  })
  .catch(error => console.error('Error updating property:', error));
}

// Function to delete property
function deleteProperty(id) {
  // Confirm with the user before deletion
  if (confirm("Are you sure you want to delete this property?")) {
    fetch(`http://localhost:3000/properties/${id}`, {
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





