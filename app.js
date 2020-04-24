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

// BUDGET CONTROLLER **********************************************

var budgetController = (function() {

    

})()









// UI CONTROLLER ***********************************************

var uiController = (function() {

    return {
        getInput: function() {
            return {
                 type: document.querySelector('.add__type').value,
                 description: document.querySelector('.add__description').value,
                 value: document.querySelector('.add__value').value 
            }
        }
    }

})()









// APP CONTROLLER ************************************************

var appController = (function(budgetCtrl, uiCtrl) {

    var ctrlAddItem = function() {
         // TODO
        // Get input data
        // Add item to the budget controller
        // Add the new item to the ui 
        // calculate the budget
        // update the budget on the ui
        console.log('test')
    }

    // Checkmark btn listener 
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem)

    // on outer scope because we're listening for 'enter' keypress anywhere in the document.
    document.addEventListener('keypress', function(e) {
        if (e.keyCode === 13) ctrlAddItem()
    })
  

})(budgetController, uiController)