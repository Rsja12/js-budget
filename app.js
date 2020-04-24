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
        },
        budget: 0,
        percentage: -1
    }

    var calculateTotal = function(type) {
        var sum = 0
        data.allItems[type].forEach( function(item) {
            sum += item.value 
        })
        data.totals[type] = sum
    }

    return {

        addItem: function(type, description, value) {
            var newItem, id
            // create unique id for each newItem
            if (data.allItems[type].length > 0)  {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                id = 0
            }

            if(type === 'exp') {
                newItem = new Expense(id, description, value)
            } else {
                newItem = new Income(id, description, value)
            }

            // adds newItem to exp or inc arrays in data obj by checking type
            data.allItems[type].push(newItem)
            return newItem 
        },

        calculateBudget: function() {
            // calculate inc and exp
            calculateTotal('exp')
            calculateTotal('inc')
            // calculate budget
            data.budget = data.totals.incomes - data.totals.expenses
            // calculate percentage of income that we spent
            data.percentage = Math.round((data.totals.expenses / data.totals.incomes) * 100)
        }

    }

})()








// UI CONTROLLER ***********************************************

var uiController = (function() {

    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    }

    return {
        // returns an obj with user input 
        getInput: function() {
            return {
                 type: document.querySelector(domStrings.inputType).value,
                 description: document.querySelector(domStrings.inputDescription).value,
                 value: parseFloat(document.querySelector(domStrings.inputValue).value) 
            }
        },

        getDomStrings: function() {
            return domStrings
        },

        addListItem: function(obj, type) {
            var html, newHtml, element

            if (type === 'inc') {
                element = domStrings.incomeContainer
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = domStrings.expenseContainer
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // replace the placeholder text with data 
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)

            // identify correct container (income or expense), insert correct html
            document.querySelector(element).insertAdjacentHTML('afterbegin', newHtml)

        },

        clearFields: function() {
            var fields, fieldsArr

            // select fields that we want to clear
            fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue)
            // turns list into array
            fieldsArr = Array.prototype.slice.call(fields)
            // iterates over array to clear selected fields
            fieldsArr.forEach( function(field) {
                field.value = ''
            })
            // sets focus back on description field
            fieldsArr[0].focus()
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

    var updateBudget = function() {
        // calculate budget

        // return the budget 

        // display the budget in the ui

    }

    var ctrlAddItem = function() {
        var input, newItem
        // get the field input data
        input = uiCtrl.getInput()
        // check that description is not empty & number should be a number & greater than 0
        if (input.description !== '' && !isNaN(input.value) && input.value > 0){
            // Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            // add item to the ui
            uiCtrl.addListItem(newItem, input.type)
            // clear fields
            uiCtrl.clearFields()
            // calculate and update budget
            updateBudget()
        }

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