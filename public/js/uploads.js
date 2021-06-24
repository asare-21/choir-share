console.log(JSON.parse(user));

function renderUnApproved(pendingUsers) {
  // accepts only the pending users
  const notifications = document.querySelector(".notifications");
  const notifications_count = document.querySelector(".count");
  var htmlData = "";
  var count = 0;
  pendingUsers.forEach((user) => {
    count += 1;
    const notificationTemplate = `<div role="alert" class="alert alert-warning"><span><strong>Pending</strong>${user.name}, with the email address ${user.email}, and phone number ${user.phone}, wants to be a member of the choir. Click this alert to aprroved the memeber's registration.</span></div>`;
    htmlData += notificationTemplate;
  });
  notifications.appendChild(htmlData);
  notifications_count.textContent = count;
}
