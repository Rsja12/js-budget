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

    var Expense = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value 
    }

    var Income = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value 
    }
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            expenses: 0,
            incomes: 0
        }
    }

    return {
        addItem: function(type, description, value) {
            var newItem
            var id = 0 

            if(type === 'exp') {
                newItem = new Expense(id, description, value)
            } else {
                newItem = new Income(id, description, value)
            }

            // adds newItem to exp or inc arrays in data obj by checking type
            data.allItems[type].push(newItem)

        }
    }

})()








// UI CONTROLLER ***********************************************

var uiController = (function() {

    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {

        // returns an obj with user input 
        getInput: function() {
            return {
                 type: document.querySelector(domStrings.inputType).value,
                 description: document.querySelector(domStrings.inputDescription).value,
                 value: document.querySelector(domStrings.inputValue).value 
            }
        },

        getDomStrings: function() {
            return domStrings
        }

    }

})()









// APP CONTROLLER ************************************************

var controller = (function(budgetCtrl, uiCtrl) {

    var setupListeners = function() {

        // obj with dom elements
        var dom = uiCtrl.getDomStrings()

        // Checkmark btn listener 
        document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem)

        // on outer scope because we're listening for 'enter' keypress anywhere in the document.
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13) ctrlAddItem()
        })

    }

    var ctrlAddItem = function() {
        // input is an obj with user inputs
        var input = uiCtrl.getInput()
        console.log(input)
    }

    return {
        init: function() {
            console.log('App has started')
            setupListeners()
        }

    }

})(budgetController, uiController)


// runs the application
controller.init()