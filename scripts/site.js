function initProgram() {
  // Set global number of problems
  window.numberOfProblems = 10;
   
  // Get Current User
  var currentUser = localStorage.getItem('currentUser');
  if (currentUser == null) {
    NoUser();
    ChangeUser();
  } else {
	$('#CurrentUser').text(currentUser);
	$('#start-game-section').show();
  }
}	

// Submitted Guess
$('#submitted-guess').submit(function( event ) {
  if (window.processing) {return false;} // Prevent multiple submission
  var answerNum = $('#topNumber').text() * $('#bottomNumber').text();
  
  if ($('#guess').val() == '') {
	return false; // skip blank answers
  }
  
  if ($('#guess').val() == answerNum) {
    // Right answer
	RightAnswer();
  } else {
    // Wrong answer
	WrongAnswer(answerNum);
  }
  return false;
});

// Change User button
$("#change-user-button").on("click", function () {
  ChangeUser();
});

// See Report button
$("#see-report-button").on("click", function () {
  SeeReport();
});

// Add User Submit
$('#add-user').submit(function( event ) {
  newUser = ($('#new-user').val()).trim();
  if (newUser == '') {return false;} // If blank, skip it
  
  // Check if name = you!
  if (newUser == 'you!') {
  	$("#dialogMsg").text("Don't be a smarty pants, pick another name!");
    $("#msgDialog").modal('show');
	return false;
  } 
    
  // Get User List
  var currentUserList = JSON.parse(localStorage.getItem('currentUserList'));
  if (currentUserList == null) {
    var userArray = [];
    userArray.push(newUser);
    currentUserList = userArray;
  } else {
    var userPos = $.inArray(newUser, currentUserList);
	if (userPos != -1)
	{
	  // alert("User already exist!!!");
	  $('#sentDialog').modal('show'); 
	  {return false;}
	}
    currentUserList.push(newUser);
  }
  localStorage.setItem('currentUserList', JSON.stringify(currentUserList));

  // Set User and Start New Game
  NewUser(newUser);  
  return false;
});
	
// Start button
$("#start-button").on("click", function () {
  $('#start-game-section').hide();
  StartGame();
});

// Play again button
$("#play-again-button").on("click", function () {
  $('#game-over-section').hide();
  StartGame();
});
	
// Only allow numbers for answers
$('#guess').keyup(function(e) {
  if (/\D/g.test(this.value)) {
    this.value = this.value.replace(/\D/g, '');
  }
});

function StartGame() {
  $('#body').fadeIn()
  window.currentProblem = 1;
  window.missedProblems = 0;
  window.startTime = new Date().getTime();
  window.totalTime = 0; 
    
  // Get 1st problem
  GetProblem();
}

function ChangeUser() {
  $('#body').hide();
  $('#start-game-section').hide();
  $('#game-over-section').hide();
  $('#report-section').hide()
  $('#new-user').val('');
  $('#change-user-section').show()
  
  var currentUser = localStorage.getItem('currentUser');
  var userHtml = '';
  var userMessage = 'Add User';
  // Get User Array
  var currentUserList = JSON.parse(localStorage.getItem('currentUserList'));
  if (currentUserList != null) {
    var userMessage = 'Change or Add User';
    $.each( currentUserList, function( key, value ) {
      userHtml = userHtml + '<p><button type="button" value="' + value + '" class="user-btn btn btn-info btn-lg">' + value + '</button>'
	  userHtml = userHtml + ' <button type="button" value="' + value + '" class="user-delete-btn btn btn-xs"><span class="glyphicon glyphicon-trash"></span></button></p>'
    });
  }
  
  $('#change-user-buttons').html(userHtml);
  $('#change-user-message').text(userMessage);
}

// Change User button(s)
$('#change-user-buttons').on('click', '.user-btn', function () {
  // Set User and Start New Game
  currentUser = $(this).attr("value");
  NewUser(currentUser);
});

// Delete User button(s)
$('#change-user-buttons').on('click', '.user-delete-btn', function () {
  userToDelete = $(this).attr("value");
  DeleteUser(userToDelete);
    
  // Remove User from screen list
  $(this).parent().remove(); // or $(this).closest('p').remove();
  
  // If deleted user is the current user
  var currentUser = $('#CurrentUser').text();
  if(userToDelete ==  currentUser) {
	localStorage.removeItem('currentUser');
	NoUser();
  }
});

function NoUser() {
	$('#CurrentUser').text("you!");
}

function NewUser(currentUser) {
  localStorage.setItem('currentUser', currentUser);	
  $('#CurrentUser').text(currentUser);
  $('#change-user-section').hide()
  $('#report-section').hide()
  $('#start-game-section').show();
}

function DeleteUser(userToDelete) {
  // Delete Users from Array 
  // Get User List
  var currentUserList = JSON.parse(localStorage.getItem('currentUserList'));
  if (currentUserList != null) {
    // Get User Position in Array
    var userToDeleteArrayPosition = $.inArray(userToDelete, currentUserList);
	// Cut User out of the Array
	currentUserList.splice(userToDeleteArrayPosition,1);
    // Save User List
    localStorage.setItem('currentUserList', JSON.stringify(currentUserList));
  }
  
  // Delete Users Log 
  var key = userToDelete + 'Log';	
  localStorage.removeItem(key);
}

function GetProblem() {
	window.currentTry = 1;
	window.startCurrentProblem = new Date().getTime();
	var topNum = Math.floor((Math.random() * 13)); // 0 to 12
	var bottomNum = Math.floor((Math.random() * 13)); // 0 to 12
	$('#topNumber').text(topNum); 
        $('#operator').text('×');
	$('#bottomNumber').text(bottomNum); 
	$('#guess').val('');
	$('#message').hide();
	$('#guess').focus();
	window.processing = false;
}

function RightAnswer() {
	window.processing = true;
	$('#message').text('You got it!');
	$('#message').fadeIn().delay(500).fadeOut();
	
	window.totalTime = (new Date().getTime() - window.startTime) / 1000;
	var totalTimeRounded = Math.round(window.totalTime).toFixed(0);
	
	if (window.currentProblem < window.numberOfProblems) {
	  window.currentProblem = window.currentProblem + 1;
	  setTimeout(function(){GetProblem()},1000);
	} else {
	  setTimeout(function(){
	  	$('#body').hide();
		$('#game-over-message').text('Good job! You only missed ' + window.missedProblems +
			' problems and it only took you ' + totalTimeRounded + ' seconds!');
		$('#game-over-section').fadeIn()
	  },1000);
		
      LogGame();
	}
}

function LogGame() {
  var key = $('#CurrentUser').text() + 'Log';		  
  var log = {};
  log.Date = new Date();
  log.NumberWrong = window.missedProblems;
  log.TotalTime = window.totalTime;
    		  	  
  var userLog = JSON.parse(localStorage.getItem(key));
  if (userLog == null) {
    var logs = [];
    logs.push(log);
    userLog = logs;
  } else {
    userLog.push(log);
  }
  localStorage.setItem(key, JSON.stringify(userLog));
}

function WrongAnswer(answerNum) {
	window.missedProblems = window.missedProblems + 1;
    window.currentTry = window.currentTry + 1;
	if (window.currentTry < 4) {
	  $('#message').text('Try Again');
	  $('#message').fadeIn().delay(500).fadeOut();	
	} else {
	  $('#message').text('The Answer is ' + answerNum);
	  $('#message').fadeIn().delay(1000).fadeOut();	
	}
    $('#guess').select();	  
}

function SeeReport() {
  $('#body').hide();
  $('#start-game-section').hide();
  $('#game-over-section').hide();
  $('#change-user-section').hide()
  $('#report-section').show()
  
  var key = $('#CurrentUser').text() + 'Log';	
  var userLog = JSON.parse(localStorage.getItem(key));
  
  var chartDates = [];
  var chartNumberWrong = [];
  var chartTime = [];
  
  if (userLog != null) {
    $.each( userLog, function( key, value ) {
		
	date = new Date(value.Date);
	formatDate = date.toLocaleDateString("en-US");
	
    chartDates.push(formatDate);
	chartNumberWrong.push(value.NumberWrong);
	chartTime.push(value.TotalTime);
    //alert('Date: ' + formatDate + ' Number wrong: ' + value.NumberWrong + ' Total time: ' + value.TotalTime);
    });
  }
  
  var data = {
	labels : chartDates,
	datasets : [
		{
			fillColor : "rgba(151,187,205,0.5)",
			strokeColor : "rgba(151,187,205,1)",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#fff",
			data : chartNumberWrong
		},
		{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			data : chartTime
		}
	]
  };
  
  //Get context with jQuery - using jQuery's .get() method.
  var ctx = $("#myChart").get(0).getContext("2d");
  //This will get the first returned node in the jQuery collection.
  var myNewChart = new Chart(ctx);
  DrawChart(ctx, data);
  window.onresize = function(event){
	  DrawChart(ctx, data);
  };
}

function DrawChart(ctx, data) {
	// Get largest chart value (wrong answers and time)
	var wrongArray = data.datasets[0].data;
	var timeArray = data.datasets[1].data;
	var combinedArray = wrongArray.concat(timeArray); 
	var largest = Math.max.apply(Math, combinedArray); 

	var scaleOverride = false;
	var scaleSteps;
	var scaleStepWidth;
	switch (true) {
		case (largest <= 10):
			scaleOverride = true;
			scaleSteps = 10;
			scaleStepWidth = 1;
			break;
		case (largest > 10 && largest <= 20):
			scaleOverride = true;
			scaleSteps = 10;
			scaleStepWidth = 2;
			break;	
		case (largest > 20 && largest <= 40):
			scaleOverride = true;
			scaleSteps = 10;
			scaleStepWidth = 4;
			break;	
		case (largest > 40 && largest <= 60):
			scaleOverride = true;
			scaleSteps = 10;
			scaleStepWidth = 6;
			break;	
		case (largest > 60 && largest <= 80):
			scaleOverride = true;
			scaleSteps = 10;
			scaleStepWidth = 8;
			break;	
		case (largest > 80 && largest <= 100):
			scaleOverride = true;
			scaleSteps = 10;
			scaleStepWidth = 10;
			break;
		case (largest > 100 && largest <= 200):
			scaleOverride = true;
			scaleSteps = 10;
			scaleStepWidth = 20;
			break;
		default:
			break;
	}

	var options = { 
		scaleOverride: scaleOverride,
		scaleSteps: scaleSteps,
		scaleStepWidth: scaleStepWidth,
		scaleStartValue: 0
	};

    var width = $('canvas').parent().width();
    $('canvas').attr("width",width);
    new Chart(ctx).Line(data, options);
}
