'use strict';
document.addEventListener('DOMContentLoaded', function () {
  const popup = document.getElementById('popup');
  const infoPopup = document.getElementById('infoPopup');
  const contactForm = document.getElementById('contactForm');
  const contactList = document.getElementById('contactList');
  const searchInput = document.getElementById('searchInput');

  let deleteIndex; 

  let contacts = [
    {
      name: 'Stephanos Khoury',
      phone: '+972 53-229-4552',
      address: 'King George St 44, Jerusalem, 9426211',
      email: 'stephanos@gmail.com',
      notes: 'Friend from work',
      img: 'https://randomuser.me/api/portraits/men/94.jpg'
    },
    {
      name: 'Jane Smith',
      phone: '+972 52-733-7552',
      address: 'Rothschild Blvd 22, Tel Aviv-Yafo, 6688218',
      email: 'jane@gmail.com',
      notes: 'Met at a conference',
      img: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    {
      name: 'Rula Yosef',
      phone: '+972 50-123-4567',
      address: 'Hanassi Blvd 109, Haifa, 3463411',
      email: 'rula@gmail.com',
      notes: 'Gym buddy',
      img: 'https://randomuser.me/api/portraits/women/71.jpg'
    },
    {
      name: 'Elias Davis',
      phone: '+972 54-987-6543',
      address: 'HaTmarim Blvd 2, Eilat, 8804201',
      email: 'elias@gmail.com',
      notes: 'Neighbor',
      img: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  ];

  function sortContacts() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
  }

  function renderContacts() {
    sortContacts();
    contactList.innerHTML = '';
    contacts
      .filter(contact => contact.name.toLowerCase().includes(searchInput.value.toLowerCase()))
      .forEach((contact, index) => {
        const contactItem = document.createElement('li');
        contactItem.className = 'contact-item';

        contactItem.innerHTML = `
                  <img src="${contact.img}" alt="${contact.name}" class="contact-image">
                  <span><strong>${contact.name}</strong></span>
                  <span>${contact.phone}</span>
                  <div class="buttons">
                      <button class="info-btn" data-index="${index}">More Info</button>
                      <button class="edit-btn" data-index="${index}">Edit</button>
                      <button class="delete-btn" data-index="${index}">Delete</button>
                  </div>
              `;

        contactItem.addEventListener('mouseover', function () {
          contactItem.classList.add('hovered');
        });

        contactItem.addEventListener('mouseout', function () {
          contactItem.classList.remove('hovered');
        });

        contactList.appendChild(contactItem);
      });

    document.querySelectorAll('.info-btn').forEach(button => {
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        const index = this.getAttribute('data-index');
        showInfo(index);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        const index = this.getAttribute('data-index');
        openPopup(index);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        deleteIndex = this.getAttribute('data-index');
        document.getElementById('confirmDeletePopup').style.display = 'flex';
      });
    });
  }

  function showInfo(index) {
    const contact = contacts[index];
    const infoContent = `
          <img src="${contact.img}" alt="${contact.name}" class="contact-image"><br>
          <strong>Name:</strong> ${contact.name}<br>
          <strong>Phone:</strong> ${contact.phone}<br>
          <strong>Address:</strong> ${contact.address}<br>
          <strong>Email:</strong> ${contact.email}<br>
          <strong>Notes:</strong> ${contact.notes}
      `;
    document.getElementById('infoContent').innerHTML = infoContent;
    infoPopup.style.display = 'flex';
  }

  function isPhoneNumberValid(phone) {
    const phoneRegex = /^\+972\s\d{2}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  function isNameDuplicate(name) {
    return contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase());
  }

  function openPopup(index = "") {
    document.getElementById('contactIndex').value = index;
    document.getElementById('popupTitle').textContent = index === "" ? "Create Contact" : "Edit Contact";
    document.getElementById('name').value = index === "" ? "" : contacts[index].name;
    document.getElementById('phone').value = index === "" ? "+972 " : contacts[index].phone;
    document.getElementById('address').value = index === "" ? "" : contacts[index].address;
    document.getElementById('email').value = index === "" ? "" : contacts[index].email;
    document.getElementById('notes').value = index === "" ? "" : contacts[index].notes;
    popup.style.display = 'flex';
  }

  function closePopup() {
    popup.style.display = 'none';
  }

  function getRandomUserImage(callback) {
    fetch('https://randomuser.me/api/')
      .then(response => response.json())
      .then(data => {
        const img = data.results[0].picture.medium;
        callback(img);
      })
      .catch(error => {
        console.error('Error fetching random user image:', error);
        callback('https://randomuser.me/api/portraits/lego/0.jpg'); 
      });
  }

  function addContact(contact) {
    contacts.push(contact);
    renderContacts();
  }

  function updateContact(index, contact) {
    contacts[index] = contact;
    renderContacts();
  }

  function deleteContact(index) {
    contacts.splice(index, 1);
    renderContacts();
  }

  function deleteContacts() {
    contacts = [];
    renderContacts();
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const index = document.getElementById('contactIndex').value;
    const name = document.getElementById('name').value;
    let phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const notes = document.getElementById('notes').value;

    if (!isPhoneNumberValid(phone)) {
      alert("Please enter a valid phone number (must be in the format +972 XX-XXX-XXXX).");
      return;
    }

    if (isNameDuplicate(name)) {
      alert("This name already exists. Please choose a different name.");
      return;
    }

    getRandomUserImage(function (img) {
      const contact = { name, phone, address, email, notes, img };

      if (index === "") {
        addContact(contact);
      } else {
        updateContact(index, contact);
      }
      closePopup();
    });
  });

  document.getElementById('openPopup').addEventListener('click', () => {
    openPopup();
  });

  document.getElementById('closePopup').addEventListener('click', closePopup);
  document.getElementById('closeInfoPopup').addEventListener('click', () => infoPopup.style.display = 'none');

  document.getElementById('confirmDelete').addEventListener('click', () => {
    deleteContact(deleteIndex);
    document.getElementById('confirmDeletePopup').style.display = 'none';
  });

  document.getElementById('cancelDelete').addEventListener('click', () => {
    document.getElementById('confirmDeletePopup').style.display = 'none';
  });

  document.getElementById('confirmDeleteAll').addEventListener('click', () => {
    deleteContacts();
    document.getElementById('confirmDeleteAllPopup').style.display = 'none';
  });

  document.getElementById('cancelDeleteAll').addEventListener('click', () => {
    document.getElementById('confirmDeleteAllPopup').style.display = 'none';
  });

  document.getElementById('deleteAllContacts').addEventListener('click', () => {
    document.getElementById('confirmDeleteAllPopup').style.display = 'flex';
  });

  searchInput.addEventListener('input', renderContacts);

  renderContacts(); 
});
