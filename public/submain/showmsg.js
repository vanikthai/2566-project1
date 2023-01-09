export function showMsg(msg, title = "vanikthai.com") {
  let myToastEl = document.getElementById("liveToast");
  let ToastText = document.getElementById("toastbody");
  let toastheader = document.getElementById("toastheader");
  ToastText.innerHTML = msg;
  toastheader.innerText = title;
  let myToast = new bootstrap.Toast(myToastEl);
  myToast.show();
  console.log(msg);
}

export function systrmnorfig() {
  if (!window.Notification) {
    console.log("Browser does not support notifications.");
  } else {
    console.log("Browser does support notifications.");
    console.log(window.Notification.permission);
    if (window.Notification.permission === "granted") {
      console.log("We have permission!");
    } else if (window.Notification.permission !== "denied") {
      window.Notification.requestPermission().then((permission) => {
        console.log(permission);
      });
    }
    // display message here
  }
}
