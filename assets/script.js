const displayQuestionsLength = 9;
// this code use is signup page
function registration() {
  const name = document.querySelector("#full-name").value;
  const email = document.querySelector("#email-id").value;
  const pass = document.querySelector("#password").value;
  const namePattern = /^[A-Za-z\s\-']+$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!name) {
    alert("please Enter Your Full Name");

  }
  if (!namePattern.test(name)) {
    alert("please Enter valid name");
    return;
  }
  if (!email) {
    alert("please Enter Your Email");
    return;
  }
  if (!emailPattern.test(email)) {
    alert("please Enter Valid Email");
    return;
  }
  if (!pass) {
    alert("Enter the Password");
    return;
  }
  if (pass.length < 8) {
    alert("Password minimum 8 Charecter");
    return;
  }

  // Save Data In LocalStorage
  const userDetails = JSON.parse(localStorage.getItem("user")) || []; //json parse
  const userExist = userDetails.some(
    (newUser) => newUser.email === email
  );
  if (userExist) {
    alert("already exist user");
    return;
  }
  const newUser = {
    name: name,
    email: email,
    password: pass,
  };
  userDetails.push(newUser); //push array - already exist
  let objectConvertToString = JSON.stringify(userDetails); //stringify
  localStorage.setItem("user", objectConvertToString); //setItem // save

  alert("Registration Successfully");
  location.href = "index.html";
}

//registration()

//this code is for login page

function validation() {
  const inputEmail = document.querySelector("#email-id").value;
  const inputPassword = document.querySelector("#password").value;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!(inputEmail && inputPassword)) {
    alert("please enter the email & password");
    return;
  }
  if (!emailPattern.test(inputEmail)) {
    alert("please enter valid email");
    return;
  }
  if (inputPassword.length < 8) {
    alert("please enter the password minimum 8 character");
    return;
  }
  const userDetail = JSON.parse(localStorage.getItem("user")) || [];
  // loop
  let credantialValid = false;
  let currentUser = null;
  for (let i=0; i<userDetail.length; i++){
    if(inputEmail === userDetail[i].email && inputPassword === userDetail[i].password){
        credantialValid = true;
        currentUser= userDetail[i];
    }
  }
  if(credantialValid){
    let logedInUser = JSON.stringify(currentUser);
    localStorage.setItem("userLogedIn",logedInUser); 
    location.href = "dashboard.html"
  }else{
    return alert("user not found");
  }

    
  };
  // ptintName
  function userName(){
    const loginUser = JSON.parse(localStorage.getItem("userLogedIn"));
    let printUserName = document.getElementById("show-user-name");

    if(printUserName){
    printUserName.innerHTML = loginUser.name;
    }
  }

function passwordHideShow() {
  let showPassword = document.getElementById("show-pass");
  let hidePassword = document.getElementById("hide-pass");
  let password = document.querySelector("#password");
  if (password.type === "password") {
    password.type = "text";
    hidePassword.style.visibility = "visible";
    showPassword.style.visibility = "hidden";
  } else if (password.type === "text") {
    password.type = "password";
    hidePassword.style.visibility = "hidden";
    showPassword.style.visibility = "visible";
  }
}
// passwordHideShow()

// start Time 
// ── Timer (Fixed) ──────────────────────────
let time = null;
let totalSeconds = 0;         // counts UP from 0
const TIME_LIMIT = 10 * 60;  // 10 minutes = 600 seconds

function increaseTime() {
  totalSeconds++;

  let minute = Math.floor(totalSeconds / 60);
  let second = totalSeconds % 60;

  let min = minute < 10 ? "0" + minute : minute;
  let sec = second < 10 ? "0" + second : second;

  let displayTime = document.getElementById("displayTime");
  if (displayTime) {
    displayTime.innerHTML = min + ":" + sec;
  }

  // Auto-submit when 10 minutes is reached
  if (totalSeconds >= TIME_LIMIT) {
    stopTime();
    alert("Time's up! Submitting your quiz.");
    submit();
  }
}

function startTime() {
  totalSeconds = 0; // reset counter
  if (time !== null) {
    clearInterval(time);
  }
  time = setInterval(increaseTime, 1000);
}

function stopTime() {
  clearInterval(time);
}

// function for for switch dashboard to quize
function startQuize(){
  let startTime;
  startTime = new Date().getTime()
  location.href="Quize-page.html"
  localStorage.setItem("startTime" , JSON.stringify(startTime))
  // startTime();
}



// Quizes

//let quize = JSON.parse(localStorage.getItem("quizes")) || [];


const quizes = [
  {
    question : " What is the correct syntax to output 'Hello, World!' in JavaScript?",
    answer : "console.log('Hello, World!')",
    options : [
      "print('Hello, World!');",
      "console.log('Hello, World!')",
      "echo('Hello, World!');",
      "document.write('Hello, World!');",
    ],
  },
  { 
    question : "Which operator is used to compare both value and type in JavaScript?",
    answer : "===",
    options : [
      "==",
      "!=",
      "===",
      "!=="
    ],
  },
  { 
    question : "How do you declare a variable in JavaScript?",
    answer : "var x;",
    options : [
      "var x;",
      "variable x;",
      "int x;",
      "declare x;"
    ],
  },
  { 
    question : "What will the following code output? console.log(2 + '2');",
    answer : "22",
    options : [
      "4",
      "22",
      "Error",
      "2.2"
    ],
  },
  { 
    question : "Which method is used to add a new element to the end of an array?",
    answer : "push()",
    options : [
      "push()",
      "pop()",
      "shift()",
      "unshift()"
    ],
  },
  { 
    question : "What is the purpose of the 'this' keyword in JavaScript?",
    answer : "It refers to the object from which the function was called.",
    options : [
      "It refers to the global object.",
      "It refers to the object from which the function was called.",
      "It refers to the parent object.",
      "It refers to the function itself."
    ],
  },
  { 
    question : "Which method is used to remove the last element from an array?",
    answer : "pop()",
    options : [
      "pop()",
      "push()",
      "splice()",
      "shift()"
    ],
  },
  { 
    question : "How can you create a function in JavaScript?",
    answer : "function myFunction() {}",
    options : [
      "function myFunction() {}",
      "create function myFunction() {}",
      "function: myFunction() {}",
      "myFunction() = function() {}"
    ],
  },
  { 
    question : "What is the output of 'console.log(typeof NaN);'",
    answer : "number",
    options : [
      "number",
      "NaN",
      "undefined",
      "object"
    ],
  },
  { 
    question : "How can you convert a string to an integer in JavaScript?",
    answer : "parseInt()",
    options : [
      "parseInt()",
      "parseFloat()",
      "toInteger()",
      "convertToInt()"
    ],
  },
];

// Only seed questions if none exist yet (preserve admin changes)
if (!localStorage.getItem("Quizes")) {
  localStorage.setItem("Quizes", JSON.stringify(quizes));
}

const fetchQuize = JSON.parse(localStorage.getItem("Quizes")) || [];

const choosedQuestion = [];
const choosedIndex = [];

// Pick min(10, total available) questions — works for any pool size
const totalToPick = Math.min(10, fetchQuize.length);

while(choosedIndex.length < totalToPick) {
  const randomIndex = Math.floor(Math.random() * fetchQuize.length);
  if(!choosedIndex.includes(randomIndex)) {
    choosedIndex.push(randomIndex);
    choosedQuestion.push(fetchQuize[randomIndex]);
  }
}

let index = 0;

 function displayQuestion(){
  // console.log(index);
    //  let questionCountingInNumber = document.getElementById("countQuestions").innerHTML;
    document.getElementById("quizes").innerText=choosedQuestion[index].question;
    document.getElementById("option-1").innerText=choosedQuestion[index].options[0];
    document.getElementById("option-2").innerText=choosedQuestion[index].options[1];
    document.getElementById("option-3").innerText=choosedQuestion[index].options[2];
    document.getElementById("option-4").innerText=choosedQuestion[index].options[3];
    
    document.getElementById("option1").value = choosedQuestion[index].options[0];
    document.getElementById("option2").value = choosedQuestion[index].options[1];
    document.getElementById("option3").value = choosedQuestion[index].options[2];
    document.getElementById("option4").value = choosedQuestion[index].options[3];
  
    //  question counting
    document.getElementById("countNum").innerText = index + 1 +"." ;
  
    let progressBar = document.getElementById("progress-percentage");
    let progressPercentage = ((index+1)/10) * 100 ;
    // console.log(progressPercentage);
    progressBar.style.width = progressPercentage + "%";
  
    // problem of last two option is similar checked//
  
  //   if(index == 8){
  //     document.getElementById("countQuestions").innerText = "Last 2 Questions Left";
  //   }
  //   if(index == 9){
  //     document.getElementById("countQuestions").innerText = "Hey this is Last Question";
  //   }
  //   if(index < 8){
  //   document.getElementById("countQuestions").innerHTML = questionCountingInNumber;
  //  }
  if(index == displayQuestionsLength){ 
    document.getElementById("next-btn").innerHTML = `Submit & Continue <img src="assets/images/right-arrow.svg" alt="right-arrow" id="right-arrow">` 
  }
  else{
    document.getElementById("next-btn").innerHTML =  `Next <img src="assets/images/right-arrow.svg" alt="right-arrow" id="right-arrow">` 
  }
    // question count for out of 10
    document.getElementById("countQue").innerText = index +1 ;
  
    if(index > 0){
      document.getElementById("previous-btn").style.visibility = "visible"; 
    }else{
      document.getElementById("previous-btn").style.visibility = "hidden";
    }
  
    let selectedRadio = document.querySelector("[name='answer']:checked");
    if(selectedRadio){
      selectedRadio.checked = false
    }
    if(choosedQuestion[index].choosedAnswer) {
      let choosedAnswer = choosedQuestion[index].choosedAnswer;
      choosedAnswer = choosedAnswer.replaceAll("'", "\\'");
      document.querySelector("[name='answer'][value='" + choosedAnswer + "']").checked = true;
    }
 
 }



function choosedAnswer(optionIndex){
  choosedQuestion[index]["choosedAnswer"] = choosedQuestion[index].options[optionIndex]
}
// let countNumber = 1;          
 function goToNext(){
  let selectedRadio = document.querySelectorAll("[name='answer']");
  console.log(selectedRadio)
  if(index == displayQuestionsLength){
    submit();
    return;
  }
  let optionSelected = false
  selectedRadio.forEach((checkedOption) =>{
    if(checkedOption.checked){
     if(index < displayQuestionsLength){
       index++;
       // countNumber++;
     }
     optionSelected = true;
    }
   })
   if(!optionSelected){
    alert("please select any 1 option from 4 option")
   }
   displayQuestion();
}

function goToPrevious(){
  if(index > 0){
    index--;
    // countNumber--;
    displayQuestion();
  }
}

function submit(){
  const startTimeOfUser = JSON.parse(localStorage.getItem("startTime"));
     let stopTime = new Date().getTime();
     let spentTime = (stopTime - startTimeOfUser ) / 1000;
  let score = 0;
  for(let i=0; i<choosedQuestion.length; i++){
    if(choosedQuestion[i].choosedAnswer == choosedQuestion[i].answer){
      score += 10;
      
    }
  }

  let userTest = JSON.parse(localStorage.getItem("userTest")) || [];
  let userLogedIn = JSON.parse(localStorage.getItem("userLogedIn"));
  
  let usertest = {
    questions : choosedQuestion,
    score : score,
    name : userLogedIn.name,
    email : userLogedIn.email,
    date : new Date().toDateString(),
    time : spentTime
  }

  userTest.unshift(usertest);
  localStorage.setItem("userTest",JSON.stringify(userTest));

  window.location.href = "leader-board.html"
  countTest();
} 

// log out function//
function logOut(){
  localStorage.removeItem("userLogedIn")
  window.location.replace("index.html")
}

function UsersLogOut(){
  let logOut = document.getElementById("logout-container");
  if(logOut.style.display === "block"){
    logOut.style.display="none";
  }else{
    logOut.style.display = "block"
  }
}

// // Function to display scores
function displayScores() {
let userTest = JSON.parse(localStorage.getItem("userTest"));
userTest.sort((a,b) => b.score - a.score);
console.log(userTest)
  let rank2 = document.getElementById("score-number1")
  let rank1 = document.getElementById("score-number2")
  let rank3 = document.getElementById("score-number3")
  let rank4 = document.getElementById("score-number4")
  let rank5 = document.getElementById("score-number5")
  let rank6 = document.getElementById("score-number6")

  rank1.innerText= userTest[0]?.score || 0
  rank2.innerText= userTest[1]?.score || 0
  rank3.innerText= userTest[2]?.score || 0
  rank4.innerText= userTest[3]?.score || 0
  rank5.innerText= userTest[4]?.score || 0
  rank6.innerText= userTest[5]?.score || 0


  let name1 = document.getElementById("name1")
  let name2 = document.getElementById("name2")
  let name3 = document.getElementById("name3")
  let name4 = document.getElementById("name4")
  let name5 = document.getElementById("name5")
  let name6 = document.getElementById("name6")

  name1.innerText = userTest[0]?.name || "No User"
  // console.log(name1)
  name2.innerText = userTest[1]?.name || "No User"
  name3.innerText = userTest[2]?.name || "No User"
  name4.innerText = userTest[3]?.name || "No User"
  name5.innerText = userTest[4]?.name || "No User"
  name6.innerText = userTest[5]?.name || "No User"
  console.log(name6)
}  

function userPosition(){
  let userLogedIn = JSON.parse(localStorage.getItem("userLogedIn"));
  let userTest = JSON.parse(localStorage.getItem("userTest"));
  userTest.sort((a,b) => b.score - a.score);
  for(let i=0; i < userTest.length; i++){
    switch(i+1){
      case 1:
        if(userLogedIn.email == userTest[i].email){
          document.getElementById("user-position").innerText = "1st"
        }
      break;
      case 2:
        if(userLogedIn.email == userTest[i].email){
          document.getElementById("user-position").innerText = `2nd`
        }
      break;
      case 3:
        if(userLogedIn.email == userTest[i].email){
          document.getElementById("user-position").innerText = "3rd"
        }
      break;
      default:
        if(userLogedIn.email == userTest[i].email){
          document.getElementById("user-position").innerText = `${i+1}th`
        }
    }
  }
}

function userIsNotRankSixPosition(){
  let userLogedIn = JSON.parse(localStorage.getItem("userLogedIn"));
  let userTest = JSON.parse(localStorage.getItem("userTest"));
  userTest.sort((a,b) => b.score - a.score);
  for(let i=6; i<userTest.length; i++){
    if(userLogedIn.email == userTest[i].email){
      console.log(userTest[i].name)
      document.getElementById("user-position-with-name").innerText = `${i+1}`
      let name6 = document.getElementById("name6");
      name6.innerText = userTest[i].name
    }
  }
}

function LoggedInUserFirstLetter(){
  let loggedInUser = JSON.parse(localStorage.getItem("userLogedIn"));
  let currentUserName = document.getElementById("current-user-name");
  let currentUserEmail = document.getElementById("current-user-email");
  let userName =loggedInUser.name;
  // console.log(userName.charAt(0));
  document.getElementById("logedinuser-firstname").innerText = userName.charAt(0);
  currentUserName.innerText = loggedInUser.name;
  currentUserEmail.innerText = loggedInUser.email
}

function countTest() {
  const userTest = JSON.parse(localStorage.getItem("userTest"));
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const currentUser = JSON.parse(localStorage.getItem("userLogedIn"));

  count = 0;
  for (let i = 0; i < userTest.length; i++) {
    if (currentUser.email === userTest[i].email) {
      count++;
    }
  }

  for (let i = 0; i < user.length; i++) {
    if (currentUser.email === user[i].email) {
      user[i].givenTestOfUser = count;
      break;
    }
  }

  for (let i = 0; i < user.length; i++) {
    for (let j = 0; j < userTest.length; j++) {
      if (currentUser.email == user[i].email) {
        user[i].latestScore = userTest[j].score;
        console.log(user[i].latestScore);
      }
    }
  }

  localStorage.setItem("user", JSON.stringify(user));
}


