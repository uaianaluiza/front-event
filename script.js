const apiUrlEvents = 'http://localhost:8080/events/v2';
const apiUrlParticipant = 'http://localhost:8080/participant';

async function listEvents() {
    try {
        const response = await fetch(`${apiUrlEvents}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const events = await response.json();
        const tableBody = document.querySelector('#eventsTable tbody');
        tableBody.innerHTML = '';
        events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.id}</td>
                <td>${event.name}</td>
                <td>${event.date}</td>
                <td>${event.local ? `${event.local.logradouro}, ${event.local.unidade} ${event.local.complemento ? '- ' + event.local.complemento : ''} - ${event.local.bairro}, ${event.local.localidade} - ${event.local.uf}` : 'N/A'}</td>
                <td>${event.participants ? event.participants.length : 0}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error listing events:', error);
        alert('Failed to list events. Please check the console.');
    }
}

async function getEventByName() {
    const eventName = document.getElementById('searchEventName').value;
    try {
        const response = await fetch(`${apiUrlEvents}/${eventName}`);
        if (!response.ok) {
            if (response.status === 404) {
                document.getElementById('eventDetails').innerHTML = `<p>Event "${eventName}" not found.</p>`;
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const event = await response.json();

        const eventDetailsDiv = document.getElementById('eventDetails');
        eventDetailsDiv.innerHTML = `
            <h3>Event Details</h3>
            <p><strong>ID:</strong> ${event.id}</p>
            <p><strong>Name:</strong> ${event.name}</p>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Location:</strong> ${event.local ? `${event.local.logradouro}, ${event.local.unidade} ${event.local.complemento ? '- ' + event.local.complemento : ''} - ${event.local.bairro}, ${event.local.localidade} - ${event.local.uf} (${event.local.cep})` : 'N/A'}</p>
            <p><strong>Participants:</strong></p>
            <ul>
                ${event.participants ? event.participants.map(participant => `<li>${participant.name}</li>`).join('') : 'No participants yet.'}
            </ul>
        `;
    } catch (error) {
        console.error('Error getting event by name:', error);
        alert('Failed to get event details. Please check the console.');
    }
}

async function addEvent() {
    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventCep = document.getElementById('eventCep').value;
    const eventNumber = document.getElementById('eventNumber').value;
    const eventComplement = document.getElementById('eventComplement').value;

    const eventRequestDto = {
        name: eventName,
        date: eventDate,
        cep: eventCep,
        numero: eventNumber,
        complemento: eventComplement
    };

    try {
        const response = await fetch(`${apiUrlEvents}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventRequestDto),
        });

        if (response.ok) {
            const newEvent = await response.json();
            alert(`Event "${newEvent.name}" added successfully!`);
            listEvents();
            document.getElementById('addEventForm').reset();
        } else {
            const errorData = await response.json();
            console.error('Failed to add event:', errorData);
            alert(`Failed to add event. Please try again. Details: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        console.error('Error adding event:', error);
        alert('An error occurred while adding the event. Please check the console.');
    }
}

async function addParticipant() {
    const participantName = document.getElementById('participantName').value;
    const participantEmail = document.getElementById('participantEmail').value;
    const participantAge = document.getElementById('participantAge').value;

    const participantRequestDto = {
        name: participantName,
        email: participantEmail,
        age: parseInt(participantAge, 10),
    };

    try {
        const response = await fetch(`${apiUrlParticipant}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(participantRequestDto),
        });

        if (response.ok) {
            const newParticipant = await response.json();
            alert(`Participant "${newParticipant.name}" added successfully!`);
            fetchParticipants();
            document.getElementById('addParticipantForm').reset();
        } else {
            const errorData = await response.json();
            console.error('Failed to add participant:', errorData);
            alert(`Failed to add participant. Please try again. Details: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        console.error('Error adding participant:', error);
        alert('An error occurred while adding the participant. Please check the console.');
    }
}

async function fetchParticipants() {
    try {
        const response = await fetch(`${apiUrlParticipant}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const participants = await response.json();
            populateParticipantsTable(participants);
        } else {
            const errorData = await response.json();
            console.error('Failed to fetch participants:', errorData);
            alert(`Failed to fetch participants. Please try again. Details: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        console.error('Error fetching participants:', error);
        alert('An error occurred while fetching the participants. Please check the console.');
    }
}

function populateParticipantsTable(participants) {
    const tableBody = document.getElementById('participantsTable').querySelector('tbody');
    tableBody.innerHTML = '';

    participants.forEach((participant) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = participant.name;
        row.appendChild(nameCell);

        const emailCell = document.createElement('td');
        emailCell.textContent = participant.email;
        row.appendChild(emailCell);

        const ageCell = document.createElement('td');
        ageCell.textContent = participant.age;
        row.appendChild(ageCell);

        tableBody.appendChild(row);
    });
}
async function loadEventToEdit() {
    const eventId = document.getElementById('editEventId').value;
    if (!eventId) {
        alert('Please enter an Event ID to edit.');
        return;
    }
    try {
        const response = await fetch(`${apiUrlEvents}/id/${eventId}`);
        if (!response.ok) {
            if (response.status === 404) {
                alert(`Event with ID ${eventId} not found.`);
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const event = await response.json();
        document.getElementById('updateEventId').value = event.id;
        document.getElementById('updateEventName').value = event.name;
        document.getElementById('updateEventDate').value = event.date;
        document.getElementById('updateEventCep').value = event.local.cep;
        document.getElementById('updateEventNumber').value = event.local.unidade;
        document.getElementById('updateEventComplement').value = event.local.complemento;
        document.getElementById('editEventFormContainer').classList.remove('hidden');
        document.getElementById('editEventMessage').textContent = '';
    } catch (error) {
        console.error('Error loading event for edit:', error);
        alert('Failed to load event for edit. Please check the console.');
    }
}

async function updateEvent() {
    const eventId = document.getElementById('updateEventId').value;
    const name = document.getElementById('updateEventName').value;
    const date = document.getElementById('updateEventDate').value;
    const cep = document.getElementById('updateEventCep').value;
    const numero = document.getElementById('updateEventNumber').value;
    const complemento = document.getElementById('updateEventComplement').value;

    const updateRequestDto = {
        name: name,
        date: date,
        cep: cep,
        numero: numero,
        complemento: complemento
    };

    try {
        const response = await fetch(`${apiUrlEvents}/update/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateRequestDto),
        });

        if (response.ok) {
            const updatedEvent = await response.json();
            alert(`Event "${updatedEvent.name}" updated successfully!`);
            listEvents();
            document.getElementById('editEventFormContainer').classList.add('hidden');
            document.getElementById('editEventMessage').textContent = 'Event updated successfully!';
        } else {
            const errorData = await response.json();
            console.error('Failed to update event:', errorData);
            alert(`Failed to update event. Please try again. Details: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        console.error('Error updating event:', error);
        alert('An error occurred while updating the event. Please check the console.');
    }
}

async function addParticipantToEvent() {
    const participantId = document.getElementById('addParticipantId').value;
    const eventName = document.getElementById('addParticipantEventName').value;

    if (!participantId || !eventName) {
        alert('Please enter both Participant ID and Event Name.');
        return;
    }

    try {
        const response = await fetch(`${apiUrlEvents}/addParticipant/${participantId}/${eventName}`, {
            method: 'PUT',
        });

        if (response.ok) {
            alert(`Participant ${participantId} added to event "${eventName}" successfully!`);
            document.getElementById('addParticipantToEventMessage').textContent = `Participant ${participantId} added to event "${eventName}" successfully!`;
        } else {
            const errorData = await response.json();
            console.error('Failed to add participant to event:', errorData);
            alert(`Failed to add participant to event. Please try again. Details: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        console.error('Error adding participant to event:', error);
        alert('An error occurred while adding the participant to the event. Please check the console.');
    }
}

async function removeParticipantFromEvent() {
    const participantId = document.getElementById('removeParticipantId').value;
    const eventName = document.getElementById('removeParticipantEventName').value;

    if (!participantId || !eventName) {
        alert('Please enter both Participant ID and Event Name.');
        return;
    }

    try {
        const response = await fetch(`${apiUrlEvents}/removeParticipant/${participantId}/${eventName}`, {
            method: 'PUT',
        });

        if (response.ok) {
            alert(`Participant ${participantId} removed from event "${eventName}" successfully!`);
            document.getElementById('removeParticipantFromEventMessage').textContent = `Participant ${participantId} removed from event "${eventName}" successfully!`;
        } else {
            const errorData = await response.json();
            console.error('Failed to remove participant from event:', errorData);
            alert(`Failed to remove participant from event. Please try again. Details: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        console.error('Error removing participant from event:', error);
        alert('An error occurred while removing the participant from the event. Please check the console.');
    }
}

async function deleteEvent() {
    const eventId = document.getElementById('deleteEventId').value;
    if (!eventId) {
        alert('Please enter the Event ID to delete.');
        return;
    }

    if (confirm(`Are you sure you want to delete event with ID ${eventId}?`)) {
        try {
            const response = await fetch(`${apiUrlEvents}/deleteEvent/${eventId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert(`Event with ID ${eventId} deleted successfully!`);
                document.getElementById('deleteEventMessage').textContent = `Event with ID ${eventId} deleted successfully!`;
                listEvents();
            } else {
                const errorData = await response.json();
                console.error('Failed to delete event:', errorData);
                alert(`Failed to delete event. Please try again. Details: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('An error occurred while deleting the event. Please check the console.');
        }
    }
}