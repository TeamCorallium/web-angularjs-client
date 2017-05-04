// 'use strict';

// app.factory('SharedData', ["localStorageService", "$rootScope", function(localStorageService, $rootScope) {

//         var isLogged = false;

//         var name = 'guest';
//         var email = 'guest@gmail.com';
//         var isLogin = false;
//         var currentPage = 'home';
//         var isAdmin = false;
//         var text1 = '';
//         var text2 = '';
        
//         var exports = {
//             name: name,
//             email: email,
//             isLogin: isLogin,
//             isAdmin: isAdmin,
//             currentPage: currentPage,
//             text1: text1,
//             text2: text2,
//             setName: setName,
//             setEmail: setEmail,
//             setIsLogin: setIsLogin,
//             setCurrentPage: setCurrentPage,
//             setText1: setText1,
//             setText2: setText2,
//             setIsAdmin: setIsAdmin,
//         };
//         return exports;

        
//         ////////////////

//         function setName(name) {
//             this.name = name;
//         }
//         function setEmail(email) {
//             this.email = email;
//         }
//         function setIsLogin(login) {
//             this.isLogin = login;
//         }
//         function setIsAdmin(admin) {
//             this.isAdmin = admin;
//             this.isLogin = admin;
//         }        
//         function setCurrentPage(page) {
//             this.currentPage = page;
//         }   
//         function setText1(text) {
//             this.text1 = text;
//         }
//         function setText2(text) {
//             this.text2 = text;
//         }  
//         $rootScope.$on('event:auth-login-complete', function () {
//             console.log('FactorySharedData -> event:auth-login-complete');
//             isAdmin = true;
//         });  
//         $rootScope.$on('event:auth-login-failed', function () {
//             console.log('FactorySharedData -> event:auth-login-failed');
//             isAdmin = false;
//         });        
//     }

// }]);