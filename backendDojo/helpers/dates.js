module.exports = {

 dateDDMMYYYY(date) {
   const month = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]  
   const ddmmyyyy = date.getDate() + ' de ' + month[date.getMonth()] + ' de ' + date.getFullYear()
   return ddmmyyyy
 },

 timeTwoDigits(date) {
   const hours = "0" + date.getHours().toString(),
         minutes = "0" + date.getMinutes().toString(),
         twoDigits = hours.slice(-2) + ":" +  minutes.slice(-2)
   return twoDigits
 } 

}