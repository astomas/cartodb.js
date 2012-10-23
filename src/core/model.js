(function() {

  /**
   * Base Model for all CartoDB model.
   * DO NOT USE Backbone.Model directly
   * @class cdb.core.Model
   */
  var Model = cdb.core.Model = Backbone.Model.extend({
    /**
    * We are redefining fetch to be able to trigger an event when the ajax call ends, no matter if there's
    * a change in the data or not. Why don't backbone does this by default? ahh, my friend, who knows.
    * @method fetch
    * @param args {Object}
    */
    fetch: function(args) {
      var self = this;
      // var date = new Date();
      this.trigger('loadModelStarted');
      $.when(this.elder('fetch', args)).done(function(ev){
        self.trigger('loadModelCompleted', ev);
        // var dateComplete = new Date()
        // console.log('completed in '+(dateComplete - date));
      }).fail(function(ev) {
        self.trigger('loadModelFailed', ev);
      })
    },
    /**
    * Changes the attribute used as Id
    * @method setIdAttribute
    * @param attr {String}
    */
    setIdAttribute: function(attr) {
      this.idAttribute = attr;
    },
    /**
    * Listen for an event on another object and triggers on itself, with the same name or a new one
    * @method retrigger
    * @param ev {String} event who triggers the action
    * @param obj {Object} object where the event happens
    * @param obj {Object} [optional] name of the retriggered event;
    * @todo [xabel]: This method is repeated here and in the base view definition. There's should be a way to make it unique
    */
    retrigger: function(ev, obj, retrigEvent) {
      if(!retrigEvent) {
        retrigEvent = ev;
      }
      var self = this;
      obj.bind && obj.bind(ev, function() {
        self.trigger(retrigEvent);
      })
    },

    /**
     * We need to override backbone save method to be able to introduce new kind of triggers that
     * for some reason are not present in the original library. Because you know, it would be nice
     * to be able to differenciate "a model has been updated" of "a model is being saved".
     * @param  {object} opt1
     * @param  {object} opt2
     * @return {$.Deferred}
     */
    save: function(opt1, opt2) {
      var self = this;
      this.trigger('saving');
      $promise = Backbone.Model.prototype.save.call(this, opt1, opt2);
      console.log($promise);
      $.when($promise).done(function() {
        self.trigger('saved');
      }).fail(function() {
        self.trigger('errorSaving')
      })
      return $promise;
    }
  });
})();
