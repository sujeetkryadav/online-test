$(document).ready(function() {
  /**
   * TO Block copy paste on the page
   */
  $("body").bind("cut copy paste", function(e) {
    e.preventDefault();
  });
  $(document).bind("contextmenu", function(e) {
    return false;
  });

  var questions = [];
  var currentIndex = 0;
  var interval = null;
  // $('#question-container').height($( window ).height() - 200)
  loadQuestions();
  function loadQuestions() {
    $.ajax({
      url: "questions.json",
      method: "GET",
      success: function(res) {
        //console.log(res);
        questions = res;
        renderQuestion(questions[0], 0);
        renderIndex(questions);
        console.log(localStorage.getItem("timmer"));
        if (localStorage.getItem("timmer")) {
          initiateTimer(localStorage.getItem("timmer") / 60); // Time in minuts
        } else {
          initiateTimer(60); // Time in minuts
        }
      }
    });
  }
  /**
   * TO render questions with answer
   **/
  function renderQuestion(question, index) {
    //console.log(question.selected)
    $("#question").empty();
    $("#question").append("<p>" + (index + 1) + "." + question.ques + "</p>");
    var options = "";
    for (var i = 0; i < question.options.length; i++) {
      options +=
        '<li><label><input type="radio" name="option" value="' +
        question.options[i].answer +
        '">' +
        '<span class="label-text">' +
        question.options[i].answer +
        "</span></label></li>";
    }
    $("#options").empty();
    $("#options").append(options);
    $('input:radio[name="option"][value="' + question.selected + '"]').attr(
      "checked",
      true
    );
  }

  function renderIndex(questions) {
    console.log(questions);
    var btns = "";
    var className = "";
    for (var i = 0; i < questions.length; i++) {
      questions[i].selected != null
        ? (className = "btn-success")
        : (className = "btn-danger");
      btns +=
        '<button data-index="' +
        i +
        '" class="btn question-index btn-circle ' +
        className +
        '">' +
        (i + 1) +
        "</button>";
    }
    $("#questions-indexing").empty();
    $("#questions-indexing").append(btns);
  }
  /**
   * TO load next question
   **/
  $("#next-btn").click(function() {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion(questions[currentIndex], currentIndex);
    }
  });

  /**
   * TO load next question
   **/
  $("#previous-btn").click(function() {
    if (currentIndex >= 1) {
      currentIndex--;
      renderQuestion(questions[currentIndex], currentIndex);
    }
  });

  /**
   * TO detect click on option
   **/
  $("body").on("click", "input[name=option]", function() {
    questions[currentIndex].selected = $(this).val();
    renderIndex(questions);
  });
  /**
   * TO save quetions and answer
   **/
  $("#submit-btn").click(function() {
    saveData(questions);
  });

  /**
   * TO navigate to question
   **/
  $("body").on("click", "button.question-index", function() {
    var index = $(this).data("index");
    currentIndex = index;
    renderQuestion(questions[index], index);
  });

  /**
   * To Start timmer
   */

  function initiateTimer(time) {
    $("#timmer").text(Math.floor(time) + " m: 00 s");
    var timmer = time * 60;
    var hours = 0;
    interval = setInterval(function() {
      timmer--;
      var minuts = Math.floor(timmer / 60);
      var hours = Math.floor(timmer / 3600);
      var sec = timmer % 60;
      hours < 10 ? (hours = "0" + hours) : (hours = hours);
      minuts < 10 ? (minuts = "0" + minuts) : (minuts = minuts);
      sec < 10 ? (sec = "0" + sec) : (sec = sec);

      $("#timmer").text(minuts + " m:" + sec + " s");
      localStorage.setItem("timmer", timmer);
      if (timmer == 0) {
        stopTimmer(interval);
      }
    }, 1000);
  }

  /**
   * TO stop set interval
   */
  function stopTimmer(interval) {
    clearInterval(interval); // This is javascript function to stop setInterval
    saveData(questions);
  }

  /**
   * To submit result
   */

  function saveData(data) {
    clearInterval(interval);
    localStorage.clear();
    console.log(data);
  }
});
