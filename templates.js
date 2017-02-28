angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./root.html','<div class="root"><div ui-view></div></div>');
$templateCache.put('./app-nav.html','<header class="header"><div class="header__fixed"><div><div class="header__brand">Contacts <a ui-sref="new" class="header__button header__button--new-contact"><i class="material-icons">add_circle_outline</i> New Contact</a></div><div class="header__logout">{{::$ctrl.user.email }} <a href="" ng-click="$ctrl.onLogout()"><span class="header__button"><i class="material-icons">power_settings_new </i>Logout</span></a></div></div></div></header>');
$templateCache.put('./app-sidebar.html','<aside class="sidebar"><div class="sidebar__logo"><a href=""><img src="/img/logo/png" alt=""></a></div><span class="sidebar__header">Tags</span><ul class="sidebar__list"><li class="sidebar__item" ng-repeat="item in ::$ctrl.contactTags"><a href="" class="sidebar__link"><i class="material-icons">{{ ::item.icon }} </i>{{ ::item.label }}</a></li></ul></aside>');
$templateCache.put('./app.html','<div class="root"><app-nav user="$ctrl.user" on-logout="$ctrl.logout"></app-nav><app-sidebar></app-sidebar><div class="app" ui-view></div></div>');
$templateCache.put('./auth-form.html','<form name="authForm" novalidate ng-submit="$ctrl.submitForm();"><label><input type="email" name="email" required="required" placeholder="Enter your email" ng-model="$ctrl.user.email"></label><label><input type="password" name="password" required="required" placeholder="Enter your password" ng-model="$ctrl.user.password "></label><div class="auth-button"><button type="submit" ng-disabled="authForm.$invalid">{{$ctrl.button}}</button></div><div><div ng-if="$ctrl.message ">{{$ctrl.message }}</div></div></form>');
$templateCache.put('./login.html','<div class="auth"><h1>Login</h1><auth-form user="$ctrl.user" message="{{$ctrl.error}}" button="Login" on-submit="$ctrl.loginUser($event);"></auth-form></div><div class="auth__info"><a ui-sref="auth.register">It\'s your lucky day today. Create account here</a></div>');
$templateCache.put('./register.html','<div class="auth"><h1>Register</h1><auth-form user="$ctrl.user" message="{{$ctrl.error}}" button="Create user" on-submit="$ctrl.createUser($event);"></auth-form></div><div class="auth__info"><a ui-sref="auth.login">Have an account? Login now</a></div>');
$templateCache.put('./contact-detail.html','<div class="contact"><form name="contactDetailForm" novalidate><div><span class="contact__required">*</span>field is required</div><div class="contact__box"><h3 class="contact__sub-title">Personal</h3><div class="contact__field"><label>Name <span class="contact__required">*</span></label><input type="text" name="name" required="required" ng-model="$ctrl.contact.name" ng-change="$ctrl.updateContact()" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Email <span class="contact__error" ng-if="contactDetailForm.email.$touched && contactDetailForm.email.$error.email">Must be a valid email</span></label><input type="email" name="email " ng-model="$ctrl.contact.email" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Job</label><input type="text" name="jobTitle" ng-model="$ctrl.contact.job" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Location</label><input type="text" name="location" ng-model="$ctrl.contact.location" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div></div><div class="contact__box contact__box--no-margin"><h3 class="contact__sub-title">Social</h3><div class="contact__field"><label>Facebook</label><input type="text" name="facebook" ng-model="$ctrl.contact.social.facebook" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Github</label><input type="text" name="github" ng-model="$ctrl.contact.social.github" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Twitter</label><input type="text" name="twitter" ng-model="$ctrl.contact.social.twitter" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div><div class="contact__field"><label>Linkedin</label><input type="text" name="linkedIn" ng-model="$ctrl.contact.social.linkedIn" ng-model-options="{\n            \'updateOn\' : \'default blur\',\n            \'debounce\' : {\n              \'default\': 250,\n              \'blur\': 0\n            }\n          }"></div></div><contact-tag tag="$ctrl.contact.tag" on-change="$ctrl.tagChange($event);"></contact-tag><div ng-if="$ctrl.isNewContact"><button ng-disabled="contactDetailForm.$invalid" ng-click="$ctrl.saveContact();">Create Contact</button></div><div ng-if="!$ctrl.isNewContact"><button class="delete" ng-click="$ctrl.deleteContact();">Delete Contact</button></div></form></div>');
$templateCache.put('./contact-edit.html','<contact-detail contact="$ctrl.contact" on-delete="$ctrl.deleteContact($event);" on-update="$ctrl.updateContact($event);"></contact-detail>');
$templateCache.put('./contact-new.html','<contact-detail contact="$ctrl.contact" on-save="$ctrl.createNewContact($event);"></contact-detail>');
$templateCache.put('./contact-tag.html','<div class="contact__field contact__field--long"><label>Tag</label><ul><li class="contact-card__pill contact-card__pill--{{ tag }}" ng-repeat="tag in ::$ctrl.tags" ng-class="{\n      \'contact__pill--active\': $ctrl.tag == tag\n    }"><a href="" ng-click="$ctrl.updateTag(tag);">{{::tag}}</a></li></ul></div>');
$templateCache.put('./contacts.html','<div class="contacts"><ul class="contacts-list"><li ng-repeat="contact in $ctrl.contacts">{{contact}}</li></ul><div class="contacts__empty" ng-if="!$ctrl.contacts.length"><i class="material-icons">face There is no one here yet</i></div></div>');}]);