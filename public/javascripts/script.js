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
    var modalBody = $("#recodStatDetail").find(".modal-body");
    var urlParams = new URLSearchParams(window.location.search);
    fetch(
      "./detail?" +
        $.param({
          client: urlParams.get("client"),
          start_date: urlParams.get("start_date"),
          end_date: urlParams.get("end_date"),
          code: event.relatedTarget.innerText
        })
    )
      .then(res => res.text())
      .then(content => {
        modalBody.html(content);
      });
  });

  $("#recodStatDetail").on("click", ".edit", function(event) {
    var editModal = $("#edit-modal");
    var id = event.target.dataset.id;
    $.ajax({
      type: "GET",
      url: "./detail/" + id,
      success: function(msg, value) {
        console.log(msg);
        var a = $("<form action='#' method='put'></form>");
        var form = $("<div class='form-group'></div>");
        a.append(form);

        form.append("<label for='start'>Zacatek</label>");
        form.append(
          "<input class='form-control' name='start' value='" + msg.start + "'>"
        );
        form.append("<label for='end'>Konec</label>");
        form.append(
          "<input class='form-control' name='end' value='" + msg.end + "'>"
        );
        form.append("<label for='timeDiff'>Cas</label>");
        form.append(
          "<input class='form-control' name='timeDiff' value='" +
            msg.timeDiff +
            "'>"
        );

        form.append("");

        editModal.find(".modal-body").html(form);
        $("#edit-modal").on("click", "#edit-submit", function() {
          form.submit(e => {
            e.preventDefault();
            $.ajax({
              url: "./detail/" + id,
              type: "PUT",
              success: function() {
                console.log(11);
              }
            });
          });
        });
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
  $("#edit-modal").on("change", "[name='end'], [name='start']", function() {
    var startIntput = $("[name='start]");
    var endtIntput = $("[name='end]");
    var start = new Date(startIntput.value());
    var end = new Date(endtIntput.value());
    var diff = end - start;

    $("[name='timeDiff']").value(diff);
  });
});
