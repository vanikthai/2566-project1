import uuid from "./uuid.js";
let users = {};
let email = document.getElementById("email");
let pass = document.getElementById("pwd");
const dayset = 10;

Object.defineProperty(users, "host", {
  get() {
    return email.value;
  },
  set(val) {
    let setval = `${uuid()}-${val}`;
    setCookie("uVdyBgiudAUtTGSI", setval, dayset);
    email.value = val;
  },
});

Object.defineProperty(users, "hostuse", {
  get() {
    return email.value;
  },
  set(val) {
    let setval = `${uuid()}-${val}`;
    setCookie("p_AN21pWR0mkr82NmG", setval, dayset);
    pass.value = val;
  },
});

email.addEventListener("change", () => {
  users.host = email.value;
});
pass.addEventListener("change", () => {
  users.hostuse = pass.value;
});

document.addEventListener("DOMContentLoaded", () => {
  getstart();
});

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(name) {
  function escape(s) {
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, "\\$1");
  }
  var match = document.cookie.match(
    RegExp("(?:^|;\\s*)" + escape(name) + "=([^;]*)")
  );
  return match ? match[1] : null;
}

function getstart() {
  let host = getCookie("uVdyBgiudAUtTGSI") || "";
  let hostuse = getCookie("p_AN21pWR0mkr82NmG") || "";
  host = host.split("-");
  hostuse = hostuse.split("-");
  users.host = host[host.length - 1];
  users.hostuse = hostuse[hostuse.length - 1];
}
