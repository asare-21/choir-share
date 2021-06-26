const userData = user;
const socket = io("/");
const uploadButton = document.querySelector(".upload_button");
const modalContent = document.querySelector(".modal_content");
const saveButton = document.querySelector(".save");
if (userData.admin) {
  uploadButton.textContent = "New Song";
  const form = document.createElement("form");
  form.className = "new_song_upload";
  form.innerHTML = `<div class="form-group">
    <label for="exampleFormControlInput1">Song Title</label>
    <input type="text" required=true class="form-control" name="song_name" id="song_name" placeholder="Name of Song">
  </div>
  <div class="form-group">
    <label for="exampleFormControlInput1">Composer(s)</label>
    <input type="text" required=true class="form-control" name="song_composer" id="song_composer" placeholder="Song composer(s)">
  </div>
  <div class="form-group">
    <label for="exampleFormControlTextarea1">Song Lyrics</label>
    <textarea required=true class="form-control" id="song_lyrics" name="song_lyrics" rows="3" placeholder="Song Lyrics Here"></textarea>
  </div>
  <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary save" >Save changes</button>
                    </div>

  `;
  modalContent.appendChild(form);
} else {
  document.querySelector(".dropdown").remove();
  uploadButton.textContent = "Upload Song Part";
  const form = document.createElement("form");
  form.className = "part";
  form.innerHTML = `
  <div class="form-group">
    <label for="exampleFormControlSelect1">Song to Update</label>
    <select class="form-control" id="exampleFormControlSelect1">
      <option>Song 1</option>
      <option>Song 2</option>
      <option>Song 3</option>
      <option>Song 4</option>
      <option>Song 5</option>
    </select>
  </div>
  <div class="form-group">
    <label for="exampleFormControlInput1">Part Name</label>
    <input type="text" required=true class="form-control" id="part_name" placeholder="Part Name">
  </div>
  
  <div class="form-group">
    <label for="exampleFormControlFile1">Example file input</label>
    <input required=true type="file" class="form-control-file" accept=".wav,.mp3,.mp4" id="exampleFormControlFile1">
  </div>
  <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary save"  >Save changes</button>
                    </div>

`;
  modalContent.appendChild(form);
}

// funcition to update a song part
// this is used by only the members not the admin

function updateSong() {
  const formData = new FormData();
  const form = document.querySelector(".new_song_upload");
  formData.append("audio");
}
// function to create a song part
// this is used by only the admin
function createSong(e) {
  e.preventDefault(); // prevent the form defaukt action
  const form = e.target;
  console.log(e.target);
  alert("Please wait");
  fetch(`/approve/new_song/${userData.id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("song_name").value,
      composer: document.getElementById("song_composer").value,
      lyrics: document.getElementById("song_lyrics").value,
      createdBy: userData.email,
      time: Date.now(),
    }),
  }).then((response) => {
    response.json().then((songs) => {
      console.log(songs);
      if (songs.result == null) return;

      document.querySelector(".row").innerHTML = "";
      songs.result.forEach((song) => {
        const cardTemplate = ` <div class="card" id="${song._id}">
                        <div class="card-body">
                            <h4 class="card-title">${song.name}</h4>
                            <p class="text-muted card-subtitle mb-2">By:${song.composer.slice(
                              0,
                              100
                            )}...</p>
                          
                            <p class="text-muted card-subtitle mb-2">Created By: ${
                              song.createdBy
                            }</p>
                            <p class="card-text">${song.lyrics.slice(
                              0,
                              100
                            )}...</p><a class="card-link" href="#">View</a><a class="card-link" href="#"></a>
                        </div>
                    </div>`;
        const div = document.createElement("div");
        div.className = "col mb-1";
        div.innerHTML = cardTemplate;
        document.querySelector(".row").appendChild(div);
      });
      $("#exampleModal").modal("hide");
    });
  });
}

socket.on("new_member", (...re) => {
  console.log(re[0]);
  const audio = new Audio("public/assets/notification_sound.wav");
  audio.play();
  const notifications = document.querySelector(".notifications");
  const notifications_count = document.querySelector(".count");
  notifications.innerHTML = "";
  var count = 0;
  re[0].forEach((user) => {
    if (!user.approved) {
      count += 1;
      const div = document.createElement("div");
      div.role = "alert";
      div.id = user.id;
      div.className = "notes alert alert-warning";
      div.style = "cursor:pointer";
      const notificationTemplate = `<span id="${user.id}" class="notes"><strong class="text-danger">Pending Approval: </strong>${user.name}, with the email address ${user.email}, and phone number ${user.phone}, wants to be a member of the choir. Click this alert to aprrove the registration of ${user.name}.</span>`;
      div.innerHTML = notificationTemplate;
      notifications.appendChild(div);
    }
  });
  notifications_count.textContent = count;
  console.log(count);
  // audio.
});

function renderUnApproved(pendingUsers) {
  // accepts only the pending users
  const notifications = document.querySelector(".notifications");
  const notifications_count = document.querySelector(".count");
  var count = 0;
  pendingUsers.forEach((user) => {
    count += 1;
    const div = document.createElement("div");
    div.role = "alert";
    div.id = user.id;
    div.className = "notes alert alert-warning";
    div.style = "cursor:pointer";
    const notificationTemplate = `<span id="${user.id}" class="notes"><strong class="text-danger">Pending Approval: </strong>${user.name}, with the email address ${user.email}, and phone number ${user.phone}, wants to be a member of the choir. Click this alert to aprrove the registration of ${user.name}.</span>`;
    div.innerHTML = notificationTemplate;
    notifications.appendChild(div);
  });
  notifications_count.textContent = count;
}

window.addEventListener("load", () => {
  setTimeout(() => {
    userData.admin
      ? document
          .querySelector(".new_song_upload")
          .addEventListener("submit", createSong)
      : document.querySelector(".part").addEventListener("submit", updateSong);

    document.querySelectorAll(".notes").forEach((notice) => {
      notice.addEventListener("click", (e) => {
        /**
         * When the user clicks, the loading spinner should be shown
         * When the request is done, the loading spinner will be removed
         */
        const id = e.target.id;
        const notifications = document.querySelector(".notifications");
        const notifications_count = document.querySelector(".count");
        const div = document.createElement("div");
        div.className = "spinner-grow-sm";
        notifications.innerHTML = "";
        notifications.append(div);
        fetch(`/approve/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          // .then((res) => res.json())
          .then(async (response) => {
            // accepts only the pending users
            var count = 0;
            response.json().then((r) => {
              r.result.forEach((user) => {
                if (!user.approved) {
                  count += 1;
                  const div = document.createElement("div");
                  div.id = user.id;
                  div.role = "alert";
                  div.className = "notes alert alert-warning";
                  const notificationTemplate = `<span class="notes" id="${user.id}"><strong>Pending</strong>${user.name}, with the email address ${user.email}, and phone number ${user.phone}, wants to be a member of the choir. Click this alert to aprroved the memeber's registration.</span>`;
                  div.innerHTML = notificationTemplate;
                  notifications.appendChild(div);
                }
              });
              notifications_count.textContent = count;
            });
          });
      });
    });
  }, 800);
});

window.onload = renderUnApproved(userData.pending);
window.onload = renderSongs(userData.uploads);

function renderSongs(songs) {
  songs.forEach((song) => {
    const cardTemplate = ` <div class="card" id="${song._id}">
                        <div class="card-body">
                            <h4 class="card-title">${song.name}</h4>
                            <p class="text-muted card-subtitle mb-2">By:${song.composer.slice(
                              0,
                              100
                            )}...</p>
                            
                            <p class="text-muted card-subtitle mb-2">Created By: ${
                              song.createdBy
                            }</p>
                            <p class="card-text">${song.lyrics.slice(
                              0,
                              150
                            )}...</p><a class="card-link" href="#">View</a><a class="card-link" href="#"></a>
                        </div>
                    </div>`;
    const div = document.createElement("div");
    div.className = "col mb-1";
    div.innerHTML = cardTemplate;
    document.querySelector(".row").appendChild(div);
  });
}

function uploadSongPart() {
  /**
   * Used to upload a song part
   */
}
