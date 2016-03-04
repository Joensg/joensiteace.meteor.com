Meteor.subscribe('websites');
Meteor.subscribe('comments');

// Routing
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

// Home
Router.route('/', function() {
    this.render('navbar', {
    to:"navbar"
  });
    this.render('home', {
        to: "main"
    });
});

// Site details
Router.route('/site/:_id', function() {
    this.render('site_detail', {
        to: "main",
        data: function() {
            return Websites.findOne({_id: this.params._id});
        }
    });
});

AccountsTemplates.configure({
    defaultLayout: 'ApplicationLayout',
});

AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/login',
    template: 'myLogin',
    layoutTemplate: 'myLayout',
    function(){
        var user = Meteor.user();
        if (user)
          Router.go('/user/' + user._id);
    }
});

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
      minLength: 4,
  },
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
  pwd
]);

/////
// template helpers 
/////

Template.registerHelper('getUser', function(user_id){
    var user = Meteor.users.findOne({_id:user_id});
    if (user){
        return user.username;
    }
    else {
        return "anon";
    }
});

// Get all comments
Template.comment_list.helpers({
	comments: function() {
		return Comments.find({site: this._id}, {sort: {createdOn: -1}});
	}
});

// Format dates
Template.registerHelper('timeAgo', function(date) {
    return moment(date).fromNow();
});

Template.registerHelper('formatdate', function(date) {
    return date.toDateString();
});

// Search
Template.navbar.helpers({
    websitesIndex: () => WebsitesIndex
});

Template.website_list.helpers({
    websitesIndex: () => WebsitesIndex
});

/////
// template events 
/////

Template.website_item.events({
    "click .js-upvote":function(event){
        var website_id = this._id;
        var upvote = this.upvote;
        var upvoters = this.upvoters;
        var downvote = this.downvote;
        var downvoters = this.downvoters;
        if(Meteor.user()){
            if(this.upvoters==null || this.upvoters.indexOf(Meteor.user()._id) === -1){
                Meteor.call('updateWebsiteDataup1', website_id, upvote, upvoters);
                if(this.downvoters!==null && !(this.downvoters.indexOf(Meteor.user()._id) === -1)){
                    Meteor.call('updateWebsiteDataup2', website_id, downvote, downvoters);
                }
            }
            else {
                alert("You have already upvoted! You may downvote to remove your upvote.");  
            }
            return true;
        }
        alert("Users can vote only if they are logged in. Kindly sign in or register to vote!");
        return false;// prevent the button from reloading the page
    },
    "click .js-downvote":function(event){
        var website_id = this._id;
        var upvote = this.upvote;
        var upvoters = this.upvoters;
        var downvote = this.downvote;
        var downvoters = this.downvoters;
        if(Meteor.user()){
            if(this.downvoters==null || this.downvoters.indexOf(Meteor.user()._id) === -1){
                Meteor.call('updateWebsiteDataup3', website_id, downvote, downvoters);
                if(this.upvoters!==null && !(this.upvoters.indexOf(Meteor.user()._id) === -1)){
                    Meteor.call('updateWebsiteDataup4', website_id, upvote, upvoters);
                }
            }
            else {
                alert("You have already downvoted! You may upvote to remove your downvote.");  
            }
            return true;
        }
        alert("Users can vote only if they are logged in. Kindly sign in or register to vote!");
        return false;// prevent the button from reloading the page
    }
});

Template.website_form.events({
    "click .js-toggle-website-form":function(event){
        $("#website_form").toggle('slow');
    },
    // autofill site information
    "blur #url": function (event) {
        var url = event.target.value;
        Meteor.call('getSiteInfo', url, function (err, result) {
            if(err) return console.log('please check if provided url is valid');
            document.getElementById('title').value = result.title;
            document.getElementById('description').value = result.description;
        });
    },
    "submit .js-save-website-form":function(event){
        
        // here is an example of how to get the url out of the form:
        event.preventDefault();
        var url = event.target.url.value;
        console.log("The url they entered is: "+url);
        var title = event.target.title.value;
        var description = event.target.description.value;
        
        //  put your website saving code in here!
        if (Meteor.user()){
            Meteor.call('insertWebsiteData', url, title, description);
        }
        else {
            alert("Users can post new websites only if they are logged in. Kindly sign in or register!");
        }
        $("#website_form").toggle('slow');
        
        return false;// stop the form submit from reloading the page
    }
});

// Site details events
Template.site_detail.events({
    "submit .js-add-comment-form": function(event) {
        var comment = event.target.comment.value;
        var site = this._id;
        if (Meteor.user()){
            Meteor.call('insertCommentsData', comment, site);
        }
        else {
            alert("Users can post new comments only if they are logged in. Kindly sign in or register!");
        }
        $(".js-add-comment-form textarea").val('');
        return false;// stop the form submit from reloading the page
    },
    "click .js-upvote":function(event){
        var website_id = this._id;
        var upvote = this.upvote;
        var upvoters = this.upvoters;
        var downvote = this.downvote;
        var downvoters = this.downvoters;
        if(Meteor.user()){
            if(this.upvoters==null || this.upvoters.indexOf(Meteor.user()._id) === -1){
                Meteor.call('updateWebsiteDataup1', website_id, upvote, upvoters);
                if(this.downvoters!==null && !(this.downvoters.indexOf(Meteor.user()._id) === -1)){
                    Meteor.call('updateWebsiteDataup2', website_id, downvote, downvoters);
                }
            }
            else {
                alert("You have already upvoted! You may downvote to remove your upvote.");  
            }
            return true;
        }
        alert("Users can vote only if they are logged in. Kindly sign in or register to vote!");
        return false;// prevent the button from reloading the page
    },
    
    "click .js-downvote":function(event){
        var website_id = this._id;
        var upvote = this.upvote;
        var upvoters = this.upvoters;
        var downvote = this.downvote;
        var downvoters = this.downvoters;
        if(Meteor.user()){
            if(this.downvoters==null || this.downvoters.indexOf(Meteor.user()._id) === -1){
                Meteor.call('updateWebsiteDataup3', website_id, downvote, downvoters);
                if(this.upvoters!==null && !(this.upvoters.indexOf(Meteor.user()._id) === -1)){
                    Meteor.call('updateWebsiteDataup4', website_id, upvote, upvoters);
                }
            }
            else {
                alert("You have already downvoted! You may upvote to remove your downvote.");  
            }
            return true;
        }
        alert("Users can vote only if they are logged in. Kindly sign in or register to vote!");
        return false;// prevent the button from reloading the page
    }
});