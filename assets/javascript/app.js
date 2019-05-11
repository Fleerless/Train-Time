
var firebaseConfig = {
    apiKey: "AIzaSyCt2heMSHen_uUKz6JWG02bYaetinUsA90",
    authDomain: "train-time-jeff-fleer.firebaseapp.com",
    databaseURL: "https://train-time-jeff-fleer.firebaseio.com",
    projectId: "train-time-jeff-fleer",
    storageBucket: "train-time-jeff-fleer.appspot.com",
    messagingSenderId: "913879018275",
    appId: "1:913879018275:web:f7349d8112a55cb1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

 
//   $(document).ready(function(){

    // Get a reference to the database service

    // Build a click function that will take the input data and push it to Firebase
    $(document).on("click", "#submit-button", function(){
        var tName = $("#train-name").val().trim();
        var destination = $("#destination").val().trim();
        var firstTime = $("#first-time").val().trim();
        var frequency = $("#frequency").val().trim();
        database.ref().push({
            tName: tName,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency
        });
        // Reset the input form to keep the page clean
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-time").val("");
        $("#frequency").val("");
    });

    // Build a database listener that will update the html upon a database change
    database.ref().on("child_added", function(snapshot){
        // Save child data to variables for manipulation
        var snapshot = snapshot.val();
        var tName = snapshot.tName;
        var destination = snapshot.destination;
        var firstTime = snapshot.firstTime;
        var frequency = snapshot.frequency;

        // Calculate the time to the next train
        // Create a moment object with the current time

        // ==================== IT WORKS!!!! =========================
        //======================

        var trainMoment = moment(firstTime, "hh:mm");
        // Calculate minutes from start time until next arrival
        var currentTime = moment().diff(moment(trainMoment), "m");
        var minsAway = frequency - (currentTime % frequency);
        if (minsAway === parseInt(frequency)){
            minsAway = 0;
        }

        // Use the calculated times to display the time of the next arrival
        var nextArrival = moment().add(minsAway, "m").format("h:mm a");

        // Create table elements to append to the table
        var row = $("<tr>");
        var TDname = $("<td>").html(tName);
        var TDdestination = $("<td>").html(destination);
        var TDfrequency = $("<td>").html(frequency + " (mins)");
        var TDarrivalTime = $("<td>").html(nextArrival).attr("id", tName);
        var TDminAway = $("<td>").html(minsAway).attr("id", frequency);
        $(row).append(TDname, TDdestination, TDfrequency, TDarrivalTime, TDminAway);
        $("#table").append(row);
    })

    // Grab current time and append to the page, updating every second
    
    function appendTime(){
        $("#current-time").empty();
        fullTime = moment().format('llll');
        $("#current-time").append(fullTime);
    }
    var intervalTime = setInterval(appendTime, 1000);

    // Create a function that calculates the time minutes to arrival for the train

    function arrivalTime(){
        partTime = moment().format('h:mm:ss a');
    }

    // Create a function that will fetch FireBase data and update arrival times every 30 seconds
    function updateArrivalTime(){
        return firebase.database().ref().once('value').then(function(snapshot){
            var snapshot = snapshot.val();
            $.each(snapshot, function(key, value){

                var firstTime = value.firstTime;
                var frequency = value.frequency;
                var tName = value.tName;
    
                var trainMoment = moment(firstTime, "hh:mm:ss");

                // Calculate minutes from start time until next arrival
                var currentTime = moment().diff(moment(trainMoment), "m");

                var minsAway = frequency - (currentTime % frequency);
                if (minsAway === parseInt(frequency)){
                    minsAway = 0;
                }
                // Use the calculated times to display the time of the next arrival
                var nextArrival = moment().add(minsAway, "m").format("h:mm a");
    
                // Update the relevant table elements
                $("#"+tName).empty().append(nextArrival);
                $("#"+frequency).empty().append(minsAway);
            })
        })
    }
    var updateArrivals = setInterval(updateArrivalTime, 1000)
    
    // })