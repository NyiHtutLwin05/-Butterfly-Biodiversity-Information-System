const API_BASE_URL = "http://localhost:8080/api";

// Toast notification system
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-${
        type === "success" ? "check-circle" : "exclamation-circle"
      }"></i>
      <span>${message}</span>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

  // Add CSS for toast if not already present
  if (!document.getElementById("toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
      .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-dark);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
      }
      .toast-success {
        background: var(--success);
      }
      .toast-error {
        background: var(--danger);
      }
      .toast-warning {
        background: var(--warning);
      }
      .toast-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .toast-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
      }
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 5000);
}

// Check if user is logged in
function checkAuth() {
  const token = localStorage.getItem("token");
  const userInfo = document.getElementById("userInfo");
  const usernameDisplay = document.getElementById("usernameDisplay");

  if (token) {
    const username = localStorage.getItem("username");
    if (usernameDisplay) {
      usernameDisplay.textContent = `Welcome, ${username}`;
    }
    if (userInfo) {
      userInfo.style.display = "flex";
    }
    // Hide login/register links
    const authLinks = document.querySelectorAll(
      '.nav-links a[href="login.html"], .nav-links a[href="register.html"]'
    );
    authLinks.forEach((link) => (link.style.display = "none"));
  }
}

// Logout function
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  showToast("Logged out successfully");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

// Load recent posts on homepage - FIXED VERSION
async function loadRecentPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?limit=3`);
    const posts = await response.json();

    const container = document.getElementById("recentPosts");
    if (!container) return;

    container.innerHTML = posts
      .map(
        (post) => `
            <div class="post-card">
                ${
                  post.imageUrl
                    ? `<img src="http://localhost:8080/${post.imageUrl}" alt="${post.butterflySpecies}" class="post-image" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'">`
                    : `<div class="post-image" style="background: linear-gradient(135deg, var(--primary-dark), var(--secondary-dark)); display: flex; align-items: center; justify-content: center; color: white; height: 200px;">
                        <i class="fas fa-butterfly" style="font-size: 3rem;"></i>
                      </div>`
                }
                <div class="post-content">
                    <div class="post-species">${post.butterflySpecies}</div>
                    <div class="post-location">📍 ${
                      post.geographicDistribution
                    }</div>
                    <div class="post-date">📅 ${new Date(
                      post.date
                    ).toLocaleDateString()}</div>
                    <p class="post-comment">${
                      post.comments
                        ? post.comments.substring(0, 100) + "..."
                        : "No description provided"
                    }</p>
                </div>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error loading posts:", error);
    const container = document.getElementById("recentPosts");
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--medium-gray);">
          <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>Unable to load recent sightings. Please try again later.</p>
        </div>
      `;
    }
  }
}

// Load species statistics
function loadSpeciesStats() {
  const speciesList = [
    "Tree Nymph (Idea lyuceus)",
    "Autumn Leaf (Doleschallia bisalitde)",
    "Cruiser (Vindula erota)",
    "Orchard Swallowtail (Papilio aegeus)",
    "Peacock Pansy (Junonia almana)",
    "Painted Jezebel (Delias hyparete)",
    "Malay Baron (Euthalia monina)",
    "Common Bluebottle (Graphium sarpedon)",
    "Green Dragontail (Lamproptera meges)",
    "Blue Glassy Tiger (Ideopsis vulgaris)",
    "Common Rose (Pachliopta aristolochiae)",
    "Great Orange Tip (Hebomoia glaucippe)",
    "Malayan Lacewing (Cethosia hypsea)",
    "Common Birdwing (Troides helena)",
    "Rajah Brooke's Birdwing (Trogonoptera brookiana)",
  ];

  const container = document.querySelector(".species-grid");
  if (!container) return;

  container.innerHTML = speciesList
    .map(
      (species) => `
        <div class="species-card">
            <h4>${species.split("(")[0].trim()}</h4>
            <small>${species.split("(")[1].replace(")", "")}</small>
        </div>
    `
    )
    .join("");
}

// Form validation
function validateRegistration(form) {
  const username = form.username.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (username.length < 3) {
    showToast("Username must be at least 3 characters long", "error");
    return false;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters long", "error");
    return false;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "error");
    return false;
  }

  return true;
}

function validatePost(form) {
  const species = form.butterflySpecies.value.trim();
  const location = form.geographicDistribution.value.trim();
  const date = form.date.value;
  const time = form.time.value;

  if (!species) {
    showToast("Please select a butterfly species", "error");
    return false;
  }

  if (!location) {
    showToast("Please select a location", "error");
    return false;
  }

  if (!date) {
    showToast("Please select a date", "error");
    return false;
  }

  if (!time) {
    showToast("Please select a time", "error");
    return false;
  }

  return true;
}

// Image preview function
function previewImage(input) {
  const preview = document.getElementById("previewImage");
  const previewContainer = document.getElementById("imagePreview");
  const dropZone = document.getElementById("dropZone");

  if (input.files && input.files[0]) {
    const file = input.files[0];

    // Check file size (1.2MB max)
    if (file.size > 1.2 * 1024 * 1024) {
      showToast("File size must be less than 1.2MB", "error");
      input.value = "";
      return;
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      showToast("Only JPG and PNG files are allowed", "error");
      input.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
      previewContainer.style.display = "block";
      dropZone.style.display = "none";
    };

    reader.readAsDataURL(file);
  }
}

// Remove image function
function removeImage() {
  const input = document.getElementById("image");
  const previewContainer = document.getElementById("imagePreview");
  const dropZone = document.getElementById("dropZone");

  input.value = "";
  previewContainer.style.display = "none";
  dropZone.style.display = "block";
}

// Check if user is logged in for create-post page
function checkLogin() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const loginRequired = document.getElementById("loginRequired");
  const postFormContainer = document.getElementById("postFormContainer");
  const userInfo = document.getElementById("userInfo");
  const usernameDisplay = document.getElementById("usernameDisplay");

  if (!token || !username) {
    // Not logged in
    if (loginRequired) loginRequired.style.display = "block";
    if (postFormContainer) postFormContainer.style.display = "none";
  } else {
    // Logged in
    if (loginRequired) loginRequired.style.display = "none";
    if (postFormContainer) postFormContainer.style.display = "block";
    if (userInfo) userInfo.style.display = "flex";
    if (usernameDisplay) usernameDisplay.textContent = `Welcome, ${username}`;

    // Set today's date as default
    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById("date");
    if (dateInput && !dateInput.value) {
      dateInput.value = today;
    }

    // Set current time as default
    const now = new Date();
    const timeInput = document.getElementById("time");
    if (timeInput && !timeInput.value) {
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      timeInput.value = `${hours}:${minutes}`;
    }
  }
}

// Character counter for comments
function setupCharCounter() {
  const comments = document.getElementById("comments");
  const charCount = document.getElementById("charCount");

  if (comments && charCount) {
    comments.addEventListener("input", function () {
      charCount.textContent = this.value.length;
      if (this.value.length > 500) {
        charCount.style.color = "var(--danger)";
      } else if (this.value.length > 450) {
        charCount.style.color = "var(--warning)";
      } else {
        charCount.style.color = "var(--medium-gray)";
      }
    });
  }
}

// Drag and drop for image
function setupDragDrop() {
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("image");

  if (dropZone && fileInput) {
    dropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.style.borderColor = "var(--accent)";
      this.style.backgroundColor = "rgba(233, 69, 96, 0.1)";
    });

    dropZone.addEventListener("dragleave", function (e) {
      e.preventDefault();
      this.style.borderColor = "var(--medium-gray)";
      this.style.backgroundColor = "transparent";
    });

    dropZone.addEventListener("drop", function (e) {
      e.preventDefault();
      this.style.borderColor = "var(--medium-gray)";
      this.style.backgroundColor = "transparent";

      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        previewImage(fileInput);
      }
    });
  }
}

function initCreatePostPage() {
  checkLogin();
  setupCharCounter();
  setupDragDrop();

  const imageInput = document.getElementById("image");
  if (imageInput) {
    imageInput.addEventListener("change", function () {
      previewImage(this);
    });
  }

  // Check if we're in edit mode
  const urlParams = new URLSearchParams(window.location.search);
  const editPostId = urlParams.get("edit");

  if (editPostId) {
    // If in edit mode, don't attach the create post listener
    // The edit listener will be attached in loadPostForEditing
    loadPostForEditing(editPostId);
  } else {
    // Only attach create post listener if NOT in edit mode
    attachCreatePostListener();
  }
}

// Separate function for attaching create post listener
function attachCreatePostListener() {
  const postForm = document.getElementById("postForm");
  if (!postForm) return;

  // Remove any existing listeners first
  const newForm = postForm.cloneNode(true);
  postForm.parentNode.replaceChild(newForm, postForm);

  // Re-initialize form elements
  setupCharCounter();
  setupDragDrop();

  // Re-add event listener for image input
  const imageInput = document.getElementById("image");
  if (imageInput) {
    imageInput.addEventListener("change", function () {
      previewImage(this);
    });
  }

  // Attach create post listener
  newForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validatePost(this)) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login first", "error");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
      return;
    }

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Creating Post...';
    submitBtn.disabled = true;

    const formData = new FormData(this);

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Post created successfully!");
        setTimeout(() => {
          window.location.href = "posts.html";
        }, 1500);
      } else {
        showToast(data.error || "Failed to create post", "error");
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      showToast("Error creating post", "error");
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function setupEditMode(post) {
  // Set hidden postId field
  const postIdField = document.getElementById("postId");
  if (postIdField) {
    postIdField.value = post._id;
  }

  // Update page title and header
  document.title = "Edit Post - BBIS";
  const header = document.querySelector("h1");
  if (header) {
    header.innerHTML = '<i class="fas fa-edit"></i> Edit Your Sighting';
  }

  // Update submit button
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Observation';
  }

  // Populate form fields
  document.getElementById("butterflySpecies").value = post.butterflySpecies;
  document.getElementById("geographicDistribution").value =
    post.geographicDistribution;
  document.getElementById("date").value = new Date(post.date)
    .toISOString()
    .split("T")[0];
  document.getElementById("time").value = post.time;
  document.getElementById("primaryActivity").value = post.primaryActivity;
  document.getElementById("duration").value = post.duration;
  document.getElementById("comments").value = post.comments;

  // Update character count
  const charCount = document.getElementById("charCount");
  if (charCount) {
    charCount.textContent = post.comments.length;
  }

  // Handle existing image
  if (post.imageUrl) {
    const preview = document.getElementById("previewImage");
    const previewContainer = document.getElementById("imagePreview");
    const dropZone = document.getElementById("dropZone");

    if (preview && previewContainer && dropZone) {
      preview.src = `${API_BASE_URL}/${post.imageUrl}`;
      previewContainer.style.display = "block";
      dropZone.style.display = "none";
    }
  }
}

// Load all posts
async function loadAllPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    const posts = await response.json();

    const container = document.getElementById("allPosts");
    if (!container) return;

    container.innerHTML = posts
      .map(
        (post) => `
            <div class="post-card">
                ${
                  post.imageUrl
                    ? `<img src="${API_BASE_URL}/${post.imageUrl}" alt="${post.butterflySpecies}" class="post-image">`
                    : ""
                }
                <div class="post-content">
                    <div class="post-header">
                        <div class="post-species">${post.butterflySpecies}</div>
                        <div class="post-author">👤 ${post.username}</div>
                    </div>
                    <div class="post-location">📍 ${
                      post.geographicDistribution
                    }</div>
                    <div class="post-date">📅 ${new Date(
                      post.date
                    ).toLocaleDateString()} ⏰ ${post.time}</div>
                    <div class="post-activity">${post.primaryActivity} • ${
          post.duration
        } minutes</div>
                    <p class="post-comment">${post.comments}</p>
                    <div class="post-actions" id="actions-${post._id}"></div>
                </div>
            </div>
        `
      )
      .join("");

    // Add edit/delete buttons for user's own posts
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      posts.forEach((post) => {
        if (post.username === username) {
          const actionsDiv = document.getElementById(`actions-${post._id}`);
          if (actionsDiv) {
            actionsDiv.innerHTML = `
              <button class="btn-edit" onclick="editPost('${post._id}')" style="background: var(--warning); color: white; border: none; padding: 0.5rem 1rem; border-radius: var(--border-radius); margin-right: 0.5rem; cursor: pointer;">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn-delete" onclick="deletePost('${post._id}')" style="background: var(--danger); color: white; border: none; padding: 0.5rem 1rem; border-radius: var(--border-radius); cursor: pointer;">
                <i class="fas fa-trash"></i> Delete
              </button>
            `;
          }
        }
      });
    }
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

async function searchPosts(query) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/posts/search?q=${encodeURIComponent(query)}`
    );
    const posts = await response.json();

    const container = document.getElementById("allPosts");
    if (!container) return;

    container.innerHTML = posts
      .map(
        (post) => `
            <div class="post-card">
                ${
                  post.imageUrl
                    ? `<img src="${API_BASE_URL}/${post.imageUrl}" alt="${post.butterflySpecies}" class="post-image">`
                    : ""
                }
                <div class="post-content">
                    <div class="post-header">
                        <div class="post-species">${post.butterflySpecies}</div>
                        <div class="post-author">👤 ${post.username}</div>
                    </div>
                    <div class="post-location">📍 ${
                      post.geographicDistribution
                    }</div>
                    <div class="post-date">📅 ${new Date(
                      post.date
                    ).toLocaleDateString()} ⏰ ${post.time}</div>
                    <div class="post-activity">${post.primaryActivity} • ${
          post.duration
        } minutes</div>
                    <p class="post-comment">${post.comments}</p>
                    <div class="post-actions" id="search-actions-${
                      post._id
                    }"></div>
                </div>
            </div>
        `
      )
      .join("");

    // Add edit/delete buttons for user's own posts in search results
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      posts.forEach((post) => {
        if (post.username === username) {
          const actionsDiv = document.getElementById(
            `search-actions-${post._id}`
          );
          if (actionsDiv) {
            actionsDiv.innerHTML = `
              <button class="btn-edit" onclick="editPost('${post._id}')" style="background: var(--warning); color: white; border: none; padding: 0.5rem 1rem; border-radius: var(--border-radius); margin-right: 0.5rem; cursor: pointer;">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn-delete" onclick="deletePost('${post._id}')" style="background: var(--danger); color: white; border: none; padding: 0.5rem 1rem; border-radius: var(--border-radius); cursor: pointer;">
                <i class="fas fa-trash"></i> Delete
              </button>
            `;
          }
        }
      });
    }
  } catch (error) {
    console.error("Error searching posts:", error);
  }
}

async function deletePost(postId) {
  // Create custom confirmation modal
  const confirmModal = document.createElement("div");
  confirmModal.className = "modal-overlay";
  confirmModal.id = "deleteModal";
  confirmModal.innerHTML = `
    <div class="modal" style="max-width: 400px;">
      <div class="modal-header">
        <h3 style="color: var(--primary-dark);">Confirm Delete</h3>
        <button class="modal-close" id="modalCloseBtn">&times;</button>
      </div>
      <div class="modal-body">
        <p style="color: var(--dark-gray);">Are you sure you want to delete this post? This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" id="cancelDelete" style="color: var(--primary-dark); border: 1px solid var(--medium-gray);">Cancel</button>
        <button class="btn-danger" id="confirmDelete">Delete</button>
      </div>
    </div>
  `;

  document.body.appendChild(confirmModal);
  document.body.style.overflow = "hidden"; // Prevent scrolling

  // Add modal styles if not present
  if (!document.getElementById("modal-styles")) {
    const style = document.createElement("style");
    style.id = "modal-styles";
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
      }
      .modal {
        background: white;
        border-radius: var(--border-radius);
        padding: 2rem;
        box-shadow: var(--shadow);
        width: 90%;
        max-width: 500px;
        animation: modalSlideIn 0.3s ease;
      }
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 1rem;
      }
      .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--medium-gray);
        transition: color 0.3s;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      .modal-close:hover {
        color: var(--danger);
        background: rgba(231, 76, 60, 0.1);
      }
      .modal-body {
        margin-bottom: 1.5rem;
      }
      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
      }
      .btn-danger {
        background: var(--danger);
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s;
      }
      .btn-danger:hover {
        background: #c0392b;
      }
    `;
    document.head.appendChild(style);
  }

  // Close modal function
  const closeModal = () => {
    confirmModal.remove();
    document.body.style.overflow = "auto";
  };

  // Setup event listeners
  setTimeout(() => {
    // Close button
    const closeBtn = document.getElementById("modalCloseBtn");
    if (closeBtn) {
      closeBtn.onclick = closeModal;
    }

    // Cancel button
    const cancelBtn = document.getElementById("cancelDelete");
    if (cancelBtn) {
      cancelBtn.onclick = closeModal;
    }

    // Confirm delete button
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    if (confirmDeleteBtn) {
      confirmDeleteBtn.onclick = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          showToast("Please login first", "error");
          closeModal();
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            showToast("Post deleted successfully");
            closeModal();
            // Reload posts
            if (typeof loadAllPosts === "function") {
              loadAllPosts();
            }
          } else {
            showToast("Failed to delete post", "error");
            closeModal();
          }
        } catch (error) {
          showToast("Error deleting post", "error");
          closeModal();
        }
      };
    }

    confirmModal.onclick = (e) => {
      if (e.target === confirmModal) {
        closeModal();
      }
    };
  }, 100);
}

async function editPost(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    const posts = await response.json();
    const post = posts.find((p) => p._id === postId);

    if (!post) {
      showToast("Post not found", "error");
      return;
    }

    localStorage.setItem("editingPost", JSON.stringify(post));

    window.location.href = `create-post.html?edit=${postId}`;
  } catch (error) {
    console.error("Error loading post for editing:", error);
    showToast("Error loading post", "error");
  }
}

async function loadPostForEditing(postId) {
  try {
    const postData = localStorage.getItem("editingPost");

    if (!postData) {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
      const post = await response.json();

      if (!response.ok) {
        throw new Error(post.error || "Post not found");
      }

      populateEditForm(post);
      return;
    }

    const post = JSON.parse(postData);
    populateEditForm(post);

    // Clear the stored data
    localStorage.removeItem("editingPost");
  } catch (error) {
    console.error("Error loading post for editing:", error);
    showToast("Error loading post for editing", "error");
    // Redirect back to posts after 2 seconds
    setTimeout(() => {
      window.location.href = "posts.html";
    }, 2000);
  }
}

function populateEditForm(post) {
  console.log("Populating form with post data:", post); // Debug log

  // Update page title
  document.title = "Edit Post - BBIS";

  // Update header
  const header = document.querySelector("h1");
  if (header) {
    header.innerHTML = '<i class="fas fa-edit"></i> Edit Your Sighting';
  }

  // Update submit button
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Observation';
    submitBtn.dataset.postId = post._id; // Store post ID on button
  }

  // Wait for form elements to be available
  const waitForFormElements = setInterval(() => {
    const speciesSelect = document.getElementById("butterflySpecies");
    const locationSelect = document.getElementById("geographicDistribution");

    if (speciesSelect && locationSelect) {
      clearInterval(waitForFormElements);

      // Now populate the form fields
      setTimeout(() => {
        if (speciesSelect) {
          speciesSelect.value = post.butterflySpecies;
        }

        if (locationSelect) {
          locationSelect.value = post.geographicDistribution;
        }

        // Populate other fields
        const dateInput = document.getElementById("date");
        if (dateInput) {
          dateInput.value = new Date(post.date).toISOString().split("T")[0];
        }

        const timeInput = document.getElementById("time");
        if (timeInput) {
          timeInput.value = post.time;
        }

        const activityInput = document.getElementById("primaryActivity");
        if (activityInput) {
          activityInput.value = post.primaryActivity;
        }

        const durationInput = document.getElementById("duration");
        if (durationInput) {
          durationInput.value = post.duration;
        }

        const commentsInput = document.getElementById("comments");
        if (commentsInput) {
          commentsInput.value = post.comments;
        }

        // Update character count
        const charCount = document.getElementById("charCount");
        if (charCount && commentsInput) {
          charCount.textContent = commentsInput.value.length;
        }

        // Handle existing image
        if (post.imageUrl) {
          const preview = document.getElementById("previewImage");
          const previewContainer = document.getElementById("imagePreview");
          const dropZone = document.getElementById("dropZone");

          if (preview && previewContainer && dropZone) {
            preview.src = `${API_BASE_URL}/${post.imageUrl}`;
            previewContainer.style.display = "block";
            dropZone.style.display = "none";

            // Store the existing image URL for reference
            const form = document.getElementById("postForm");
            if (form) {
              form.dataset.existingImage = post.imageUrl;
            }
          }
        }

        console.log("Form populated successfully");
      }, 100);
    }
  }, 100);

  setTimeout(() => {
    clearInterval(waitForFormElements);
  }, 3000);

  updateFormSubmissionForEdit(post._id);
}

// Function to update form submission for edit mode
function updateFormSubmissionForEdit(postId) {
  const form = document.getElementById("postForm");
  if (!form) return;

  // Remove existing event listeners
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  // Add new submit handler for edit
  newForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validatePost(this)) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login first", "error");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
      return;
    }

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Updating Post...';
    submitBtn.disabled = true;

    const formData = new FormData(this);

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Post updated successfully!");
        setTimeout(() => {
          window.location.href = "posts.html";
        }, 1500);
      } else {
        showToast(data.error || "Failed to update post", "error");
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    } catch (error) {
      showToast("Error updating post", "error");
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Check which page we're on and initialize accordingly
document.addEventListener("DOMContentLoaded", function () {
  checkAuth();

  // Load data based on current page
  if (document.getElementById("recentPosts")) {
    loadRecentPosts();
    loadSpeciesStats();
  }

  // Initialize create post page - this will handle both create and edit modes
  if (document.getElementById("postForm")) {
    initCreatePostPage();
  }

  // Setup form submissions - ONLY for login and register
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = {
        username: this.username.value,
        password: this.password.value,
      };

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username);
          showToast("Login successful!");
          setTimeout(() => {
            window.location.href = "posts.html";
          }, 1500);
        } else {
          showToast(data.error || "Login failed", "error");
        }
      } catch (error) {
        showToast("Error connecting to server", "error");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!validateRegistration(this)) return;

      const formData = {
        username: this.username.value,
        password: this.password.value,
      };

      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          showToast("Registration successful! Please login.");
          setTimeout(() => {
            window.location.href = "login.html";
          }, 1500);
        } else {
          showToast(data.error || "Registration failed", "error");
        }
      } catch (error) {
        showToast("Error connecting to server", "error");
      }
    });
  }

  // Load posts on posts page
  if (document.getElementById("allPosts")) {
    loadAllPosts();

    // Setup search
    const searchBox = document.getElementById("searchBox");
    if (searchBox) {
      searchBox.addEventListener("input", function () {
        searchPosts(this.value);
      });
    }
  }
});
