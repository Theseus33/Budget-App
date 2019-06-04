//Budget Controller
var budgetController = (function () {


})();

//UI Controller
var UIController = (function () {
  //private variable to DRY querySelectors

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  return {
    getInput: function () {

      return {
        //will be either 'inc' or 'exp'
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    //exposing private DOMstrings to public
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
  }



  var ctrlAddItem = function () {
    //1. Get the field input data
    var input = UICtrl.getInput();
    console.log(input);
    //2. Add the item to the budget controller

    //3. Add the item to the UI

    //4. Calculate the budget

    //5. Display the budget on the UI

  };

  return {
    init: function () {
      setupEventListeners();
    }
  };



})(budgetController, UIController);

controller.init();
