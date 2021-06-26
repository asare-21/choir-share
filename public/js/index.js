const userData = user;
const socket = io("/");
const uploadButton = document.querySelector(".upload_button");
const modalContent = document.querySelector(".modal_content");
const saveButton = document.querySelector(".save");

document.querySelector("#modalBtn").addEventListener("click", () => {
  $("#exampleModal").modal("show");
});

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
  var options = [];
  const select = document.createElement("select");
  select.className = "form-control";
  select.id = "exampleFormControlSelect1";
  userData.uploads.forEach((upload) => {
    const option = document.createElement("option");

    option.value = upload._id;
    option.textContent = upload.name;
    options.push(option);
    // select.appendChild(option);
  });
  form.enctype = 'enctype="multipart/form-data"';
  form.innerHTML = `
  <div class="form-group">
    <label for="exampleFormControlSelect1">Song to Update</label>
<select class="form-control" id="exampleFormControlSelect">
${userData.uploads.map((d) => `<option value= "${d._id}" >${d.name}</option>`)}
</select>
  </div>
  <div class="form-group">
    <label for="exampleFormControlInput1">Part Name</label>
    <select class="form-control" id="part_name" required=true >
  <option value="Alto">Alto</option>
  <option value="Tenor">Tenor</option>
  <option value="Bass">Bass</option>
  <option value="Soprano">Soprano</option>
  <option value="Full Track">Full Track</option>
</select>
  </div>
  
  <div class="form-group">
    <label for="exampleFormControlFile1">Example file input</label>
    <input required=true type="file" class="form-control-file file" accept=".wav,.mp3,.mp4" id="exampleFormControlFile1">
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

function updateSong(e) {
  e.preventDefault();
  const formData = new FormData();
  const form = document.querySelector(".new_song_upload");
  formData.append("audio", e.target.querySelector(".file").files[0]);
  formData.append("partName", e.target.querySelector("#part_name").value);
  document.querySelector(".alert").style.display = "block";
  fetch(`/approve/new_song_part/${e.target.querySelector("select").value}`, {
    method: "POST",
    body: formData,
  }).then((response) => {
    response.json().then((data) => {
      console.log(data);
    });
    document.querySelector(".alert").style.display = "none";
    $("#exampleModal").modal("hide");
    window.location = "/library";
  });
}
// function to create a song part
// this is used by only the admin
function createSong(e) {
  e.preventDefault(); // prevent the form defaukt action
  const form = e.target;
  console.log(e.target);
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
                            <h6 class="card-title">${song.name.slice(
                              0,
                              100
                            )}...</h6>
                            <p class="text-muted card-subtitle mb-2">By:${song.composer.slice(
                              0,
                              100
                            )}...</p>
                            <p class="text-muted card-subtitle mb-2">Uploader: ${song.createdBy.slice(
                              0,
                              80
                            )}</p>
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
      window.location = "/library";
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
  // console.log(count);
  // audio.
});

function renderUnApproved(pendingUsers) {
  if (!userData.admin) {
    return;
  }
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
    const pencil = document.querySelectorAll(".bi-pencil-square");
    pencil.forEach((elem) => {
      elem.addEventListener("click", switchToTextArea);
    });

    document.querySelectorAll(".close").forEach((cbtn) => {
      cbtn.addEventListener("click", () => {
        $(".modal").modal("hide");
        // pencil.disabled = false;
      });
    });

    document.querySelectorAll(".song_view").forEach((elem) => {
      elem.addEventListener("click", (e) => {
        $("#" + e.target.href.split("#")[1]).modal("show");
        e.target.parentElement.parentElement
          .querySelectorAll("audio")
          .forEach((audio) => {
            audio.src = audio.getAttribute("data-src");
          });
        document.querySelectorAll(".close_btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            $("#" + e.target.href.split("#")[1]).modal("hide");
          });
        });
      });
    });
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
              window.location = "/library";
            });
          });
      });
    });
  }, 200);
});

window.onload = renderUnApproved(userData.pending);
window.onload = renderSongs(userData.uploads);

function renderSongs(songs) {
  songs.forEach((song) => {
    const cardTemplate = ` <div class="card" id="${song._id}">
                        <div class="card-body">
                            <h6 class="card-title">${song.name.slice(
                              0,
                              100
                            )}...</h6>
                            <p class="text-muted card-subtitle mb-2">By:${song.composer.slice(
                              0,
                              100
                            )}...</p>
                            
                            <p class="text-muted card-subtitle mb-2">Uploader: ${song.createdBy.slice(
                              0,
                              80
                            )}</p>
                            <p class="card-text">${song.lyrics.slice(
                              0,
                              150
                            )}...</p><a class="card-link song_view"  href="#collapseExample${
      song._id
    }" role="button" >View</a>
                        </div>
<!-- Modal -->
<div class="modal fade" id="collapseExample${
      song._id
    }" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-evenly">
 
      <a  href="#" >
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>
      </a>


      
        <h5 class="modal-title" id="staticBackdropLabel">  ${song.name}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
       <p class="card-title">Composed By </p> <code class="card-title">${
         song.composer
       }</code>
       <hr>
         <h6 class="card-title lyrics" style="white-space: break-spaces;">${
           song.lyrics
         }</h6>
       <hr>
       ${song.audioParts.map((audio) => {
         const template = `
         <div class="card-body audio_card">
         <h6 class="card-title">${audio.partName}</h6>
         <audio preload="metadata" controls data-src="${audio.audioLink}">
  <source data-src="${audio.audioLink}">
  Your browser does not support the audio element.
</audio>
<hr>
         </div>

         `;
         return template;
       })}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary close_btn" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div> 
                    </div>`;
    const div = document.createElement("div");
    div.className = "col mb-1";
    div.innerHTML = cardTemplate;
    document.querySelector(".row").appendChild(div);
  });
}

function switchToTextArea(e) {
  /**
   * This is used to swap the lyrics to a textarea
   */
  const parent =
    e.target.parentElement.parentElement.parentElement.parentElement;
  const lyrics = parent.querySelector(".lyrics").textContent;
  parent.querySelector(".lyrics").textContent = "";
  // const textArea = document.createElement("textarea");
  // textArea.value = lyrics;
  const textArea = `
  <textarea required=true class="form-control" id="song_lyrics" name="song_lyrics" rows="5" >${lyrics}</textarea>
    <div class="modal-footer">
        <button type="button" class="btn text-white bg-success upload_changes" >Save</button>
      </div>
`;
  parent.querySelector(".lyrics").innerHTML = textArea;

  parent.querySelector(".upload_changes").addEventListener("click", editLyrics);
  // pencil.disabled = true;
}

function editLyrics(e) {
  const id =
    e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id.split(
      "collapseExample"
    )[1];
  const lyrics =
    e.target.parentElement.parentElement.querySelector("textarea").value;
  fetch(`/approve/lyrics_update/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lyrics: lyrics }),
  }).then((response) => {
    response.json().then((data) => {
      $(".modal").modal("hide");
      window.location = "/library";
    });
  });
  /**
   * When the pencil icon is clicked,
   * the lyrics should be replaced with a textarea
   * After the corrections are made, the save button should be clicked
   * which will make a request to save the changes in the database
   */
}
