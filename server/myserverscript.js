Meteor.publish('websites', function () {
    return Websites.find();
});

Meteor.publish('comments', function () {
    return Comments.find();
});

Meteor.methods({
    // fetch site title and description
    getSiteInfo: function (url) {
        this.unblock();
        var siteContent = HTTP.call("GET", url).content;
        var siteDOM = cheerio.load(siteContent);
        var title = siteDOM('title').text();
        var description = siteDOM('meta[name=description]').attr("content");
        return {title: title, description: description};
    },
    'insertWebsiteData': function(url, title, description){
        Websites.insert({
                title:title,
                url:url, 
    		    description:description, 
                createdOn:new Date(),
                createdBy:Meteor.user()._id,
                upvote:0,
                downvote:0,
                upvoters: [],
                downvoters: []
            });
    },
    'insertCommentsData': function(comment, site){
        Comments.insert({
                comment: comment,
                site: site,
                createdOn: new Date(),
                createdBy:Meteor.user()._id
            });
    },
    'updateWebsiteDataup1': function(website_id, upvote, upvoters){
        Websites.update(website_id,
                        {$inc: {upvote: 1}, $push: {upvoters: Meteor.user()._id} }
                       );
    },
    'updateWebsiteDataup2': function(website_id, downvote, downvoters){
        Websites.update(website_id,
                        {$inc: {downvote: -1}, $pop: {downvoters: Meteor.user()._id} }
                       );
    },
    'updateWebsiteDataup3': function(website_id, downvote, downvoters){
        Websites.update(website_id,
                        {$inc: {downvote: 1}, $push: {downvoters: Meteor.user()._id} }
                       );
    },
    'updateWebsiteDataup4': function(website_id, upvote, upvoters){
        Websites.update(website_id,
                        {$inc: {upvote: -1}, $pop: {upvoters: Meteor.user()._id} }
                       );
    }
    
});