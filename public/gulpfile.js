var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
//var livereload = require('gulp-livereload');

gulp.task('concat', function() {
    gulp.src(
      [
        "myfunction.js",
        "modules/core/core.client.module.js",
        "modules/core/config/core.client.routes.js",
        "modules/general_journals/general_journals.client.module.js",
        "modules/general_journals/config/general_journals.client.routes.js",
        "modules/general_journals/controllers/journalizing.client.controller.js",
        "modules/general_journals/controllers/journals.client.controller.js",
        "modules/general_journals/controllers/journaldetail.client.controller.js",
        "modules/general_journals/controllers/editjournalizing.client.controller.js",
        "modules/general_journals/controllers/searchrefno.client.controller.js",
        "modules/general_ledgers/general_ledgers.client.module.js",
        "modules/general_ledgers/config/general_ledgers.client.routes.js",
        "modules/general_ledgers/controllers/ledgers.client.controller.js",
        "modules/general_ledgers/controllers/ledgerdetail.client.controller.js",
        "modules/general_ledgers/controllers/addledger.client.controller.js",
        "modules/trial_balance/trial_balance.client.module.js",
        "modules/trial_balance/config/trial_balance.client.routes.js",
        "modules/trial_balance/controllers/searchtrial.client.controller.js",
        "modules/trial_balance/controllers/trialbalance.client.controller.js",
        "modules/balance_sheet/balance_sheet.client.module.js",
        "modules/balance_sheet/config/balance_sheet.client.routes.js",
        "modules/balance_sheet/controllers/balancesheet.client.controller.js",
        "modules/balance_sheet/controllers/searchbalance.client.controller.js",
        "modules/profit_loss/profit_loss.client.module.js",
        "modules/profit_loss/config/profit_loss.client.routes.js",
        "modules/profit_loss/controllers/profitloss.client.controller.js",
        "modules/profit_loss/controllers/searchprofitloss.client.controller.js",
        "modules/dashboard/dashboard.client.module.js",
        "modules/dashboard/config/dashboard.client.routes.js",
        "modules/dashboard/controllers/dashboard.client.controller.js",
        "modules/dashboard/controllers/homepage.client.controller.js",
        "modules/users/users.client.module.js",
        "modules/users/config/users.client.routes.js",
        "modules/users/controllers/users.client.controller.js",
        "modules/management/management.client.module.js",
        "modules/management/config/management.client.routes.js",
        "modules/management/controllers/coa.client.controller.js",
        "modules/management/controllers/account.client.controller.js",
        "modules/management/controllers/broughtforward.client.controller.js",
        "service.js",
		    "application.js"
      ]
        )
        .pipe(concat('tanandara.js'))
        .pipe(gulp.dest(__dirname));
});

// gulp.task("copy",function(){
// console.log("copy index.html to ../views/index.ejs");
// gulp.src("index.html")
//   .pipe(rename('index.ejs'))
//   .pipe(gulp.dest('../views'));
// });

gulp.task("copy",function(){
console.log("copy modules/dashboard/views/homepage.html to ../views/homepage.ejs");
gulp.src("modules/dashboard/views/homepage.html")
  .pipe(rename('homepage.ejs'))
  .pipe(gulp.dest('../views'));
});

gulp.task('default', function() {
	//livereload.listen();
	gulp.watch(["modules/**/**.js","application.js","!./node_modules","!tanandara.js","myfunction.js","service.js"],["concat"]);
  //gulp.watch("./index.html",["copy"]);
  gulp.watch("./modules/dashboard/views/homepage.html",["copy"]);
  //gulp.watch(["**/**.*","!./node_modules","!tanandara.js"],function(){
	//	gulp.src(["index.html"]).pipe(livereload());
	//});
	//gulp.watch(["**/**.*","!tanandara.js"],[""]);
});
