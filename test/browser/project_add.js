describe('Project can be Added', function() {
    it('should have a ProjectFormView', function() {
        expect(App.Views.ProjectForm).toBeDefined();
        expect(App.Collections.Project).toBeDefined();
    });

    var view = new App.Views.ProjectForm({collection: new App.Collections.Project()});
    it('should contains fields', function() {
        var el = $(view.render().el);
        expect(el).toContain('input[name="name"]');
        expect(el).toContain('input[name="start"]');
        expect(el).toContain('input[name="end"]');
        expect(el).toContain('input[name="visible"]');
    });
});

describe('when submiting ProjectFormView', function() {
    beforeEach(function() {
        this.server = sinon.fakeServer.create();
    });
    afterEach(function() {
        this.server.restore();
    });
    it('should add a project on submit', function() {
        var c    = new App.Collections.Project()
          , view = new App.Views.ProjectForm({collection: c})
          , el   = $(view.render().el)
          , p    = new App.Models.Project({_id: 'T5D6H'});
        this.server.respondWith("POST", "projects",
                           [200, {"Content-Type": "application/json"}, "["+JSON.stringify(p.toJSON())+"]"]);
        el.submit();
        this.server.respond();
        expect(c.length).toEqual(1);
    });
});

describe('a ProjectFormView', function() {
    describe('when date are set to 08/13/2011 to 09/13/2011',function() {
        var view = new App.Views.ProjectForm({
            collection: new App.Collections.Project()
        });
        view.options.model.set({start: 1313143609778});
        var el = $(view.render().el);
        it('should render human date', function() {
            expect(el.find('input[name="start"]')).toHaveValue('08/12/2011')
            expect(el.find('input[name="end"]')).toHaveValue('09/13/2011')
        });
    });

});
