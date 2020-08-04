module.exports = {

//Mail Validation Code
Code: undefined,

getCode() {
    return Code
},

validationCode() {
  Code = Math.floor(Math.random() * 1000000)
}

}