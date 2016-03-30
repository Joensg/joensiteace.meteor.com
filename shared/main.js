// code that is shared between client and server, i.e. sent to both

// method definitions
Meteor.methods({
    // posting new website
    'insertWebsiteData': function(url, title, description){
        var new_website;
        if (!this.userId) {// not logged in
            return;
        }
        else {
            new_website = {
                title:title,
                url:url, 
    		    description:description, 
                createdOn:new Date(),
                createdBy:this.userId,
                upvote:0,
                downvote:0,
                upvoters: [],
                downvoters: []
            };
            var id = Websites.insert(new_website);
            console.log("insertWebsiteData method: got an id "+id);
            return id;
        }
    },
    
    // posting new comment
    'insertCommentsData': function(comment, siteid){
        var new_comment;
        console.log("addComment method running!");
        if (this.userId){// we have a user
            new_comment = {
                comment: comment,
                siteid: siteid,
                createdOn: new Date(),
                createdBy:Meteor.user()._id
            };
            var id = Comments.insert(new_comment);
            console.log("insertCommentsData method: got an id "+id);
            return id;
        }
        return;
    },
    
    // upvoting
    'upvote': function(website) {
        var website_id = website._id;
        var upvote = website.upvote;
        var upvoters = website.upvoters;
        var downvote = website.downvote;
        var downvoters = website.downvoters;
        if(Meteor.user()){
            if(upvoters==null || upvoters.indexOf(Meteor.user()._id) === -1){
                Websites.update(website_id,
                        {$inc: {upvote: 1}, $push: {upvoters: Meteor.user()._id} }
                       );
                if(downvoters!==null && !(downvoters.indexOf(Meteor.user()._id) === -1)){
                    Websites.update(website_id,
                        {$inc: {downvote: -1}, $pop: {downvoters: Meteor.user()._id} }
                       );
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
    
    // downvoting
    'downvote': function(website) {
        var website_id = website._id;
        var upvote = website.upvote;
        var upvoters = website.upvoters;
        var downvote = website.downvote;
        var downvoters = website.downvoters;
        if(Meteor.user()){
            if(downvoters==null || downvoters.indexOf(Meteor.user()._id) === -1){
                Websites.update(website_id,
                        {$inc: {downvote: 1}, $push: {downvoters: Meteor.user()._id} }
                       );
                if(upvoters!==null && !(upvoters.indexOf(Meteor.user()._id) === -1)){
                    Websites.update(website_id,
                        {$inc: {upvote: -1}, $pop: {upvoters: Meteor.user()._id} }
                       );
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



