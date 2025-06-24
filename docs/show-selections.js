window.document.addEventListener("DOMContentLoaded", function (event) {
  store.defaults({ selected: [] });
  // console.log(store.get('selected'));
  var sHeadHtml = "<span class='sidebar-subtitle'>Your Selections:</span>";
  var selectionsHtml = "<span class='sidebar-subtitle' id='selected-ids' data-bs-toggle='tooltip' data-bs-placement='top' title='Click to copy'></span>";
  var clearHtml = "<button type='button' class='btn btn-outline-dark btn-sm py-0 px-1'>Clear</button>"
  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard successfully!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }
  
  var subtitleDiv = $(`<br>${sHeadHtml}<br>${selectionsHtml}<br><br>${clearHtml}`);
  $('.sidebar-title').append(subtitleDiv);
  document.getElementById("selected-ids").addEventListener("click", async function () {
    const text = this.textContent;
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard:", text);
      // Optional: Give visual feedback
      this.style.color = "green";
      setTimeout(() => this.style.color = "blue", 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  });
});
