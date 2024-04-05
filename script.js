// Custom Element untuk Menampilkan Catatan
class NotesDisplay extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
          <section class="notes-container" id="notesContainer">
            <!-- Catatan akan ditampilkan di sini -->
          </section>
        `;
  }
}

customElements.define('notes-display', NotesDisplay);

// Custom Element untuk Formulir Tambah Catatan Baru
class AddNoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
          <form id="addNoteForm">
            <input type="text" id="noteTitleInput" placeholder="Enter note title" required />
            <textarea id="noteBodyInput" placeholder="Enter note body" required></textarea>
            <button type="submit">Add Note</button>
          </form>
        `;
  }
}

customElements.define('add-note-form', AddNoteForm);

// Sample Data Dummy
const notesData = [
  // Data dummy dihapus karena diganti dengan data dari API
];

// Fungsi untuk membuat catatan baru
async function createNote(title, body) {
  const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      body,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    return data.data;
  } else {
    throw new Error(data.message);
  }
}

// Fungsi untuk mendapatkan daftar catatan
async function getNotes() {
  const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
    method: 'GET',
  });
  const data = await response.json();
  if (response.ok) {
    return data.data;
  } else {
    throw new Error(data.message);
  }
}

// Fungsi untuk menghapus catatan
async function deleteNote(noteId) {
  const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
}

// Modifikasi fungsi displayNotes() untuk menampilkan catatan dari data yang diterima dari API
async function displayNotes() {
  try {
    const notes = await getNotes();
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';
    notes.forEach((note) => {
      const noteElement = document.createElement('div');
      noteElement.classList.add('note');
      noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.body}</p>
            <button onclick="deleteNoteHandler('${note.id}')">Delete</button>
          `;
      notesContainer.appendChild(noteElement);
    });
  } catch (error) {
    console.error('Failed to display notes:', error.message);
  }
}

// Fungsi event handler untuk menangani penghapusan catatan
async function deleteNoteHandler(noteId) {
  try {
    await deleteNote(noteId);
    await displayNotes(); // Tampilkan kembali daftar catatan setelah penghapusan
  } catch (error) {
    console.error('Failed to delete note:', error.message);
  }
}

// Event listener untuk menambah catatan baru
const addNoteForm = document.getElementById('addNoteForm');
addNoteForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const noteTitleInput = document.getElementById('noteTitleInput');
  const noteBodyInput = document.getElementById('noteBodyInput');
  const title = noteTitleInput.value.trim();
  const body = noteBodyInput.value.trim();
  if (title === '' || body === '') {
    alert('Please fill in both title and body fields.');
    return;
  }
  try {
    await createNote(title, body);
    await displayNotes(); // Tampilkan kembali daftar catatan setelah penambahan
    // Reset formulir
    noteTitleInput.value = '';
    noteBodyInput.value = '';
  } catch (error) {
    console.error('Failed to add note:', error.message);
  }
});

// Tampilkan daftar catatan saat pertama kali halaman dimuat
displayNotes();
