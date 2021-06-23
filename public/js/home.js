const burger = document.querySelector(".burger");
let status = false;
function toggleBurger(e) {
  console.log(e.target.className);
  if (!status) {
    document.querySelector("nav").classList.add("show");
    status = true;
  } else {
    document.querySelector("nav").classList.remove("show");
    status = false;
  }
  console.log("done");
}

burger.addEventListener("click", toggleBurger);
