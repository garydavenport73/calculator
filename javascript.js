let calcString="";
let calculatorInput=document.getElementById('calculator-input');
let charToAdd="";
let expressionSpan=document.getElementById('expression-span');
function buildCalcString(clickedElement){
	if (clickedElement.innerHTML==="CLR"){
		calculatorInput.value="";
		calcString="";
		calculatorInput.value=calcString;
		expressionSpan.innerHTML="";
		}
	else if (clickedElement.innerHTML==="←"){
		calcString=calculatorInput.value;
		calcString = calcString.slice(0,-1);
		calculatorInput.value=calcString;
		}
	else if (clickedElement.innerHTML==="="){
		evaluateExpression(calculatorInput.value);
	}
	else{
		calcString=calculatorInput.value;
		charToAdd = clickedElement.innerHTML;
		if (charToAdd==="x"){
			charToAdd="*";
		}
		calcString += charToAdd;
		calculatorInput.value=calcString;	
	}
}

function getAnOperator(str){
	let operators=['/','*','-','+'];
	str=str.trim();
	if (str[0]==="-"){
		str=str.slice(1);
	}
	for (let i=0;i<operators.length;i++){
		if (str.includes(operators[i])){
			return operators[i];
		}
	}
	return -1; //indicates no operator found
}


function justOneOperator(str){
	let operators=['/','*','-','+'];
	let operatorCount=0;
	str=str.trim();
	if (str[0]==="-"){
		str=str.slice(1);
	}
	
	for (let i=0;i<operators.length;i++){
		operatorCount+= str.split(operators[i]).length - 1;
	}
	if (operatorCount!=1){
		console.log("incorrect operator count",operatorCount)
		}
	return (operatorCount===1);
}

function tokenEmpty(str, operator){
	//trim string
	str=str.trim();
	//remove initial - sign if present
	if (str[0]==="-"){
		str=str.slice(1);
	}
	//split tokens
	tokens=str.split(operator);
	//trim tokens
	for (token of tokens){
		token=token.trim();
	}
	//check that length is correct
	if (tokens.length!=2){
		console.log("incorrect number of tokens");
		return true;
	}
	// if tokens are empty return true
	else if (tokens[0]===""){
		console.log("first token empty");
		return true;
	}
	else if (tokens[1]===""){
		console.log("second token empty");
		return true;
	}
	else {
		return false;
	}
}

function evaluateExpression(str){
	console.log("expression to evaluate",str);
	expressionSpan.innerHTML="evaluating: "+str;
	let result = "can't evaluate";

	if (justOneOperator(str)){
		let operator = getAnOperator(str);
		if (tokenEmpty(str,operator)===false){
			let tokens = getTokens(str,operator);
			console.log("operator",operator,"tokens",tokens);
			result = proceedWithEvaluation(tokens,operator).toString();
		}
	} 

	console.log(result);
	
	if (Number(result).toString()==="NaN"){
		//do nothing
		calculatorInput.style.backgroundColor="orange";
	} else {
		//replace the input box with the result
		calculatorInput.value=Number(result);
		calcString=result;
		calculatorInput.style.backgroundColor="field";
	}
}
	
function getTokens(str,operator){
	str=str.trim();
	let token0Prefix="";
	if (str[0]==="-"){
		str=str.slice(1);
		token0Prefix="-";
	}
	let tokens=str.split(operator);
	for (let token of tokens){
		token.trim();
	}
	tokens[0]=token0Prefix+tokens[0];
	return tokens;
}

function proceedWithEvaluation(tokens,operator){
	if (operator==="+"){
		return (Number(tokens[0]) + Number(tokens[1]));
	}
	else if (operator==="-"){
		return (Number(tokens[0]) - Number(tokens[1]));
	}
	else if (operator==="/"){
		return (Number(tokens[0]) / Number(tokens[1]));
	}
	else if (operator==="*"){
		return (Number(tokens[0]) * Number(tokens[1]));
	}
	else return(NaN);
}
	
// Get the input field
//https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
calculatorInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    //event.preventDefault();
    document.getElementById("equals-button").click();
  }
});
