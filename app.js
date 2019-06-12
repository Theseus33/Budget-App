//Budget Controller
var budgetController = (function () {

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

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
    //set to -1 to say its non-existant instead of 0
    percentage: -1
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;
      // ID = last ID + 1 to create a nonrepeating unique number designation
      //Create new ID or default to 0 if no items present
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      //add data based on type to the proper income or expense array
      data.allItems[type].push(newItem);
      //the other function can have direct access to the new item created
      //return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      var ids, index;
      ids = data.allItems[type].map(function (current) {
        return current.id;

      });

      index = ids.indexOf(id);

      if (index !== -1) {
        //splice is used to remove elements at the number index and amount of items removed
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      //calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');
      //calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      //calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function () {
      console.log(data);
    }

  };


})();

//UI Controller
var UIController = (function () {
  //private variable to DRY querySelectors

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container'

  };

  return {
    getInput: function () {

      return {
        //will be either 'inc' or 'exp'
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function (obj, type) {
      var html, newHtml, element;
      //create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;

        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //1.replace placeholder with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      //insert the HTML into the DOM as last child of the list
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function () {
      var fields, fieldsArr;
      //will return a list instead of an array
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      //2.convert the list into an array to access he methods
      fieldsArr = Array.prototype.slice.call(fields);

      //pass callbackfunction to affect each element of the array

      //we have access to currrent value, index number and the whole array
      //changes the value back to empty string to clear the inputs
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
      //sets cursor back to first field to allow easier input of more items
      fieldsArr[0].focus;
    },

    displayBudget: function (obj) {

      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;


      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },
    //3.exposing private DOMstrings to public
    getDOMstrings: function () {
      return DOMstrings;
    }
  };
})();

//Global App Controller
//where we control what happens on each event and delegate tasks
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {

    //get access to DOMstings from function above
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    //add event listener to global event
    document.addEventListener('keypress', function (event) {
      //conitional if ENTER is pressed on input
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  }

  var updateBudget = function () {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();
    //5. Calculate the budget
    var budget = budgetCtrl.getBudget();
    //6. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var ctrlAddItem = function () {
    var input, newItem;

    //1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

      //2. Add the item to the budget controller which accepts 3 params type, description and value
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      //4. Clear the fields
      UICtrl.clearFields();

      //5. Calculate and update budget
      updateBudget();
    }

  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, id;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      //inc-1
      splitID = itemID.split('-');
      //will show if inc or exp
      type = splitID[0];
      //will show the id number
      id = parseInt(splitID[1]);

      //1. delete the item from the data structure
      budgetCtrl.deleteItem(type, id);
      //2. Delete the item from the UI

      //3. Update and show the new budget
    }
  };

  return {
    init: function () {
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };



})(budgetController, UIController);

controller.init();
