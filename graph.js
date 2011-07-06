$(document).ready(function() {

var lastDay = 60;
var maxNbDev = 15;

var data = pv.range(4).map(function() {
    return pv.range(0, maxNbDev, .1).map(function(x) {
        return {x: x, y: Math.sin(x) + Math.random() * .5 + 2};
    });
});

// fill the table for each day.
var Project = function(opts) {
    var data = [];
    for(var i = 0; i <= lastDay; i++) {
        var y = ((i <= opts.start) || (i >= opts.end)) ? 0 : opts.cost;
        data.push({x: i, y: y});
    }
    return data;
}


var data = [
    Project({start: 0, end: 25, cost: 2}),
    Project({start: 20, end: 40, cost: 1}),
    Project({start: 38, end: 60, cost: 3})
]
console.log(data);

/* Sizing and scales. */
var w = 400,
    h = 200,
    x = pv.Scale.linear(0, lastDay).range(0, w),
    y = pv.Scale.linear(0, maxNbDev).range(0, h);

/* The root panel. */
var vis = new pv.Panel()
    .canvas($('#graph')[0])
    .width(w)
    .height(h)
    .bottom(20)
    .left(20)
    .right(10)
    .top(5);

/* X-axis and ticks. */
vis.add(pv.Rule)
    .data(x.ticks())
    .visible(function(d) {return d;})
    .left(x)
    .bottom(-5)
    .height(5)
    .anchor("bottom").add(pv.Label)
    .text(x.tickFormat);

/* The stack layout. */
vis.add(pv.Layout.Stack)
    .layers(data)
    .x(function(d) { return x(d.x);})
    .y(function(d) { return y(d.y);})
    .layer.add(pv.Area);

/* Y-axis and ticks. */
vis.add(pv.Rule)
    .data(y.ticks(3))
    .bottom(y)
    .strokeStyle(function(d) {return d ? "rgba(128,128,128,.2)" : "#000";})
    .anchor("left").add(pv.Label)
    .text(y.tickFormat);

vis.render();

$('form').bind('submit', function() {
    event.preventDefault();
    data.push(Project({
        start: $(this).find('input[name="start"]').val(),
        end: $(this).find('input[name="end"]').val(),
        cost: $(this).find('input[name="cost"]').val()
    }));
    vis.render();
})

});
