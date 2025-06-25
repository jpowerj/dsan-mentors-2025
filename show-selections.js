window.document.addEventListener("DOMContentLoaded", function (event) {
  store.defaults({ selected: [] });
  // console.log(store.get('selected'));
  var sHeadHtml = "<span class='sidebar-subtitle'>Selected IDs:</span>";
  var selectionsHtml = "<span class='sidebar-subtitle' id='selected-ids' data-bs-toggle='tooltip' data-bs-placement='top' title='Click to copy'></span>";
  var clearHtml = "<button type='button' class='btn btn-outline-dark btn-sm py-0 px-1' id='clear-selection'>Clear</button>"
  
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
  document.getElementById("clear-selection").addEventListener("click", async function () {
    document.getElementById('selected-ids').innerHTML = '';
    $('#mentor-table').bootstrapTable('uncheckAll');
    store.clearAll();
  });
});
