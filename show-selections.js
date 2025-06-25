window.document.addEventListener("DOMContentLoaded", function (event) {
  store.defaults({ selected: [] });
  // console.log(store.get('selected'));
  var sHeadHtml = "<span class='sidebar-subtitle'>Selected IDs:</span>";
  var selectionsHtml = "<span class='sidebar-subtitle' id='selected-ids'></span>";
  var copyHtml = "<button type='button' class='btn btn-outline-dark btn-sm py-0 px-1 float-start' id='copy-selection' data-bs-toggle='tooltip' data-bs-placement='top' title='Click to copy'>Copy</button>"
  var clearHtml = "<button type='button' class='btn btn-outline-dark btn-sm py-0 px-1 float-end' id='clear-selection'>Clear</button>"
  
  var subtitleDiv = $(`<br>${sHeadHtml}<br>${selectionsHtml}<br><br>${copyHtml}${clearHtml}`);
  $('.sidebar-title').append(subtitleDiv);
  document.getElementById("copy-selection").addEventListener("click", async function () {
    const text = $('#selected-ids').text();
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard:", text);
      bootstrap.Tooltip.getInstance('#copy-selection').setContent({'.tooltip-inner': 'Copied!'});
      setTimeout(() => bootstrap.Tooltip.getInstance('#copy-selection').setContent({'.tooltip-inner': 'Click to Copy'}), 1000);
      // Optional: Give visual feedback
      // this.style.color = "green";
      // setTimeout(() => this.style.color = "blue", 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  });
  document.getElementById("clear-selection").addEventListener("click", async function () {
    document.getElementById('selected-ids').innerHTML = '';
    $('#mentor-table').bootstrapTable('uncheckAll');
    store.clearAll();
  });
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  $(document).on('shown.bs.tooltip', function (e) {
    console.log("Tooltip shown");
    console.log(e);
      setTimeout(function () {
        $(e.target).tooltip('hide');
        $(e.target).attr('data-original-title', 'Test');
      }, 1000);
   });
});
