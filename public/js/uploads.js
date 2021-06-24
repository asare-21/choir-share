const userData = JSON.parse(user);
const socket = io();

socket.on("new_member", (...re) => {
  console.log(re);
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
  // console.log(document.querySelectorAll(".notes"));
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
            r.pendingUser.forEach((user) => {
              count += 1;
              const div = document.createElement("div");
              div.id = user.id;
              div.role = "alert";
              div.className = "notes alert alert-warning";
              const notificationTemplate = `<span class="notes" id="${user.id}"><strong>Pending</strong>${user.name}, with the email address ${user.email}, and phone number ${user.phone}, wants to be a member of the choir. Click this alert to aprroved the memeber's registration.</span>`;
              div.innerHTML = notificationTemplate;
              // htmlData += notificationTemplate;
              notifications.appendChild(div);
            });
            notifications_count.textContent = count;
          });
        });
    });
  });
});

window.onload = renderUnApproved(userData.pending);

function uploadSongPart() {
  /**
   * Used to upload a song part
   */
}
