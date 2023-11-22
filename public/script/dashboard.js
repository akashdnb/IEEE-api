const loader = document.getElementById('loader');
const searchBar = document.getElementById('search-input');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

var currentPage = 1;
var pagination = {
  total: 1000,
  next: {
    page: 2,
    limit: 10
  }
}

async function fetchEvents(page, filterText) {
  loader.style.display = 'block';
  fetch(`/api/events?page=${page}&title=${filterText}`)
    .then(response => response.json())
    .then(data => {
      loader.style.display = 'none';
      pagination = data.pagination;
      document.getElementById('currentPage').innerText = page;
      handlePagination(pagination);
      displayEvents(data.events);
    })
    .catch(error => {
      console.error('Error fetching events:', error)
      loader.style.display = 'none';
    });
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
fetchEvents(1, '');




// Function to edit an event
function editEvent(id) {
  window.location.href = '/admin/edit-event/' + id;
}

// Function to seach for events
function filterEvents() {
  let searchText = searchBar.value;
  fetchEvents(1, searchText).then(() => {
  }).catch((err) => {
    searchBar.value = '';
  });
}

// Function to delete an event
function deleteEvent(id) {
  var isDelete = confirm("Delete this event?");
  if (isDelete) {
    loader.style.display = 'block';
    fetch('/admin/deleteEvent/' + id, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        loader.style.display = 'none';
        fetchEvents();
      })
      .catch(error => {
        console.error('Error deleting event:', error)
        loader.style.display = 'none';
      });
  }
}


//logout

function logout() {
  loader.style.display = 'block';
  fetch('/admin/logout', {
    method: 'POST',
  })
    .then(response => response.json())
    .then(data => {
      loader.style.display = 'none';
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/admin/login';
    })
    .catch(error => {
      console.error('Error deleting event:', error)
      loader.style.display = 'none';
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/admin/login';
    });
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}


// pagination

function nextPage() {
  if (pagination.next) {
    currentPage = pagination.next.page;
    fetchEvents(pagination.next.page, '');
  }
}

function previousPage() {
  if (pagination.prev) {
    currentPage = pagination.prev.page;
    fetchEvents(pagination.prev.page, '');
  }
}

function handlePagination(pagination) {

  if (pagination.prev) nextBtn.style.display = "block";
  else nextBtn.style.display = "none";

  if (pagination.next) prevBtn.style.display = "block";
  else prevBtn.style.display = "none";

}
