function detailFormatter(index, row) {
  const excludeFields = ['timetamp', 'mentor_id', 'status', 'major', 'internship_experience', 'internship_details', 'selected'];
  let html = [];
  $.each(row, function (key, value) {
    // Exclude fields already in the main view
    // console.log("Parsing key: " + key);
    const inExclude = excludeFields.includes(key);
    const hasValue = (value != ""); // && (typeof value !== 'undefined');
    const keyMap = {
      'description': "Bio:",
      'why': "What are your goals as a mentor?",
      'strengths': "What are your strengths as a mentor?",
      'hobbies': "What are some of your hobbies?",
      'internship': "Do you have prior internship/work experience?",
      'internship_details': "Prior internship details:",
      'anything_else': "Anything else you would like your mentees to know?"
    }
    if (!inExclude && hasValue) {
      // Construct the string
      const keyStr = keyMap[key];
      const keyValStr = `<p><b>${keyStr}</b> ${value}</p>`;
      html.push(keyValStr);
    }
  });
  return html.join('');
}

// Once table is set up, add sidebar
window.document.addEventListener("DOMContentLoaded", function (event) {
  // Table event handlers
  $('#mentor-table').on('check.bs.table', function (e, r, elt) {
    console.log("check");
    const checkedId = r.mentor_id;
    let selected = store.get('selected');
    // console.log(selected);
    if (!selected.includes(checkedId)) {
      selected.push(checkedId);
      store.set('selected', selected);
      // And add to sidebar list
      addListItem(checkedId);
    }
  });
  $('#mentor-table').on('uncheck.bs.table', function (e, r, elt) {
    console.log("uncheck");
    // console.log(r);
    const uncheckedId = r.mentor_id;
    console.log(`uncheckedId: ${uncheckedId}, ${typeof uncheckedId}`);
    let selected = store.get('selected');
    console.log(selected);
    console.log(selected.includes(uncheckedId));
    if (selected.includes(uncheckedId)) {
      selected = selected.filter(item => item !== uncheckedId);
      // Convert to string
      store.set('selected', selected);
      // And update the sidebar
      removeListItem(uncheckedId);
    }
  });
  function removeAllListItems() {
    $('#selected-ids').find(`li`).remove();
    return false;
  }
  $('#mentor-table').on('uncheck-all.bs.table', function (e, r, elt) {
    console.log("uncheckAll");
    store.set('selected', []);
    // And update the sidebar
    removeAllListItems();
  });
  // For sidebar
  function addListItem(idNum) {
    const newItem = $("<li>").attr('class', 'list-group-item d-flex justify-content-between align-items-center ps-1 pe-1').attr('data-rowid', idNum).append(
      $(`<span class='li-left'><i class='bi bi-list handle'></i> <a href='#' onclick='return tableScrollTo("${idNum}");'>ID ${idNum}</a></span><span class='li-right'><a href='#' onclick='return removeItemClick("${idNum}");'><i class='bi bi-x-lg'></i></a></span>`)
    );
    $('#selected-ids').append(newItem);
    return(false);
  }
  // For main table
  function updateTable() {
    const $table = $('#mentor-table');
    $table.bootstrapTable('filterBy', {
      Strengths: selectedStrengths,
      Hobbies: selectedHobbies
    }, {
      'filterAlgorithm': (row, filters) => {
        console.log("starting filter");
        // Check if any of the row's strengths are checked. If not, remove
        var rowStrengthStr = row.strengths;
        var rowStrengths = rowStrengthStr.split(', ');
        var rowContainsSomeStrengths = rowStrengths.some(strengthCheck);
        // console.log("rowContainsSomeStrengths = " + rowContainsSomeStrengths);
        var rowHobbyStr = row.hobbies;
        var rowHobbies = rowHobbyStr.split(', ');
        var rowContainsSomeHobbies = rowHobbies.some(hobbyCheck);
        console.log("rowContainsSomeHobbies = " + rowContainsSomeHobbies);
        return rowContainsSomeStrengths || rowContainsSomeHobbies;
      }
    });
    $table.bootstrapTable('expandAllRows');
    console.log("updateTable complete.");
    // console.log("selectedStrengths = " + selectedStrengths.join(","));
    // console.log("selectedHobbies = " + selectedHobbies.join(","));
  }

  function strengthCheck(element, index, array) {
    return selectedStrengths.includes(element);
  }

  function hobbyCheck(element, index, array) {
    return selectedHobbies.includes(element);
  }

  let filterState = "all";

  $('#all-props').on('click', function(event) {
    //event.preventDefault();
    console.log("all-props clicked");
    selectedStrengths = allStrengths.slice();
    selectedHobbies = allHobbies.slice();
    updateTable();
    $("[id^=strength-]").prop("checked", true).prop("disabled", true);
    $("[id^=hobby-]").prop("checked", true).prop("disabled", true);
    $("#all-props").prop("checked", true);
    $("#filter-props").prop("checked", false);
    filterState = "all";
    return true;
  });

  $('#filter-props').on('click', function(event) {
    //event.preventDefault();
    console.log("filter-props clicked");
    // If it was already checked, don't do anything
    if (filterState == "filtered") {
      console.log("already filtered, returning true");
      return true;
    }
    // Do the clearing
    selectedStrengths = [];
    selectedHobbies = [];
    // And update the table
    updateTable();
    $("[id^=strength-]").prop("checked", false).prop("disabled", false);
    $("[id^=hobby-]").prop("checked", false).prop("disabled", false);
    $("#all-props").prop("checked", false);
    $("#filter-props").prop("checked", true);
    filterState = "filtered";
    return true;
  });

  // And for individual checks
  $("[id^=strength-]").click(function() {
    console.log("strength clicked");
    var invoker = $(this);
    var isChecked = invoker.prop('checked');
    var checkboxValue = invoker.attr('value');
    // isChecked is *after* the click. So, update based on this value
    if (isChecked) {
      // They just included it
      selectedStrengths.push(checkboxValue);
    } else {
      // Remove it
      const strengthIndex = selectedStrengths.indexOf(checkboxValue);
      if (strengthIndex > -1) {
        selectedStrengths.splice(strengthIndex, 1);
      } else {
        console.log("Error: strength value '" + checkboxValue + "' not found");
      }
    }
    updateTable();
  });

  $("[id^=hobby-]").click(function() {
    var invoker = $(this);
    console.log("hobby clicked");
    console.log(invoker);
    var isChecked = invoker.prop('checked');
    var checkboxValue = invoker.attr('value');
    console.log(invoker.attr('value'));
    console.log(isChecked);
    // isChecked is *after* the click. So, update based on this value
    if (isChecked) {
      // They just included it
      selectedHobbies.push(checkboxValue);
    } else {
      // Remove it
      const hobbyIndex = selectedHobbies.indexOf(checkboxValue);
      if (hobbyIndex > -1) {
        selectedHobbies.splice(hobbyIndex, 1);
      } else {
        console.log("Error: hobby value '" + checkboxValue + "' not found");
      }
    }
    updateTable();
  });

  // Parse the .csv spreadsheet
  //"https://docs.google.com/spreadsheets/d/e/2PACX-1vQBF5uM7cMSFq_TkxVW0rxYZiU3vw16-IZBz1PfwMK1gDYUucXa2mtu7NEHivuUOn0yuUCELbcijlRR/pub?gid=0&single=true&output=csv"
  // "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL9qJuSSOARoZuW9oljx9iS6DaCaJzDT5ZH7ktIWil0uz0AMh5SkzXzsIxpMf61DH3Ya17Nt8erWqN/pub?gid=721661001&single=true&output=csv"
  // "https://docs.google.com/spreadsheets/d/e/2PACX-1vRAJ5LNGz2etwolKHAfpTbNz2IB_CzaVj2kkate728uOuLyDxneNYE1n_9xjUmxmcPOY_py-CSX7hZX/pub?gid=1040254459&single=true&output=csv"
  
  store.defaults({ selected: [] });
  // console.log(store.get('selected'));
  const sHeadHtml = "<span class='sidebar-subtitle'>Your Selections:</span>";
  const selectionsHtml = "<div class='sidebar-subtitle'><ul class='sidebar-subtitle list-group list-group-flush' id='selected-ids'></ul></div>";
  const clearHtml = "<button type='button' class='btn btn-outline-dark btn-sm py-0 px-1' id='clear-selection'>Clear</button>"
  
  const subtitleDiv = $(`<br>${sHeadHtml}<br>${selectionsHtml}<br>${clearHtml}`);

  function updateSelectedOrder() {
    console.log(`updateSelectedOrder()`);
    const oldOrder = store.get('selected');
    console.log(`old order: ${oldOrder}`);
    // Get new order from list
    let newOrder = [];
    const idList = $('#selected-ids li').map(function(){
      newOrder.push($(this).attr('data-rowid'));
    });
    console.log(`newOrder: ${newOrder}`);
    store.set('selected', newOrder);
  }

  function initSelected() {
    $('.sidebar-title').append(subtitleDiv);
    const sortable = new Sortable(
      document.getElementById('selected-ids'),
      {
        handle: '.handle',
        animation: 150,
        onUpdate: function (evt) {
          updateSelectedOrder();
        },
      }
    );
    // And add selected items in
    const curSelected = store.get('selected');
    curSelected.map(function(selectedId) {
      console.log(`Adding selectedId ${selectedId} to sidebar list`);
      addListItem(selectedId);
    });
    // And enable drag-to-sort
  }
  initSelected();

  document.getElementById("clear-selection").addEventListener("click", async function () {
    $('#mentor-table').bootstrapTable('uncheckAll');
  });
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});
