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
            exp: 0,
            inc: 0
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

        deleteItem: function(type, id) {
            var ids, index
            // return array of ids
            ids = data.allItems[type].map( function(item) {
                return item.id
            })
            // find the index of the id we want to delete
            index = ids.indexOf(id)
            // starts removing from first arg(index). second arg is number of elements we want to remove
            if ( index !== -1 ) {
                data.allItems[type].splice(index, 1)
            }
        },

        calculateBudget: function() {
            // calculate inc and exp
            calculateTotal('exp')
            calculateTotal('inc')
            // calculate budget
            data.budget = data.totals.inc - data.totals.exp
            // calculate percentage of income that we spent
            if ( data.totals.inc > 0 ) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            return data 
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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = domStrings.expenseContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // replace the placeholder text with data 
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)

            // identify correct container (income or expense), insert correct html
            document.querySelector(element).insertAdjacentHTML('afterbegin', newHtml)

        },

        deleteListItem: function(selectorId) {
            var element = document.getElementById(selectorId)
            element.parentNode.removeChild(element)
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
        },

        displayBudget: function(obj) {
            document.querySelector(domStrings.budgetLabel).textContent = obj.budget
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc
            document.querySelector(domStrings.expenseLabel).textContent = obj.totalExp

            // validation for percentage 
            if ( obj.percentage > 0 ) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%'
            } else {
                document.querySelector(domStrings.percentageLabel).textContent = '--'
            }

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
        // Use event delegation to add listeners to delete btns on items
        document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem)
    }

    var updateBudget = function() {
        var budget
        // calculate budget
        budgetCtrl.calculateBudget()
        // return the budget 
        budget = budgetCtrl.getBudget()
        // display the budget in the ui
        uiCtrl.displayBudget(budget)
    }

    var updatePercentages = function() {
        // calculate percentages

        // read percentages from budget controller

        // update the UI with new percentages 
        
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

    var ctrlDeleteItem = function(e) {
        var itemId, splitId, type, id

        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id

        if(itemId) {
            splitId = itemId.split('-')
            type = splitId[0]
            id = parseInt(splitId[1])
            // delete the item from the data structure
            budgetCtrl.deleteItem(type, id)
            // delete the item from the UI
            uiCtrl.deleteListItem(itemId)
            // update and show new budget 
            updateBudget()
        }
    }

    return {
        init: function() {
            console.log('App has started')
            uiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            })
            setupListeners()
        }

    }

})(budgetController, uiController)


// runs the application
controller.init()