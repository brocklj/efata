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
    console.log(event);
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
});
