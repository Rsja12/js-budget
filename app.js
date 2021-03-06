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
        this.value = value,
        this.percentage = -1
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage
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

        calcPercentages: function() {
            var totalInc = data.totals.inc
            // calculate percentages for each expense in our obj
            data.allItems.exp.forEach( function(item) {
                item.calcPercentage(totalInc)
            })

        },

        getPercentages: function() {
            var allPercentages = data.allItems.exp.map( function(item) {
                return item.getPercentage()
            } )
            return allPercentages
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
        container: '.container',
        expPercentLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var formatNumber = function(num, type) {
        var splitNum, int, decimal
        // get the absolute value of num and update the variable
        num = Math.abs(num)
        // put 2 decimal nums on the number on which we call the method
        num = num.toFixed(2)

        splitNum = num.split('.')
        int = splitNum[0]
        decimal = splitNum[1]
        // format numbers to put comma in right place 
        if( int.length > 3 ) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + decimal 
    }

    var nodeListForEach = function(list, cb) {
        for ( var i = 0; i < list.length; i++ ) {
            cb(list[i], i)
        }
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = domStrings.expenseContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // replace the placeholder text with data 
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))

            // identify correct container (income or expense), insert correct html
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

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
            var type 

            obj.budget >= 0 ? type = 'inc' : type = 'exp'

            document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type)
            document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc')
            document.querySelector(domStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp')

            // validation for percentage 
            if ( obj.percentage > 0 ) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%'
            } else {
                document.querySelector(domStrings.percentageLabel).textContent = '--'
            }

        },

        displayPercentages: function(percentages) {
            // nodeList of elements with this class
            var fields = document.querySelectorAll(domStrings.expPercentLabel)
            // call custom function so that we can change the textContent of each nodeList to be the percentage at position idx 
            nodeListForEach(fields, function(item, idx) {
                if (percentages[idx] > 0) {
                    item.textContent = percentages[idx] + '%'
                } else {
                    item.textContent = '--'
                }
            })

        },

        changeType: function() {
            var fields = document.querySelectorAll(
                domStrings.inputType + ',' +
                domStrings.inputDescription + ',' +
                domStrings.inputValue
            )

            nodeListForEach(fields, function(item) {
                item.classList.toggle('red-focus')
            })

            document.querySelector(domStrings.inputBtn).classList.toggle('red')
        },

        displayDate: function() {
            var now, year, month

            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

            now = new Date()
            month = now.getMonth()
            year = now.getFullYear()
            document.querySelector(domStrings.dateLabel).textContent = monthNames[month] + ',' + ' ' + year 
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
        // handle change event for ux in input fields
        document.querySelector(dom.inputType).addEventListener('change', uiCtrl.changeType)
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
        budgetCtrl.calcPercentages()
        // read percentages from budget controller
        var percentages = budgetCtrl.getPercentages()
        // update the UI with new percentages 
        uiCtrl.displayPercentages(percentages)
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
            // calculate and update percentages
            updatePercentages()
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
            // calculate and update percentages
            updatePercentages()
        }
    }

    return {
        init: function() {
            console.log('App has started')
            uiCtrl.displayDate()
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