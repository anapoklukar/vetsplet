document.onreadystatechange = function () {
  var loader = document.querySelector(".loader")

  if (document.readyState !== "complete") {
    loader.style.visibility = "visible";
    loader.style.opacity = 1;
  } else {
    setTimeout(function () {
      loader.style.visibility = "hidden";
      loader.style.opacity = 0;
    }, 4100);
  }
};