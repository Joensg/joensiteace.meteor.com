// code that is only sent to the client


/////
// Subscriptions
/////
// subscribe to read  website and comment data
Meteor.subscribe('websites');
Meteor.subscribe('comments');

//subscribe to access the other users data
Meteor.subscribe('allUsers');
// end /Subscriptions


/////
// Routing
/////
// set up the iron router
Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

// 'home' page
Router.route('/', function() {
    console.log("you hit / ");
    this.render('navbar', {to:"navbar"});
    this.render('home', {to: "main"});
});

// individual website details page
Router.route('/site/:_id', function() {
    console.log("you hit /site  "+this.params._id);
    this.render('site_detail', {
        to: "main",
        data: function() {
            return Websites.findOne({_id: this.params._id});
        }
    });
});
// end /Routing


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
		return Comments.find({siteid: this._id}, {sort: {createdOn: -1}});
	}
});

// Format dates
Template.registerHelper('timeAgo', function(createdOn) {
    var date = new Date(createdOn);
    return moment(date).fromNow();
});

Template.registerHelper('formatdate', function(createdOn) {
    var date = new Date(createdOn);
    return date.toDateString();
});

// Search
Template.navbar.helpers({
    websitesIndex: () => WebsitesIndex
});

Template.website_list.helpers({
    websitesIndex: () => WebsitesIndex
});
// end /template helpers


/////
// template events 
/////

Template.website_item.events({
    "click .js-upvote":function(event){
        website = Websites.findOne({_id:this._id});
        Meteor.call('upvote', website, function (err, result) {
            if(err) return console.log('Upvoting failed!');
        });
    },
    "click .js-downvote":function(event){
        website = Websites.findOne({_id:this._id});
        Meteor.call('downvote', website, function (err, result) {
            if(err) return console.log('Downvoting failed!');
        });
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
        event.preventDefault();
        console.log("Post new website!");
        // get the url out of the form
        var url = event.target.url.value;
        console.log("The url they entered is: " + url);
        var title = event.target.title.value;
        var description = event.target.description.value;
        
        if (Meteor.user()){ //user is logged in
            Meteor.call('insertWebsiteData', url, title, description, function (err, result) {
                if(err) return console.log('insert new Website failed!');
            });
        }
        else { //user not logged in
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
        var siteid = this._id;
        if (Meteor.user()){ //user logged in
            Meteor.call('insertCommentsData', comment, siteid);
        }
        else { //user not logged in
            alert("Users can post new comments only if they are logged in. Kindly sign in or register!");
        }
        $(".js-add-comment-form textarea").val('');
        return false;// stop the form submit from reloading the page
    },
    "click .js-upvote":function(event){
        website = Websites.findOne({_id:this._id});
        Meteor.call('upvote', website, function (err, result) {
            if(err) return console.log('Upvoting failed!');
        });
    },
    
    "click .js-downvote":function(event){
        website = Websites.findOne({_id:this._id});
        Meteor.call('downvote', website, function (err, result) {
            if(err) return console.log('Downvoting failed!');
        });
    }
});
// end /template events