const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

//save note to local

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes(filterText = "") {
  notesContainer.innerHTML = "";

  const search = filterText.toLowerCase();

  notes.forEach((note, index) => {
    const title = note.title.toLowerCase();
    const content = note.content.toLowerCase();

    // Letter-by-letter match
    if (title.includes(search) || content.includes(search)) {
      const noteCard = document.createElement("div");
      noteCard.className = "note-card";
      noteCard.style.backgroundColor = note.color || "#fff";

      // timestamp display
      const timestamp = note.lastEdited
        ? `Last Edited: ${formatTimestamp(note.lastEdited)}`
        : `Created: ${formatTimestamp(note.createdAt)}`;

      noteCard.innerHTML = `
        <h3 class="note-title" contenteditable="false">${note.title}</h3>
        <p class="note-content" contenteditable="false">${note.content}</p>
        <small class="timestamp">🕒 ${
          note.timestamp ? new Date(note.timestamp).toLocaleString() : ""
        }</small>
        <button class="edit-btn" onclick="editNote(${index}, this)">✏️ Edit</button>
        <button class="delete-btn" onclick="deleteNote(${index})">🗑️</button>
      `;

      notesContainer.appendChild(noteCard);
    }
  });
}

//format the timestamp
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} `;
}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  renderNotes(searchInput.value);
});

const colorPicker = document.getElementById("noteColor");

addNoteBtn.addEventListener("click", () => {
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  const color = colorPicker.value; // 👈 get selected color

  if (title || content) {
    const timestamp = new Date().toISOString(); // 👈 create timestamp
    notes.unshift({ title, content, timestamp, color });

    noteTitle.value = "";
    noteContent.value = "";
    colorPicker.value = "#ffffff";
    saveNotes();
    renderNotes();
  }
});

function deleteNote(index) {
  notes.splice(index, 1);
  saveNotes();
  renderNotes();
}

//edit feature

function editNote(index, btn) {
  const noteCard = btn.parentElement;
  const titleElem = noteCard.querySelector(".note-title");
  const contentElem = noteCard.querySelector(".note-content");

  const isEditable = titleElem.getAttribute("contenteditable") === "true";
  if (isEditable) {
    notes[index].title = titleElem.innerText.trim();
    notes[index].content = contentElem.innerText.trim();
    notes[index].lastEdited = new Date().toISOString(); // Update the last edited timestamp

    saveNotes();
    renderNotes();
  } else {
    titleElem.setAttribute("contenteditable", "true");
    contentElem.setAttribute("contenteditable", "true");
    titleElem.focus();
    btn.innerText = "💾 Save";
  }
}

renderNotes();
