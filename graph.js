$(document).ready(function() {

var lastDay = 60;
var maxNbDev = 15;

var App = {
    Collections: {},
    Models: {},
    Views: {}
};
  

App.Models.Project = Backbone.Model.extend({
    defaults: {
        name: 'name',
        start: 0,
        end: 0,
        cost: 0
    },

    toData: function() {
        var data = [];
        for(var i = 0; i <= lastDay; i++) {
            var y = ((i <= this.get('start')) || (i >= this.get('end'))) ? 0 : this.get('cost');
            data.push({x: i, y: y});
        }
        return data;
    }
});

App.Collections.Project = Backbone.Collection.extend({
    model: App.Models.Project
});

App.Views.ProjectList = Backbone.View.extend({
  tagName: 'ul',

  className: 'project',

  initialize: function() {
      _.bindAll(this, 'render', 'addProject');
      this.options.collection.bind('add', this.addProject);
  },  

  render: function() {
      $(this.el).empty();
      this.options.collection.each(this.addProject);

      return this;
  },

  addProject: function(project) {
      var v = new App.Views.ProjectRow({model: project});
      $(this.el).append(v.render().el);
  }

});

App.Views.ProjectRow = Backbone.View.extend({
  tagName: 'li',

  className: 'project',

  initialize: function() {
    _.bindAll(this, 'render', 'renderUpdate', 'update');
  },  

  render: function() {
    this.delegateEvents({
          'click': 'renderUpdate'
    });
    var p = this.options.model;
    $(this.el).html('<div> name : '+p.get('name')+'<div> start at : '+p.get('start')+'</div><div> end at : '+p.get('end')+'</div><div>cost : '+p.get('cost')+'</div>');
    return this;
  },

  renderUpdate: function() {
      this.delegateEvents({
          'submit form': 'update'
      });
      var p = this.options.model;
      var tpl = '<form><p>' +
        '<label for="name">name</label>' +
        '<input name="name" value="'+p.get('name')+'"/>' +
      '<p>' +
      '<p>' +
        '<label for="start">start at</label>' +
        '<input name="start" value="'+p.get('start')+'"/>' +
      '<p>' +
      '<p>' +
        '<label for="end at">end at</label>' +
        '<input name="end" value="'+p.get('end')+'"/>' +
      '</p>' +
      '<p>' +
        '<label for="end at">dev nb</label>' +
        '<input name="cost" value="'+p.get('cost')+'"/>' +
      '</p>' +
      '<p>' +
        '<input type="submit" value="save"/>' +
      '</p></form>'
      $(this.el).html(tpl);

      return this;
  },

  update: function(event) {
      event.preventDefault();
      this.options.model.set({
        name: $(this.el).find('input[name="name"]').val(),
        start: $(this.el).find('input[name="start"]').val(),
        end: $(this.el).find('input[name="end"]').val(),
        cost: $(this.el).find('input[name="cost"]').val()
      });
      this.render();
  }

});

App.Views.ProjectForm = Backbone.View.extend({
  tagName: 'form',

  className: 'project',

  events: {
      'submit': 'create'
  },

  initialize: function() {
    _.bindAll(this, 'render', 'create');
    this.options.model = new App.Models.Project();
  },  

  render: function() {
      var p = this.options.model;
      var tpl ='<p>' +
        '<label for="name">name</label>' +
        '<input name="name" value="'+p.get('name')+'"/>' +
      '</p>' +
      '<p>' +
        '<label for="start">start at</label>' +
        '<input name="start" value="'+p.get('start')+'"/>' +
      '<p>' +
      '<p>' +
        '<label for="end at">end at</label>' +
        '<input name="end" value="'+p.get('end')+'"/>' +
      '</p>' +
      '<p>' +
        '<label for="end at">dev nb</label>' +
        '<input name="cost" value="'+p.get('cost')+'"/>' +
      '</p>' +
      '<p>' +
        '<input type="submit" value="add"/>' +
      '</p>'
      $(this.el).html(tpl);

      return this;
  },

  create: function(event) {
      event.preventDefault();
      this.options.model.set({
        name: $(this.el).find('input[name="name"]').val(),
        start: $(this.el).find('input[name="start"]').val(),
        end: $(this.el).find('input[name="end"]').val(),
        cost: $(this.el).find('input[name="cost"]').val()
      });
      this.options.collection.add(this.options.model);
      this.options.model = new App.Models.Project();
      this.render();
  }

});


App.Views.Seer = Backbone.View.extend({
  tagName: 'div',

  className: 'seer',

  initialize: function(el) {
    this.el = el;
    _.bindAll(this, 'render');
    this.projects = new App.Collections.Project();
    this.graphView = new App.Views.Graph({collection: this.projects});
    this.projectList = new App.Views.ProjectList({collection: this.projects});
    this.projectForm = new App.Views.ProjectForm({collection: this.projects});
  },  

  render: function() {
      $(this.el)
        .html(this.graphView.render().el)
        .append(this.projectList.render().el)
        .append(this.projectForm.render().el);

      return this;
  }
});

App.Views.Graph = Backbone.View.extend({
  tagName: 'div',

  initialize: function() {
    _.bindAll(this, 'render', 'addProject', 'changeProject');
    this.options.collection.bind('add', this.addProject);
    this.data = [];
    /* Sizing and scales. */
    var w = 400,
        h = 200,
        x = pv.Scale.linear(0, lastDay).range(0, w),
        y = pv.Scale.linear(0, maxNbDev).range(0, h);

    /* The root panel. */
    this.vis = new pv.Panel()
        .canvas(this.el)
        .width(w)
        .height(h)
        .bottom(20)
        .left(20)
        .right(10)
        .top(5);

    /* X-axis and ticks. */
    this.vis.add(pv.Rule)
        .data(x.ticks())
        .visible(function(d) {return d;})
        .left(x)
        .bottom(-5)
        .height(5)
        .anchor("bottom").add(pv.Label)
        .text(x.tickFormat);

    /* The stack layout. */
    this.vis.add(pv.Layout.Stack)
        .layers(this.data)
        .x(function(d) { return x(d.x);})
        .y(function(d) { return y(d.y);})
        .layer.add(pv.Area);

    /* Y-axis and ticks. */
    this.vis.add(pv.Rule)
        .data(y.ticks(3))
        .bottom(y)
        .strokeStyle(function(d) {return d ? "rgba(128,128,128,.2)" : "#000";})
        .anchor("left").add(pv.Label)
        .text(y.tickFormat);  
  },

  addProject: function(project) {
      project.bind('change', this.changeProject);
      this.data.push(project.toData());
      this.render();
  },

  changeProject: function() {
      this.data.splice(0, this.data.length);
      var self = this;
      this.options.collection.each( function(project) {
          self.data.push(project.toData());
      });
      this.render();
  },

  render: function() {
      this.vis.render();
      return this;
  }
});

var app = new App.Views.Seer($('#seer'));
app.render();
});
