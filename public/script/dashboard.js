function fetchEvents() {
    fetch('/api/events') // Replace with your API endpoint
      .then(response => response.json())
      .then(data => {
          console.log(data.events)
        displayEvents(data.events);
      })
      .catch(error => console.error('Error fetching events:', error));
  }

  function displayEvents(events) {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = '';

    // Loop through the events and create list items
    events.forEach(event => {
      const listItem = document.createElement('li');
      listItem.className = 'event';

      listItem.innerHTML = `
        <img src="${event.images[0]}" alt="${event.title} Image">
        <div class="event-details">
          <h3>${event.title}</h3>
          <p>${event.body}</p>
          <p>Author: ${event.author}</p>
        </div>
        <div class="event-actions">
          <button onclick="editEvent('${event._id}')">Edit</button>
          <button onclick="deleteEvent('${event._id}')">Delete</button>
        </div>
      `;

      eventList.appendChild(listItem);
    });
  }
  fetchEvents();

  


  // Function to edit an event
  function editEvent(id) {
    console.log('Edit event with ID:', id);
  }

  // Function to delete an event
  function deleteEvent(id) {
    fetch('/admin/deleteEvent/' + id, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        fetchEvents();
      })
      .catch(error => console.error('Error deleting event:', error));
    console.log('Delete event with ID:', id);
  }
