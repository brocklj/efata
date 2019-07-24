function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

function printDiv(divName) {
  var mywindow = window.open("", "PRINT", "height=800,width=800");

  mywindow.document.write("<html><head><title>" + document.title + "</title>");
  mywindow.document.write("</head><body >");
  mywindow.document.write("<h1>" + document.title + "</h1>");
  mywindow.document.write(document.getElementById(divName).innerHTML);
  mywindow.document.write("</body></html>");

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
  mywindow.close();

  return true;
}

$(function() {
  $("#recodStatDetail").on("show.bs.modal", function(event) {
    const code = event.relatedTarget.innerText;
    fillStatContent(code);
  });

  $("#recodStatDetail").on("click", ".edit", function(event) {
    var editModal = $("#edit-modal");
    var id = event.target.dataset.id;
    $.ajax({
      type: "GET",
      url: "./detail/" + id,
      success: function(msg, value) {
        var a = $("<form action='#' method='put'></form>");
        var form = $("<div class='form-group'></div>");
        a.append(form);
        form.append(
          "<input class='form-control' disabled name='record-detail-name' value='" +
            msg.name +
            "'>"
        );
        form.append("<input hidden id='modal-edit-id' value='" + id + "'>");
        form.append("<label for='start'>Start</label>");
        form.append(
          "<input class='form-control' name='start' value='" + msg.start + "'>"
        );
        form.append("<label for='end'>Konec</label>");
        form.append(
          "<input class='form-control' name='end' value='" + msg.end + "'>"
        );
        form.append("<label for='timeDiff'>Celkovy Cas</label>");
        form.append(
          "<input class='form-control' disabled name='timeDiff' value='" +
            msg.timeDiff +
            "'>"
        );

        form.append("");

        editModal.find(".modal-body").html(form);
        editModal.modal("show");
      }
    });
  });

  $("#recodStatDetail").on("click", ".delete", function(event) {
    var id = event.target.dataset.id;
    $(event.target)
      .closest("tr")
      .first()
      .addClass("bg-danger text-white");
    var pin = prompt("Zadejte PIN pro smazani");
    if (pin == "1234") {
      $.ajax({
        type: "DELETE",
        url: "./detail/delete/" + id,
        success: function() {
          $(event.target)
            .closest("tr")
            .first()
            .remove();
        }
      });
    } else if (pin != null) {
      alert("Spatny PIN");
    } else {
      $(event.target)
        .closest("tr")
        .first()
        .removeClass("bg-danger text-white");
    }
  });

  // Edit record
  $("#edit-submit").on("click", function() {
    $.ajax({
      type: "PUT",
      url: "./detail/" + $("#modal-edit-id").val(),
      data: {
        start: $('[name="start"]').val(),
        end: $('[name="end"]').val(),
        timeDiff: $('[name="timeDiff"]').attr("data-diff")
      },
      success: function() {
        fillStatContent($('[name="record-detail-name"]').val());

        $("#edit-modal").modal("hide");
      }
    });
  });

  $("#edit-modal").on("hidden.bs.modal", function() {
    console.log(111);
    $("body").addClass("modal-open");
  });

  $("#edit-modal").on("keyup", "[name='end'], [name='start']", function() {
    var startIntput = $("[name='start']").first();
    var endtIntput = $("[name='end']").first();
    var start = new Date(startIntput.val());
    var end = new Date(endtIntput.val());
    var diff = end - start;

    $("[name='timeDiff']").val(formatTimeDiff(diff));
    $("[name='timeDiff']").attr("data-diff", diff);
  });
});

function formatTimeDiff(timeDiff) {
  var msec = timeDiff;
  var hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  var mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  var ss = Math.floor(msec / 1000);
  msec -= ss * 1000;
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (ss < 10) {
    ss = "0" + ss;
  }
  return hh + ":" + mm + ":" + ss;
}

function fillStatContent(name) {
  var urlParams = new URLSearchParams(window.location.search);
  var modalBody = $("#recodStatDetail").find(".modal-body");
  fetch(
    "./detail?" +
      $.param({
        client: urlParams.get("client"),
        start_date:
          urlParams.get("start_date") || $('[name="start_date"]').val(),
        end_date: urlParams.get("end_date") || $('[name="end_date"]').val(),
        code: name
      })
  )
    .then(res => res.text())
    .then(content => {
      modalBody.html(content);
    });
}
