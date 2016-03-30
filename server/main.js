// code that is only sent to the server. 

// publish read access to collections

// all posted websites 
Meteor.publish('websites', function () {
    return Websites.find();
});

// all posted comments
Meteor.publish('comments', function () {
    return Comments.find();
});

//Meteor publishes the logged in user only to its respective client and you can run queries only against that particular user.
//In order to access the other user's specific data, you have to publish them on the server:
Meteor.publish("allUsers", function () {
  return Meteor.users.find({}, {
      // specific fields to return
      'profile.username': 1
  });
});

// method definitions
Meteor.methods({
    // auto-fetching the site title and description using the entered url
    getSiteInfo: function (url) {
        this.unblock();
        var siteContent = HTTP.call("GET", url).content;
        var siteDOM = cheerio.load(siteContent);
        var title = siteDOM('title').text();
        var description = siteDOM('meta[name=description]').attr("content");
        return {title: title, description: description};
    }
});