// Add an event listener to the textarea to update the character count
document.getElementById("deskripcija").addEventListener("input", function () {
  // Get the current value of the textarea
  var currentText = this.value;

  // Get the maximum length allowed
  var maxLength = parseInt(this.getAttribute("maxlength"));

  // Update the character count
  var charCountElement = document.getElementById("charCount");
  charCountElement.textContent =
    currentText.length + "/" + maxLength + " characters";
});
