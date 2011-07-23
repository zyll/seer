describe('App should be initialized', function() {
    it('should have a Collections Property', function() {
        expect(App.Collections).toBeDefined();
    });
    it('should have a Modelss Property', function() {
        expect(App.Models).toBeDefined();
    });
    it('should have a Views Property', function() {
        expect(App.Views).toBeDefined();
    });
});

describe('Backbone Models should translate _id to id', function() {
    describe('When instantiate a Models with an _id attribute', function() {
        var model = new Backbone.Model({_id: 'test_id'});
        it('should be used as the id propertie', function() {
            expect(model.id).toEqual('test_id');
        });
    });
});


describe('Application should be able to bootstrap using the Seer View (yep, no Route for now)', function() {
    it('should render', function() {
        expect(App.Views.Seer).toBeDefined();
        var app = new App.Views.Seer($('<div id="seer">'));
        expect(app.render().el).not.toBeEmpty();
    });
})
