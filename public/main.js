/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Application of the frontend.
 * 
 * Handles the rendering of the data , i.e. make
 * calls to database to fetch and save the data.
 * And display view on the website page.
 */

// Current user, if any
var user = false;

//models

var MeasurementModel = Backbone.Model.extend({
  defaults: {
    height : '',
    head_girth: '',
    head_and_neck_length: '',
    mid_neck_girth: '',
    neck_base_girth: '',
    shoulder_girth: '',
    upper_chest_girth: '',
    bust_girth: '',
    under_bust_girth: '',
    waist_girth: '',
    waist_to_hip_height: '',
    waist_to_knee_height: '',
    waist_height: '',
    side_waist_length: '',
    center_front_waist_length: '',
    center_back_waist_length: '',
    shoulder_length: '',
    shoulder_and_arm_length: '',
    upper_front_chest_width: '',
    front_chest_width: '',
    across_front_shoulder_width: '',
    across_back_shoulder_width: '',
    upper_back_width: '',
    back_width: '',
    shoulder_width: '',
    bustpoint_to_bustpoint: '',
    halter_bustpoint_to_bustpoint: '',
    neck_to_bustpoint: '',
    shoulder_drop: '',
    shoulder_slope_degree: '',
    trunk_girth: '',
    armscye_girth: '',
    elbow_girth: '',
    upper_arm_girth: '',
    wrist_girth: '',
    underarm_length: '',
    cervical_to_wrist_length: '',
    shoulder_to_elbow_length: '',
    arm_length: '',
    scye_depth: '',
    hand_girth: '',
    hand_length: '',
    hand_width: '',
    thumb_length: '',
    index_finger_length: '',
    middle_finger_length: '',
    ring_finger_length: '',
    little_finger_length: '',
    thumb_width: '',
    index_finger_width: '',
    middle_finger_width: '',
    ring_finger_width: '',
    little_finger_width: '',
    little_finger_length: '',
    thumb_girth: '',
    index_finger_girth: '',
    middle_finger_girth: '',
    ring_finger_girth: '',
    little_finger_girth: '',
    high_hip_girth: '',
    hip_girth: '',
    high_hip_height: '',
    hip_height: '',
    crotch_length: '',
    crotch_height: '',
    rise_height: '',
    thigh_girth: '',
    mid_thigh_girth: '',
    knee_girth: '',
    calf_girth: '',
    ankle_girth: '',
    cervical_to_knee_height: '',
    cervical_height: '',
    knee_height: '',
    ankle_height: '',
    foot_length: '',
    foot_width: '',
    foot_across_top: '',
    arm_type: '',
    back_shape: '',
    chest_type: '',
    shoulder_type: '',
    stomach_shape: '',
    images: [{
      rel: '',
      idref: ''
    }],
    person : {
      name: '',
      email:'',
      gender:'',
      dob:'',
      eye_color: '',
      hair_color: '',
      skin_complexion: '',
      blood_type: '',
      allergy: '',
      eye_performance: ''
    },
    user_id :''
  },
  idAttribute: 'm_id',

  /* Backbone automatically updates the model while running
    POST request. As our REST call returns value in the form
    of 'data:{key1:value1}', this function will take appropriate 
    care of updating while parsing the data. 
  */
  parse : function(resp, xhr) {
    return resp.data; 
  }
});

var UserModel = Backbone.Model.extend({
  defaults:{
    name: '',
    dob: '',
    email: ''
  },
  parse : function(resp, xhr) {
    return resp.data; 
  }
});

//collections

var Measurements = Backbone.Collection.extend({
  model:MeasurementModel,
});

//functions

function json2Array(json){
  var array = [];
  var keys = Object.keys(json);
  keys.forEach(function(key){
    array.push(json[key]);
  });
  return array;
}

function renderView(options, self, templateId, callback) {
  if (!user) {
    window.location.hash = '';
  }
  self.model = new MeasurementModel();
  self.model.url = '/api/v1/users/' + user.get('id') + '/measurements/' + options.m_id;
  self.model.fetch({
    headers:{
      'Accept':'application/json'
    },
    success: function() {
      var measurement = self.model.toJSON();
      var template = _.template($(templateId).html(), { 
        measurement: measurement 
      });
      self.$el.html(template);
      callback();
    }
  });
}

function saveMeasurementInfo(ev, self, callback) {
  var measurementDetails = $(ev.currentTarget).serializeJSON();
  self.model.save(measurementDetails, {
    success:function() {
      var userId = self.model.get('user_id');
      var measurementId = self.model.get('m_id');
      callback(userId, measurementId);
    }
  });
}

//views

var MeasurementListView = Backbone.View.extend({

  el:'#content-container',

  intialize: function() {
    this.collection.bind('change', this.render, this);
  },

  render:function(options) {
    if (!user) {
      window.location.hash = '';
      return;
    }

    var id = user.get('id');
    var self = this;
    var url = '/api/v1' + '/users/' + id + '/measurements';

    this.collection.url = url;
    this.collection.fetch({success: function(records, response) {
      if(response == 401) {
        window.location.hash = '';
      } else {
        console.log(records);
        var array = json2Array(((records).toJSON()));
        console.log(array);
        var template = _.template($('#measurement-list').html(), { measurements:array });
        self.$el.html(template);
      }
    }})
    return this;
  }
});

var MeasurementView = Backbone.View.extend({
  tagName:'tr',
  template: _.template($('#measurement-list').html()),

  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

// var NavigationView = Backbone.View.extend({
//   el:'.navigation-bar',
//   template: _.template($('#navigation').html()),

//   render: function(options){
//     this.$el.html(this.template({user_id:options.id}));
//     return this;
//   }

// });

// var UserView = Backbone.View.extend({
//   el:'#content-container',

//   template: _.template($('#user-name').html()),

//   render: function(options) {
//     var self = this;
//     $.cookie('userId', _user.get('id'));

//     this.model.url = '/api/v1/users/' + options.userId;
//     this.model.fetch({success: function(_user, response){
      
//         // if(response == 401) {
//         //   window.location.hash = '';
//         // } else {
//         //   user = _user;
//         //   ;c
//         // }
//     }});
//     self.$el.html(self.template(_user.toJSON()))
//     return self;
//   }
// });

var WelcomeView = Backbone.View.extend({

  el:'#content-container',

  template: _.template($('#welcome-message').html()),

  render:function() {
    this.$el.html(this.template({user: user.toJSON()}));
    return this;
  }
});

var LoginView = Backbone.View.extend({

  el:'#content-container',

  template: _.template($('#login-view').html()),

  render:function() {
    this.$el.html(this.template());
    return this;
  }
});

var BodyVizView = Backbone.View.extend({
  el:'#bodyviz-container',

  template: _.template($('#body-viz').html()),

  render:function() {
    this.$el.html(this.template);
    return this;
  }
});

var MeasurementHomeView = Backbone.View.extend({
  el:'#content-container',

  template: _.template($('#measurement-home').html()),

  render:function(options) {
    if (!user) {
      window.location.hash = '';
      return;
    }
    this.$el.html(this.template({
      user_id: user.get('id'), 
      m_id: options.m_id
    }));
    return this;
  }
});

var EditHeadView = Backbone.View.extend({

  el:'#content-container',

  events : {
    'submit #headInfo': 'saveHeadInfo'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveHeadInfo');
  },

  render: function(options) {
    var self = this;
    renderView(options, self, '#edit-measurement-headInfo', function() {
      return self;
    });
  },

  saveHeadInfo: function(ev) {
    var self = this;
    saveMeasurementInfo(ev, self, function(userId, measurementId) {
      router.navigate('/user/' + userId + '/edit_measurement/' 
        + measurementId + '/neckInfo', {trigger:true});      
    }); 
    return false;
  }
});

var EditNeckView = Backbone.View.extend({
  el:'#content-container',

  events : {
    'submit #neckInfo': 'saveNeckInfo'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveNeckInfo');
  },

  render: function(options) {
    var self = this;
    renderView(options, self, '#edit-measurement-neckInfo', function() {
      return self;
    });
  },

  saveNeckInfo: function(ev) {
    var self = this;
    saveMeasurementInfo(ev, self, function(userId, measurementId) {
      router.navigate('/user/' + userId + '/edit_measurement/' 
        + measurementId + '/shoulderInfo', {trigger:true});      
    });
    return false;
  }
});

var EditShoulderView = Backbone.View.extend({
  el:'#content-container',

  events : {
    'submit #shoulderInfo': 'saveShoulderInfo'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveShoulderInfo');
  },

  render: function(options) {
    var self = this;
    renderView(options, self, '#edit-measurement-shoulderInfo', function() {
      return self;
    });
  },

  saveShoulderInfo: function(ev) {
    var self = this;
    saveMeasurementInfo(ev, self, function(userId, measurementId) {
      router.navigate('/user/' + userId + '/edit_measurement/' 
        + measurementId + '/chestInfo', {trigger:true});
    });
    return false;
  }
});

var EditChestView = Backbone.View.extend({
  el:'#content-container',

  events : {
    'submit #chestInfo': 'saveChestInfo'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveChestInfo');
  },

  render: function(options) {
    var self = this;
    renderView(options, self, '#edit-measurement-chestInfo', function() {
      return self;
    });
  },

  saveChestInfo: function(ev) {
    var self = this;
    saveMeasurementInfo(ev, self, function(userId, measurementId) {
      router.navigate('/user/' + userId + '/edit_measurement/' 
        + measurementId + '/armInfo', {trigger:true});
    });
    return false;
  }
});

var EditArmView = Backbone.View.extend({
  el:'#content-container',

  events : {
    'submit #armInfo': 'saveArmInfo'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveArmInfo');
  },

  render: function(options) {
    var self = this;
    renderView(options, self, '#edit-measurement-armInfo', function() {
      return self;
    });
  },

  saveArmInfo: function(ev) {
    var self = this;
    saveMeasurementInfo(ev, self, function(userId, measurementId) {
      router.navigate('/user/' + userId + '/edit_measurement/' 
        + measurementId + '/handInfo', {trigger:true});
    });
    return false;
  }
});

var EditHandView = Backbone.View.extend({
  el:'#content-container',

  events : {
    'submit #handInfo': 'saveHandInfo'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveHandInfo');
  },

  render: function(options) {
    var self = this;
    renderView(options, self, '#edit-measurement-handInfo', function() {
      return self;
    });
  },

  saveHandInfo: function(ev) {
    var self = this;
    saveMeasurementInfo(ev, self, function(userId, measurementId) {
      router.navigate('/user/' + userId + '/edit_measurement/' 
        + measurementId + '/hipNwaistInfo', {trigger:true});
    });
    return false;
  }
});

var EditHipNwaistView = Backbone.View.extend({
  el:'#content-container',

  events : {
    'submit #hipNwaistInfo': 'saveHipNwaistInfo'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveHipNwaistInfo');
  },

  render: function(options) {
    var self = this;
    renderView(options, self, '#edit-measurement-hipNwaistInfo', function() {
      return self;
    });
  },

  saveHipNwaistInfo: function(ev) {
    var self = this;
    saveMeasurementInfo(ev, self, function(userId, measurementId) {
      router.navigate('/user/' + userId + '/edit_measurement/' 
        + measurementId + '/legInfo', {trigger:true});
    });
    return false;
  }
});

var EditLegView = Backbone.View.extend({
  el:'#content-container',

  events : {
    'submit #legInfo': 'saveLegInfo'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveLegInfo');
  },

  render: function(options) {
    var self = this;
    renderView(options, self, '#edit-measurement-legInfo', function() {
      return self;
    });
  },

  saveLegInfo: function(ev) {
    var self = this;
    saveMeasurementInfo(ev, self, function(userId, measurementId) {
      router.navigate('/user/' + userId + '/edit_measurement/' 
        + measurementId + '/footInfo', {trigger:true});
    });
    return false;
  }
});

var EditFootView = Backbone.View.extend({
  el:'#content-container',

  events : {
    'submit #footInfo': 'saveFootInfo'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveFootInfo');
  },

  render: function(options) {
    var self = this;
    renderView(options, self, '#edit-measurement-footInfo', function() {
      return self;
    });
  },

  saveFootInfo: function(ev) {
    var self = this;
    saveMeasurementInfo(ev, self, function(userId, measurementId) {
      router.navigate('/user/' + userId + '/edit_measurement/' 
        + measurementId + '/trunkInfo', {trigger:true});
    });
    return false;
  }
});

var EditTrunkView = Backbone.View.extend({
  el:'#content-container',

  events : {
    'submit #trunkInfo': 'saveTrunkInfo'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveTrunkInfo');
  },

  render: function(options) {
    var self = this;
    renderView(options, self, '#edit-measurement-trunkInfo', function() {
      return self;
    });
  },

  saveTrunkInfo: function(ev) {
    var self = this;
    saveMeasurementInfo(ev, self, function(userId, measurementId) {
      router.navigate('/user/' + userId + '/edit_measurement/' 
        + measurementId + '/heightsInfo', {trigger:true});
    });
    return false;
  }
});

var EditHeightsView = Backbone.View.extend({
  el:'#content-container',

  events : {
    'submit #heightsInfo': 'saveHeightsInfo'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveHeightsInfo');
  },

  render: function(options) {
    var self = this;
    renderView(options, self, '#edit-measurement-heightsInfo', function() {
      return self;
    });
  },

  saveHeightsInfo: function(ev) {
    var self = this;
    saveMeasurementInfo(ev, self, function(userId, measurementId) {
      router.navigate('/user/' + userId, {trigger:true});
    });
    return false;
  }
});

var CreateMeasurementView = Backbone.View.extend({
  el:'#content-container',

  events : {
    'submit #measurements': 'saveMeasurement'
  },

  intialize: function() {
    _.bindAll(this, 'render', 'saveMeasurement');
  },

  render:function(options) {
    if(!options.m_id) {
      var template = _.template($('#create-measurement').html(),
        { user_id:options.id, measurement:null });
      this.$el.html(template);
      return this;
    }
    else {
      var self = this;
      this.model = new MeasurementModel();
      this.model.url = '/api/v1' + '/users/' + options.id + '/measurements/' + options.m_id;
      this.model.fetch({
        headers:{
        'Accept':'application/json'
        },
        success: function() {
          var measurement = self.model.toJSON();
          var userId = self.model.get('user_id');
          var template = _.template($('#create-measurement').html(),
            {user_id:userId, measurement:measurement});
          self.$el.html(template);
        }
      });
    }
  },

  saveMeasurement: function(ev) {
    if(this.model==undefined) {
      var measurementDetails = $(ev.currentTarget).serializeJSON();
      var measurement = new MeasurementModel();
      measurement.url = '/api/v1' + '/users/'+ measurementDetails.user_id + '/measurements';
      measurement.save(measurementDetails, {
        type:'post',
        success:function() {
          var measurementId = measurement.get('m_id');
          router.navigate('/user/' + measurementDetails.user_id + '/edit_measurement/' 
            + measurementId, {trigger:true});
        }
      });
    }
    else {
      var self = this;
      var measurementDetails = $(ev.currentTarget).serializeJSON();
      this.model.save(measurementDetails, {
        success:function() {
          var userId = self.model.get('user_id');
          var measurementId = self.model.get('m_id');
          router.navigate('/user/' + userId + '/edit_measurement/' 
            + measurementId + '/headInfo', {trigger:true});
        }
      });
    }
    return false; //stop the default behaviour of form.
  }
});

var userModel = new UserModel();
var measurements = new Measurements();
var measurementListView = new MeasurementListView({collection:measurements});

var loginView = new LoginView();
// var userView = new UserView({model:userModel});
var welcomeView = new WelcomeView();
var bodyVizView = new BodyVizView();
var measurement = new MeasurementModel();
var measurementHomeView = new MeasurementHomeView();
var createMeasurementView = new CreateMeasurementView();
var editHeadView = new EditHeadView();
var editNeckView = new EditNeckView();
var editShoulderView = new EditShoulderView();
var editChestView = new EditChestView();
var editArmView = new EditArmView();
var editHandView = new EditHandView();
var editHipNwaistView = new EditHipNwaistView();
var editLegView = new EditLegView();
var editFootView = new EditFootView();
var editTrunkView = new EditTrunkView();
var editHeightsView = new EditHeightsView();
// var navigationView = new NavigationView();

// Just a bad hack, since session is maintained on the server and we need to the current user
// from the server somehow. Future versions should maintain the session on the client only and
// no roundtrips to the server should be required.
function checkLogin(fn) {
  if (user) {
    fn();
  } else if ($.cookie('bodyapps.userId')) {
    loadUser($.cookie('bodyapps.userId'), {
    success: function(_user) {
      user = _user;
      fn();
    },
    error: function(req, res) {
      if (res.status === 401) {
        // not tested since server doesn't check authorization yet
        window.location.hash = 'login';
      } else {
        alert('Sorry we could not log you in: ' + res.statusText);
      }
    }})
  } else {
    window.location.hash = 'login';
  }
}

function loadUser(userId, options) {
  var userModel = new UserModel();
  userModel.url = '/api/v1/users/' + userId;
  userModel.fetch(options);
}

//router
var Router = Backbone.Router.extend({

  routes: {
    '': 'homepage',
    'login': 'login',
    'login/:userId': 'loginSuccess',
    'measurements': 'measurements',
    'bodyviz': 'bodyViz',
    'create_measurement/personalInfo': 'newMeasurement',
    'edit_measurement/:m_id': 'measurementHome',
    'edit_measurement/:m_id/personalInfo': 'editPersonalInfo',
    'edit_measurement/:m_id/headInfo': 'editHead',
    'edit_measurement/:m_id/neckInfo': 'editNeck',
    'edit_measurement/:m_id/shoulderInfo': 'editShoulder',
    'edit_measurement/:m_id/chestInfo': 'editChest',
    'edit_measurement/:m_id/armInfo': 'editArm',
    'edit_measurement/:m_id/handInfo': 'editHand',
    'edit_measurement/:m_id/hipNwaistInfo': 'editHipNwaist',
    'edit_measurement/:m_id/legInfo': 'editLeg',
    'edit_measurement/:m_id/footInfo': 'editFoot',
    'edit_measurement/:m_id/trunkInfo': 'editTrunk',
    'edit_measurement/:m_id/heightsInfo': 'editHeights',
  },

  route: function(route, name, callback) {
    var router = this;
    if (!callback) callback = this[name];
    if (route.indexOf('login') === 0) {
      // skip login check for login-related routes
      return Backbone.Router.prototype.route.call(this, route, name, callback);
    } else {
      return Backbone.Router.prototype.route.call(this, route, name, function() {
        var args = arguments;
        checkLogin(function() { callback.apply(router, args); });
      });
    }
  },

  homepage: function() {
    welcomeView.render();
  },

  login: function() {
    loginView.render();
  },

  loginSuccess: function(userId) {
    $.cookie('bodyapps.userId', userId);
    window.location.hash = '';
  },

  measurements: function() {
    measurementListView.render();
  },

  bodyViz: function() {
    bodyVizView.render();
  },

  newMeasurement: function() {
    createMeasurementView.render();
  },

  measurementHome: function(m_id) {
    measurementHomeView.render({m_id: m_id});
  },

  editPersonalInfo: function(m_id) {
    createMeasurementView.render({m_id: m_id});
  },

  editHead: function(m_id) {
    editHeadView.render({m_id: m_id});
  },

  editNeck: function(m_id) {
    editNeckView.render({m_id: m_id});
  },

  editShoulder: function(m_id) {
    editShoulderView.render({m_id: m_id});
  },

  editChest: function(m_id) {
    editChestView.render({m_id: m_id});
  },

  editArm: function(m_id) {
    editArmView.render({m_id: m_id});
  },

  editHand: function(m_id) {
    editHandView.render({m_id: m_id});
  },

  editHipNwaist: function(m_id) {
    editHipNwaistView.render({m_id: m_id});
  },

  editLeg: function(m_id) {
    editLegView.render({m_id: m_id});
  },

  editFoot: function(m_id) {
    editFootView.render({m_id: m_id});
  },

  editTrunk: function(m_id) {
    editTrunkView.render({m_id: m_id});
  },

  editHeights: function(m_id) {
    editHeightsView.render({m_id: m_id});
  }
});

var router = new Router();
Backbone.history.start();
