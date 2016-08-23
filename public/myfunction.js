function dateStringFormat(date){
  // แปลง dd/MM/yyyy เป็น yyyy-mm-dd
  return function (i){return i[3]+"-"+i[2]+"-"+i[1];}(/(\d+)\/(\d+)\/(\d+)/g.exec(date));
}
