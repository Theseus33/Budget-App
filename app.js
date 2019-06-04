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

  document.querySelector('.add__btn').addEventListener('click', function () {
    console.log('button ws clicked')
  });
})(budgetController, UIController);
