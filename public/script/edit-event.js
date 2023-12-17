const progressOverlay = document.getElementById("progress-overlay");
const editor = document.getElementById("editor-container");
var eventId = window.eventId;

var quill = new Quill('#editor-container', {
    theme: 'snow'
  });

  var requestOptions = {
    method: 'GET',
  };
  
  fetch(`/api/events/${eventId}`, requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        document.getElementById("title").value = result.title;
        document.getElementById("summary").value = result.summary;
        document.getElementById("author").value = result.author;
        document.getElementById("location").value = result.location;
        document.getElementById("isFeatured").checked = result.isFeatured;
        quill.root.innerHTML = result.body;
    
    })
    .catch(error => console.log('error', error));

    

document.getElementById('create-event-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const content = quill.root.innerHTML;
    formData.set('body', content);
    const encodedFormData = new URLSearchParams(formData).toString();

    progressOverlay.style.display = "flex";

    fetch(`/admin/updateEvent/${eventId}`, {
        method: 'PATCH',
        body: encodedFormData,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
        .then(response => response.json())
        .then(data => {
            progressOverlay.style.display = "none";
            console.log(data);
            alert("Event updated successfully");
            
        })
        .catch(error => {
            console.log(error);
            progressOverlay.style.display = "none";
            alert("Error creating event")
        });
});