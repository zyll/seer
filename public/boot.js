$(document).ready(function() {
  var app = new App.Views.Seer($('#seer'));
  app.render();
  app.projects.fetch();
});
