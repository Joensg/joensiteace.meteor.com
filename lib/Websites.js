// code sent to client and server
// which gets loaded before anything else (since it is in the lib folder)

Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection("comments");


// set up a schema controlling the allowable 
// structure of website objects
Websites.attachSchema(new SimpleSchema({
    title: {
        type: String,
        label: "Title",
        max: 200
    },
    url:{
        type: String, 
    },
    description:{
        type: String,
        label: "Comment",
        max: 1000  	
    },
    createdOn:{
        type: String
    },
    createdBy:{
        type: String 
    },
    upvote:{
        type: Number 
    },
    downvote:{
        type: Number 
    },
    upvoters:{
        type: [String] 
    },
    downvoters:{
        type: [String] 
    }
}));


// set up a schema controlling the allowable 
// structure of comment objects
Comments.attachSchema(new SimpleSchema({
    comment:{
        type: String,
        label: "Comment",
        max: 1000  	
    },
    siteid:{
        type: String
    },
    createdOn:{
        type: String
    },
    createdBy:{
        type: String
    } 
}));


// configure the EasySearch package
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