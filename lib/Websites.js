Websites = new Mongo.Collection("websites");

Comments = new Mongo.Collection("comments");

WebsitesIndex = new EasySearch.Index({
    collection: Websites,
    fields: ['url', 'title', 'description'],
    engine: new EasySearch.Minimongo({
        sort: function() {
            return {upvote: -1, downvote: 1};
        }
    }),
    defaultSearchOptions: {
        limit: 90
    }
});

Websites.allow({
	insert: function(userId, doc) {
		if (Meteor.user()) {
			return true;
		} else {
			return false;
		}
	},
	update: function(userId, doc) {
		return true;
	}
});

Comments.allow({
	insert: function(userId, doc) {
		return true;
	}
});