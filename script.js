/**** Modal Box Code ****/
const modal = document.getElementById("myModal");
const editModal = document.getElementById("editModal");
const addButton = document.getElementById("add");
const span = document.getElementsByClassName("close")[0];
const span2 = document.getElementsByClassName("close")[1];

addButton.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

span2.onclick = function () {
  editModal.style.display = "none";
};
/**** Modal Box Code ****/

/*** Dark Mode Function ***/
function switchNight(){
  document.body.classList.add("dark-mode");
  document.getElementsByTagName("h1")[0].classList.add("dark-mode-h1");
}
/*** Dark Mode Function ***/

const notes = [];
const today = new Date(); // Get todays date
const RENDER_EVENT = "render-note";
const SAVED_EVENT = "saved-note";
const STORAGE_KEY = "NOTE_APPS";

function isStorageExist() {
  // Check if the browser support Web Storage function
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(notes);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const note of data) {
      notes.push(note);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addNote() {
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  const ID = +new Date();
  const date = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;

  const noteObject = createNoteObject(ID, title, content, date, false);
  notes.push(noteObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function createNoteObject(id, title, content, date, pinned) {
  return {
    id,
    title,
    content,
    date,
    pinned,
  };
}

function findNote(noteId) {
  for (const noteItem of notes) {
    if (noteItem.id === noteId) return noteItem;
  }
  return null;
}

function findNoteIndex(noteId) {
  for (const index in notes) {
    if (notes[index].id === noteId) return index;
  }
  return -1;
}

function searchingNote() {
  const searchBar = document.getElementById("noteSearch").value.toLowerCase();
  const noteList = document.querySelectorAll("section article");

  for (let listOfNotes of noteList) {
    if (listOfNotes.innerText.toLowerCase().indexOf(searchBar) > -1)
      listOfNotes.style.display = "";
    else listOfNotes.style.display = "none";
  }
}

function pinNote(noteId) {
  const noteTarget = findNote(noteId);
  if (noteTarget == null) return;

  noteTarget.pinned = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function unpinNote(noteId) {
  const noteTarget = findNote(noteId);
  if (noteTarget == null) return;

  noteTarget.pinned = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteNote(noteId) {
  const noteTarget = findNoteIndex(noteId);
  if (noteTarget === -1) return;

  notes.splice(noteTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editNote(noteId) {
  const noteTarget = findNote(noteId);
  if (noteTarget == null) return;

  const editForm = document.getElementById("editNotes");
  const editTitleField = document.getElementById("editNoteTitle");
  const editContentField = document.getElementById("editNoteContent");

  editModal.style.display = "block";
  editTitleField.value = noteTarget.title;
  editContentField.value = noteTarget.content;

  editForm.onsubmit = function (event) {
    editModal.style.display = "none";
    event.preventDefault();
    noteTarget.title = editTitleField.value;
    noteTarget.content = editContentField.value;
    noteTarget.date = `${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}`;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };
}

function createNote(noteObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = noteObject.title;

  const textContent = document.createElement("p");
  textContent.innerText = noteObject.content;

  const headerContainer = document.createElement("span");
  headerContainer.classList.add("note-header");
  headerContainer.append(textTitle);

  const textDate = document.createElement("span");
  textDate.classList.add("note-footer");
  textDate.innerText = `Last edited: ${noteObject.date}`;

  const container = document.createElement("article");
  container.setAttribute("id", `note-${noteObject.id}`);
  container.append(headerContainer, textContent, textDate);

  const containerButton = document.createElement("div");
  containerButton.classList.add("buttons");

  if (noteObject.pinned) {
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-regular fa-trash-can fa-lg"></i>`;
    const editButton = document.createElement("button");
    editButton.innerHTML = `<i class="fa-regular fa-pen-to-square fa-lg"></i>`;
    const unpinButton = document.createElement("button");
    unpinButton.innerHTML = `<i class="fa-solid fa-star fa-lg"></i>`;

    deleteButton.addEventListener("click", function () {
      deleteNote(noteObject.id);
    });

    editButton.addEventListener("click", function () {
      editNote(noteObject.id);
    });

    unpinButton.addEventListener("click", function () {
      unpinNote(noteObject.id);
    });

    containerButton.append(deleteButton, editButton, unpinButton);
    headerContainer.append(containerButton);
  } else {
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-regular fa-trash-can fa-lg"></i>`;
    const editButton = document.createElement("button");
    editButton.innerHTML = `<i class="fa-regular fa-pen-to-square fa-lg"></i>`;
    const pinButton = document.createElement("button");
    pinButton.innerHTML = `<i class="fa-regular fa-star fa-lg"></i>`;

    deleteButton.addEventListener("click", function () {
      deleteNote(noteObject.id);
    });

    editButton.addEventListener("click", function () {
      editNote(noteObject.id);
    });

    pinButton.addEventListener("click", function () {
      pinNote(noteObject.id);
    });

    containerButton.append(deleteButton, editButton, pinButton);
    headerContainer.append(containerButton);
  }

  return container;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("newNotes");
  const titleField = document.getElementById("noteTitle");
  const contentField = document.getElementById("noteContent");
  const searchNote = document.getElementById("searchNotes");
  searchNote.addEventListener("submit",function (event) {
    event.preventDefault();
    searchingNote();
  });
  submitForm.addEventListener("submit", function (event) {
    modal.style.display = "none";
    event.preventDefault();
    addNote();
    titleField.value = "Untitled Note";
    contentField.value = "";
  });
  if (isStorageExist()) loadDataFromStorage();
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

/***  Activate TAB in textfield ***/
document
  .getElementById("noteContent")
  .addEventListener("keydown", function (e) {
    if (e.key == "Tab") {
      e.preventDefault();
      let start = this.selectionStart;
      let end = this.selectionEnd;

      this.value =
        this.value.substring(0, start) + "\t" + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 1;
    }
  });

document
  .getElementById("editNoteContent")
  .addEventListener("keydown", function (e) {
    if (e.key == "Tab") {
      e.preventDefault();
      let start = this.selectionStart;
      let end = this.selectionEnd;

      this.value =
        this.value.substring(0, start) + "\t" + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 1;
    }
  });
/***  Activate TAB in textfield ***/

document.addEventListener(RENDER_EVENT, function () {
  const noteList = document.getElementById("noteList");
  const nothingText = document.getElementById("nothing-text");
  const unpinnedNoteList = document.getElementById("unpinned");
  unpinnedNoteList.innerHTML = "";
  const pinnedNoteList = document.getElementById("pinned");
  pinnedNoteList.innerHTML = "";
  pinnedNoteList.style.display = "none";
  const pinnedText = document.createElement("h3");
  pinnedText.innerText = "Pinned Note";

  for (const noteItem of notes) {
    const noteElement = createNote(noteItem);
    if (!noteItem.pinned) unpinnedNoteList.append(noteElement);
    else pinnedNoteList.append(noteElement);
    while (noteItem.pinned == true) {
      pinnedNoteList.insertAdjacentElement("afterbegin", pinnedText);
      pinnedNoteList.style.display = "";
      break;
    }
  }

  if (notes.length > 0) {
    noteList.classList.add("filled");
    noteList.classList.remove("nothing");
    nothingText.style.display = "none";
  } else {
    noteList.classList.add("nothing");
    noteList.classList.remove("filled");
    nothingText.style.display = "";
  }
});
