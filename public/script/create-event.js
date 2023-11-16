const progressOverlay = document.getElementById("progress-overlay");
const editor = document.getElementById("editor-container");

var quill = new Quill('#editor-container', {
    theme: 'snow'
  });


document.addEventListener("DOMContentLoaded", function () {
    const inputImages = document.getElementById("images");
    const imagePreviewContainer = document.getElementById("image-preview-container");

    inputImages.addEventListener("change", function () {
      imagePreviewContainer.innerHTML = ""; // Clear previous previews

      const files = this.files;
      const maxImages = 5;

      for (let i = 0; i < files.length && i < maxImages; i++) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(files[i]);
        img.alt = "Image Preview";
        img.className = "image-preview";
        imagePreviewContainer.appendChild(img);
      }
    });
  });

document.getElementById('create-event-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const content = quill.root.innerHTML;
    formData.set('body', content);

    progressOverlay.style.display = "flex";

    fetch('/admin/postEvent', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            progressOverlay.style.display = "none";
            window.location.href = 'dashboard'
            
        })
        .catch(error => {
            console.log(error);
            progressOverlay.style.display = "none";
            alert("Error creating event")
        });
});