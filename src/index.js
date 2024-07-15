document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    let filterOn = false; // Flag to track filter state
  
    // Fetch all pups from json-server
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(data => {
        // Display each pup name in the dog bar
        data.forEach(pup => {
          const pupSpan = document.createElement('span');
          pupSpan.textContent = pup.name;
          pupSpan.addEventListener('click', () => showPupInfo(pup));
          dogBar.appendChild(pupSpan);
        });
      })
      .catch(error => console.error('Error fetching pups:', error));
  
    // Function to display detailed pup info
    function showPupInfo(pup) {
      dogInfo.innerHTML = `
        <img src="${pup.image}" />
        <h2>${pup.name}</h2>
        <button id="good-dog-btn" data-id="${pup.id}" data-good="${pup.isGoodDog}">
          ${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}
        </button>
      `;
      
      // Toggle good/bad dog status when button is clicked
      const toggleButton = document.getElementById('good-dog-btn');
      toggleButton.addEventListener('click', () => toggleGoodDog(pup));
    }
  
    // Function to toggle good/bad dog status
    function toggleGoodDog(pup) {
      const newStatus = !pup.isGoodDog; // Toggle the status
      fetch(`http://localhost:3000/pups/${pup.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isGoodDog: newStatus })
      })
        .then(response => response.json())
        .then(updatedPup => {
          // Update button text and data attribute
          const toggleButton = document.getElementById('good-dog-btn');
          toggleButton.textContent = updatedPup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
          toggleButton.setAttribute('data-good', updatedPup.isGoodDog);
          
          // Update original pup data with new status
          pup.isGoodDog = updatedPup.isGoodDog;
        })
        .catch(error => console.error('Error toggling good dog status:', error));
    }
  
    // Function to toggle filter for good dogs
    filterButton.addEventListener('click', () => {
      filterOn = !filterOn; // Toggle filter state
      filterButton.textContent = filterOn ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
  
      // Fetch pups based on filter state
      if (filterOn) {
        fetch('http://localhost:3000/pups?isGoodDog=true')
          .then(response => response.json())
          .then(data => updateDogBar(data))
          .catch(error => console.error('Error filtering good dogs:', error));
      } else {
        fetch('http://localhost:3000/pups')
          .then(response => response.json())
          .then(data => updateDogBar(data))
          .catch(error => console.error('Error fetching all pups:', error));
      }
    });
  
    // Function to update the dog bar with filtered pups
    function updateDogBar(pups) {
      dogBar.innerHTML = ''; // Clear existing dog bar content
      pups.forEach(pup => {
        const pupSpan = document.createElement('span');
        pupSpan.textContent = pup.name;
        pupSpan.addEventListener('click', () => showPupInfo(pup));
        dogBar.appendChild(pupSpan);
      });
    }
  });
  