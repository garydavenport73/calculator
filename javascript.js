let note = document.getElementById('note');

function newEntry() {
	if (note.value != '') {
		if (confirm("This will erase current contents.")) {
			note.value = '';
		}
	}
}

function load() {
	let fileContents = "";
	let inputTypeIsFile = document.createElement('input');
	inputTypeIsFile.type = "file";
	inputTypeIsFile.accept = ".txt";
	inputTypeIsFile.addEventListener("change", function() {
		let inputFile = inputTypeIsFile.files[0];
		let fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent) {
			fileContents = fileLoadedEvent.target.result;
			note.value = fileContents;
		};
		fileReader.readAsText(inputFile, "UTF-8");
	});
	inputTypeIsFile.click();
}

function save() {
	basename = "note" + getTodaysDate();
	saveStringToTextFile(note.value, basename, ".txt");
}

function saveStringToTextFile(str1, basename = "myfile", fileType = ".txt") {
	let filename = basename + fileType;
	let blobVersionOfText = new Blob([str1], {
		type: "text/plain"
	});
	let urlToBlob = window.URL.createObjectURL(blobVersionOfText);
	let downloadLink = document.createElement("a");
	downloadLink.style.display = "none";
	downloadLink.download = filename;
	downloadLink.href = urlToBlob;
	document.body.appendChild(downloadLink);
	downloadLink.click();
	downloadLink.parentElement.removeChild(downloadLink);
}

function copyStringToClipboard(str) {
	//https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
	let el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style = {
		position: 'absolute',
		left: '-9999px'
	};
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
	alert('Copied to Clipboard.');
}


//Date related functions for convience, uses same format as input type="date"
function getTodaysDate() {
	let now = new Date();
	let day = ("0" + now.getDate()).slice(-2);
	let month = ("0" + (now.getMonth() + 1)).slice(-2);
	let today = now.getFullYear() + "-" + month + "-" + day;
	return today;
}

function getFirstDayOfThisMonthDate() {
	let now = new Date();
	let day = "01";
	let month = ("0" + (now.getMonth() + 1)).slice(-2);
	return now.getFullYear() + "-" + month + "-" + day;
}

function getLastDayOfThisMonthDate() {
	let now = new Date();
	let day = daysInThisMonth().toString();
	day = "0" + day;
	day = day.slice(-2);
	let month = ("0" + (now.getMonth() + 1)).slice(-2);
	return now.getFullYear() + "-" + month + "-" + day;
}

function daysInSomeMonth(someMonth, someYear) { //use jan month is 0
	return new Date(someYear, someMonth + 1, 0).getDate();
}

function daysInThisMonth() {
	thisDate = new Date();
	thisMonth = thisDate.getMonth();
	thisYear = thisDate.getYear();
	return daysInSomeMonth(thisMonth, thisYear);
}
////Asks if you really want to close browser

window.onbeforeunload = askConfirm;
let needsSave = true;

function askConfirm() {
	if (needsSave === true) {
		return "Did you remember to save your data?";
	} else {
		return;
	}
}

let calcString="";
let calculatorInput=document.getElementById('calculator-input');
function buildCalcString(clickedElement){

	if (clickedElement.innerHTML==="CLR"){
		//alert("its CLR");
		calculatorInput.value="";
		calcString="";
		}
	else if (clickedElement.innerHTML==="="){
		evaluateExpression(calculatorInput.value);
	}
	else{
		calcString=calculatorInput.value;
		calcString+=clickedElement.innerHTML;
		calculatorInput.value=calcString;	
	}
	
}

function clearInput(){
	
	}


function getAnOperator(str){
	str=str.replaceAll('*','x');
	let operators=['/','x','-','+'];
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
	str=str.replaceAll('*','x');
	let operators=['/','x','-','+'];
	let operatorCount=0;
	str=str.trim();
	if (str[0]==="-"){
		str=str.slice(1);
	}
	
	for (let i=0;i<operators.length;i++){
		//console.log(str.split(operators[i]).length -1);
		operatorCount+= str.split(operators[i]).length - 1;
	}
	if (operatorCount!=1){
		console.log("incorrect operator count",operatorCount)
		}
	return (operatorCount===1);
}

function tokenEmpty(str, operator){
	str=str.replaceAll('*','x');
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
	str=str.replaceAll('*','x');
	console.log("expression to evaluate",str);
	let result = "can't evaluate";

	if (justOneOperator(str)){
		let operator = getAnOperator(str);
		if (tokenEmpty(str,operator)===false){
			let tokens=getTokens(str,operator);
			console.log(operator,tokens);
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
	str=str.replaceAll('*','x');
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
	else if (operator==="x"){
		return (Number(tokens[0]) * Number(tokens[1]));
	}
		
}
	
	
