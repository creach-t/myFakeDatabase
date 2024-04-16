var fakeDatabase = [];

function displayData() {
  var container = document.getElementById('data-container');
  container.innerHTML = '';

  fakeDatabase.forEach(function(item) {
    var row = document.createElement('tr');
    row.innerHTML = '<td>' + item.id + '</td>' +
                    '<td>' + item.name + '</td>' +
                    '<td>' + item.age + '</td>' +
                    '<td>' +
                    '<button class="button" onclick="editData(' + item.id + ')">Modifier</button>' +
                    '<button class="button button--delete" onclick="deleteData(' + item.id + ')">x</button>' +
                    '</td>';
    container.appendChild(row);
  });
  console.log(fakeDatabase);
}

function addOrUpdateData(event) {
  event.preventDefault();

  var nameInput = document.getElementById('name');
  var ageInput = document.getElementById('age');
  var name = nameInput.value.trim();
  var age = parseInt(ageInput.value);

  if (name === '' || isNaN(age)) {
    alert('Veuillez remplir tous les champs correctement.');
    return;
  }

  var idToUpdate = form.dataset.editId;
  if (idToUpdate) {
    // Met à jour les données existantes
    var existingItem = fakeDatabase.find(function(item) {
      return item.id == idToUpdate;
    });

    if (existingItem) {
      existingItem.name = name;
      existingItem.age = age;
    }

    // Réinitialise l'attribut editId pour indiquer que nous ne sommes plus en mode édition
    form.removeAttribute('data-edit-id');
  } else {
    // Trouve le plus bas ID non utilisé
    var minId = 1;
    for (var i = 1; i <= fakeDatabase.length + 1; i++) {
      var idExists = fakeDatabase.some(function(item) {
        return item.id === i;
      });
      if (!idExists) {
        minId = i;
        break;
      }
    }

    // Ajoute une nouvelle donnée avec l'ID le plus bas disponible
    var newItem = {
      id: minId,
      name: name,
      age: age
    };
    fakeDatabase.push(newItem);
  }

  // Trie fakeDatabase par ID
  fakeDatabase.sort(function(a, b) {
    return a.id - b.id;
  });

  displayData();
  nameInput.value = '';
  ageInput.value = '';
  saveToCookie(fakeDatabase); // Sauvegarde les données dans le cookie
}

function deleteData(id) {
  fakeDatabase = fakeDatabase.filter(function(item) {
    return item.id !== id;
  });

  saveToCookie(fakeDatabase); // Met à jour le cookie après la suppression

  console.log(fakeDatabase); // Affiche le contenu de fakeDatabase dans la console après suppression
  displayData(); // Met à jour l'affichage après suppression
}

// Fonction pour sauvegarder les données dans un cookie
function saveToCookie(data) {
  var jsonData = JSON.stringify(data);
  
  // Définir une date d'expiration (7 jours à partir de maintenant)
  var expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);

  // Formatage de la date d'expiration au format UTC
  var expires = expirationDate.toUTCString();

  // Définir le cookie avec la date d'expiration
  document.cookie = 'myData=' + encodeURIComponent(jsonData) + '; expires=' + expires + '; path=/';
}

// Fonction pour charger les données depuis un cookie
function loadFromCookie() {
  var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)myData\s*=\s*([^;]*).*$)|^.*$/, "$1");
  if (cookieValue) {
    return JSON.parse(decodeURIComponent(cookieValue));
  } else {
    return [];
  }
}

// Charger les données depuis le cookie au chargement de la page
var fakeDatabase = loadFromCookie();

function editData(id) {
  var item = fakeDatabase.find(function(item) {
    return item.id === id;
  });

  if (!item) {
    return;
  }

  var nameInput = document.getElementById('name');
  var ageInput = document.getElementById('age');
  nameInput.value = item.name;
  ageInput.value = item.age;

  // Stocke l'ID de l'élément en cours de modification
  // pour ne pas le supprimer lors de l'ajout du nouvel élément
  form.dataset.editId = id;
}

var form = document.getElementById('data-form');
form.addEventListener('submit', addOrUpdateData);

displayData();
