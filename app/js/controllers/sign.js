function SignController($scope, Users, $location, $cookies){
    $scope.loginUser = {
        username:"", password:""
    }

    $scope.Login = function() {
        var user = $scope.loginUser;
        if(!user.username || user.username.length === 0 || !user.password || user.password.length === 0) {
            $scope.alert = { type: 'danger', msg: "用户名和密码不能为空" };
            return;
        }
        Users.login(user, function(data){
            user = {username:"", password:""};
            $location.path('/main');
        },function(){
            $scope.alert = { type: 'danger', msg: "用户名或密码不正确" };
        });
    };
}