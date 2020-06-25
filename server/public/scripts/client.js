$(document).ready(onReady);

function onReady() {
    
    getData();

    $('#btns').children().children().on('click', btnCheck);//checks to see if btn was pressed

    $('#clear').on('click', clear); //runs function clear on click

    $('#histClear').on('click', clearHistory); //runs function clearHistory on click
    $('#history').on('click' , '.rerun' , rerun); //runs function rerun on click 
}//end onReady

let inputNumber = ""; //stores the number currently being input

let decEntered = 0; //stores whether decimal is added
const decAllowed = 1; //defines limit for decimals allowed

let actionEntered = 0; //stores whether action has been chosen
let action = ''; //defines our action
let actionLastPressed = 0;

let subPressed = 0; //stores whether submit button was last pressed
const subAllowed = 1; //defines limit for submit button pressing

let historyAmount = 0; //stores current number of results on screen
let firstPageLoad = true; //used to detect if this is the first page load


function btnCheck() {
    let btn = $(this).attr("id");

    if (subPressed === subAllowed && (btn === "add" || btn === "subtract" || btn === "multiply" || btn === "divide")){
        inputNumber = $('#number1').val();
    }//checks if last button pressed is submit, and if this button press is an action
    //if so then this sets the inputNumber to what the result of the last test was
    
    if (btn === "decimal" && decEntered === decAllowed) {
    }//checks if decimal already added, stops button from functioning if so
    else if ((btn === "decimal" && inputNumber === "") || (btn === "decimal" && actionLastPressed === 1)) {
        inputNumber = inputNumber.concat('0.');
        $('#number1').val(`${inputNumber}`);
        decEntered++;
        subPressed = 0;
        actionLastPressed = 0;
    }//checks if decimal is first added and changes input to 0.
    else if (btn === "decimal" && decEntered < decAllowed) {
        inputNumber = inputNumber.concat('.');
        $('#number1').val(`${inputNumber}`);
        decEntered++;
        subPressed = 0;
        actionLastPressed = 0;
    } //checks if decimal is added, and then adds decimal
    else if (actionEntered === 1 && (btn === "add" || btn === "subtract" || btn === "multiply" || btn === "divide")) {
    }//checks if action was button entered and stops buttons from functioning if so
    else if(inputNumber === "" && (btn === "add" || btn === "subtract" || btn === "multiply" || btn === "divide")){
    }//checks if no numbers have been entered and stops actions from being entered if so
    else if (btn === "add") {
        inputNumber = inputNumber.concat("+"); //adds addition to input variable
        $('#number1').val(`${inputNumber}`); //changes input on DOM
        decEntered = 0; //clears decimal enter if decimal has been entered
        actionEntered++; //increments action pressed
        action = '+';  //sets action to addition
        subPressed = 0; //clears submit pressed if it has been incremented
        actionLastPressed = 1;
    }//adds addition
    else if (btn === "subtract") {
        inputNumber = inputNumber.concat("-");
        $('#number1').val(`${inputNumber}`);
        decEntered = 0;
        actionEntered++;
        action = '-';
        subPressed = 0;
        actionLastPressed = 1;
    }//adds subtraction
    else if (btn === "multiply") {
        inputNumber = inputNumber.concat("*");
        $('#number1').val(`${inputNumber}`);
        decEntered = 0;
        actionEntered++;
        action = '*';
        subPressed = 0;
        actionLastPressed = 1;
    }//adds multiplication
    else if (btn === "divide") {
        inputNumber = inputNumber.concat("/");
        $('#number1').val(`${inputNumber}`);
        decEntered = 0;
        actionEntered++;
        action = '/';
        subPressed = 0;
        actionLastPressed = 1;
    }//adds divison
    else if (btn === "submit") {
        calculate(); //activates calculate
    }//submits function
    else if (inputNumber === "") {
        inputNumber = btn; //sets input to number
        $('#number1').val(`${inputNumber}`); //sends to DOM
        subPressed = 0; //clears if submit was last pressed
        actionLastPressed = 0;
    }//adds number if no numbers entered
    else {
        inputNumber = inputNumber.concat(btn);
        $('#number1').val(`${inputNumber}`);
        subPressed = 0;
        actionLastPressed = 0;
    };//adds number if numbers already entered
    
}//end btnCheck



function calculate(){
    let value = '';

    if (action === '' || inputNumber === "") {  
        alert("Need more input");
        return false;
    }//checks for lack of inputs
    else if (action === '+'){
        value = inputNumber.split('+');
    }//splits input string into object with targetedable values based on selected action
    else if (action === '-') {
        value = inputNumber.split('-');
    } //splits input string into object with targetedable values based on selected action
    else if (action === '*') {
        value = inputNumber.split('*');
    } //splits input string into object with targetedable values based on selected action
    else if (action === '/') {
        value = inputNumber.split('/');
    } //splits input string into object with targetedable values based on selected action

    if (value.length < 2 || value[1] === "" || value[0] === "") {
        alert("Need more input");
        return false;
    }//checks to see if either value is not entered
    let objData = {
        value1: value[0],
        value2: value[1],
        action: action,
    }//defines object to send server by getting values of input fields

    $.ajax({
        method: 'POST',
        url: '/calculate',
        data: objData
    }).then((data) =>{
        getData();
    });//sends info to server

    decEntered = 0; //clears decimal entered
    actionEntered = 0; //clears action entered
    actionLastPressed = 1;

}//end calculate

function getData(){
    $.ajax({
        method: 'GET',
        url: '/getData'
    }).then((response) =>{
        updateHistory(response);
        // if (response[response.length - 1].result === null){
        if (firstPageLoad === true) {
            firstPageLoad = false;
        }
        else{
            $('#number1').val(`${response[response.length-1].result}`);
        }
        inputNumber= "";
        subPressed= 1;
    })//gets info from server and appends to DOM, while reseting inputNumber

    
};//end getData

function updateHistory(data){
    $('#result').empty()
    if (data !== []) {
        if (data.result === null) {
            let element = data[data.length - 1];
            $('#history').append(`<li> ${element.value1} ${element.action} ${element.value2} = 0 <button class="rerun" data-result="0">Rerun</button></li>`);
        } else {
            if (firstPageLoad === true) {
            }else{
                $('#result').append(`Result: ${data[data.length - 1].result}`);
            }
            $('#histClear').prop("disabled", false);
            console.log('historyAmount:', historyAmount);
            for (let index = historyAmount; index < data.length; index++) {
                let element = data[index];
                $('#history').append(`<li> ${element.value1} ${element.action} ${element.value2} = ${element.result} <button class="rerun" data-result="${element.result}">Rerun</button></li>`);
                historyAmount++;
            }
        }
    }

};//end updateHistory

function clear(){
    $('#number1').val('');
    inputNumber = '';
    decEntered = 0;
    subPressed = 0;
}//end clear
//resets DOM and clears variables that measure inputs

function clearHistory(){
    $.ajax({
        method: 'DELETE',
        url: '/delete'
    }).then((response) => {
        getData();
    })
    $('#number1').val('');
    $('#history').empty()
    $('#histClear').prop("disabled", true);
    historyAmount = 0
};//end clearHistory


function rerun() {
    let newData = $(this).data();
    $('#result').empty()
    $('#number1').val(`${newData.result}`); 
    $('#result').append(`Result: ${newData.result}`);
    inputNumber = "";
    subPressed = 1;
    decEntered = 0;
    actionEntered = 0;
}//end rerun