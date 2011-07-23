describe('Project can be Added', function() {
    it('should have a ProjectFormView', function() {
        expect(App.Views.ProjectForm).toBeDefined();
        expect(App.Collections.Project).toBeDefined();
    });

    describe('When rendering ProjectFormView', function() {
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
        var view = new App.Views.ProjectForm({collection: new App.Collections.Project()});
        it('create should be called', function() {
            var server = sinon.fakeServer.create();
            server.respondWith("POST", "/projects",
                               [200, {"Content-Type": "application/json"}, "[]"]);
            var el = $(view.render().el);
            var spy = sinon.spy(view, 'create');
            el.submit();
            server.respond();
            
            expect(spy).toBeTruthy();
            view.create.restore();
            server.restore()
        });
    });

});
