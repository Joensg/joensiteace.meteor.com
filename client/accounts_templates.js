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