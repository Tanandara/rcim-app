function dateStringFormat(date){
  // แปลง dd/MM/yyyy เป็น yyyy-mm-dd
  return function (i){return i[3]+"-"+i[2]+"-"+i[1];}(/(\d+)\/(\d+)\/(\d+)/g.exec(date));
}


function printReport() {
    $("#print").hide();
    newWin = window.open();
    newWin.document.write(
        `
        <!DOCTYPE HTML>
        <html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="keywords" content="ระบบบัญชี | โปรแกรมบัญชีแยกประเภท วิทยาลัยนวัตกรรม" />

        <link href="css/bootstrap.css" rel='stylesheet' type='text/css' />
        <link href="css/style.css" rel='stylesheet' type='text/css' />
        <link href="css/font-awesome.css" rel="stylesheet">
        <link href='//fonts.googleapis.com/css?family=Roboto+Condensed:400,300,300italic,400italic,700,700italic' rel='stylesheet' type='text/css'>
        <link href="css/custom.css" rel="stylesheet">
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <link href="lib/bootstrap-datepicker-thai/css/datepicker.css" rel="stylesheet">
        <link href="lib/autocomplete/autocomplete.css" rel="stylesheet">
        <link href="tanandara.css" rel="stylesheet">
        <style>
        @font-face {
            font-family: 'cloud';
            src:  url('fonts/Cloud-Light.otf');
          }

          li,p,h2,h3,h1,h4,div{
            font-family: 'cloud' !important;
          }

          @media print {
            *{
                font-size:10px !important;
                -webkit-print-color-adjust: exact;
            }
          }
        </style>
        </head>
        <body style="background-color:white">
        `
        + $("#printThis").html() +
        `
        </body>
        </html>
        `
        );
    newWin.document.close();
    newWin.focus();
    setTimeout(function(){newWin.print();newWin.close();},1000);
    //newWin.print();

    $("#print").show();
}


function check_permission($http,$state,toStateObj){
  $http({
    method:"post",
    url:"https://rcim-app.herokuapp.com/check_permission",
    data: toStateObj
  })
  .success(function(data){
    if(data.permission == "fail") {
      $state.go("homepage");
      //location.href = "#!/dashboard";
    }
  });
}
