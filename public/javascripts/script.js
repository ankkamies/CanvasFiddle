var print = function (msg) {
  $('#console').append(document.createTextNode(msg));
  $('#console').append('<br>');
}

var editor = ace.edit("editor");

editor.setTheme("ace/theme/chrome");
editor.getSession().setMode("ace/mode/javascript");
editor.setFontSize(14);

$(document).ready(function() {
  $('#run').click(function () {
    print('Running code...');
    var frame = document.getElementById('codeFrame');
    var code = editor.getValue();

    frame.contentWindow.postMessage(code, '*');
  });

  $('#titleText').click(function () {
    var value = $('#title').text();
    $('#titleEdit').val($('#titleText').text());
    $('#titleText').hide();
    $('#titleEdit').show();
    $('#saveTitle').show();
  });

  $('#saveTitle').click(function () {
    $('#titleText').text($('#titleEdit').val());
    $('#titleText').show();
    $('#titleEdit').hide();
    $('#saveTitle').hide();
  });

  $('#update').click(function () {
    $.ajax({
      url: window.location.href, 
      type: 'PUT',
      data: {
        title: $('#titleText').text(),
        content: editor.getValue()
      }, 
      success: function (data) {
        print(data);
      }
    });
  });

  $('#save').click(function () {
    // Send a new request to the server
    $.post('fiddle/', {
      title: $('#titleText').text(),
      content: editor.getValue()
    }).done(function (data) {
      // Redirect to the url provided if successfully created
      window.location.href = data;
    }).fail(function (err) {
      print('Error: ' + err.stack);
    });
  });

  window.addEventListener('message',
    function (e) {
      // Sandboxed iframes which lack the 'allow-same-origin'
      // header have "null" rather than a valid origin. This means you still
      // have to be careful about accepting data via the messaging API you
      // create. Check that source, and validate those inputs!
      var frame = document.getElementById('codeFrame');
      if (e.origin === "null" && e.source === frame.contentWindow)
        print('Result: ' + e.data);
    });
});
