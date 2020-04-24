/* TODO

add event handler for submit btn
get input values
add item from input into our data struct
add item from data struct to UI 
calculate budget
update UI from budget calculation

Modules:
    UI Module
    Data Module
    Controller Module 

*/

var budgetController = (function() {

    var x = 23

    var add = function(a) {
        return x + a 
    }

    return {
        publicTest: function(b) {
            console.log(add(b))
        }
    }

})()

var uiController = (function() {

    // code

})()

var appController = (function() {


    

})()