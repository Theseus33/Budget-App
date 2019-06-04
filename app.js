//Budget Controller
var budgetController = (function () {


})();

//UI Controller
var UIController = (function () {
  //some code
})();

//Global App Controller
//where we control what happens on each event and delegate tasks
var controller = (function (budgetCtrl, UICtrl) {

  var ctrlAddItem = function () {
    //1. Get the field input data

    //2. Add the item to the budget controller

    //3. Add the item to the UI

    //4. Calculate the budget

    //5. Display the budget on the UI
    console.log('Works!');
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  //add event listener to global event
  document.addEventListener('keypress', function (event) {

    if (event.keyCode === 13 || event.which === 13) {

    }
  });


})(budgetController, UIController);
