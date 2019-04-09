// Initialize Firebase
var config = {
    apiKey: "AIzaSyA2kvk2MH8Sf9kh74gmw6uShV4fimBAhCk",
    authDomain: "train-scheduler-6cd52.firebaseapp.com",
    databaseURL: "https://train-scheduler-6cd52.firebaseio.com",
    projectId: "train-scheduler-6cd52",
    storageBucket: "train-scheduler-6cd52.appspot.com",
    messagingSenderId: "904940226660"
};
firebase.initializeApp(config);

var database = firebase.database();


$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val();
    var trainDestination = $("#destination-input").val();
    var trainFirstTime = moment($("firstTrainTime-input").val(),"HH:mm");
    var trainFrequency = parseInt($("#frequency-input").val());

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        firstTime: trainFirstTime.format("HH:mm"),
        frequency: trainFrequency,
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTime);
    console.log(newTrain.frequency);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#firstTrainTime-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = (childSnapshot.val().name);
    var trainDestination = (childSnapshot.val().destination);
    var trainFirstTime = (childSnapshot.val().firstTime);
    var trainFrequency = (childSnapshot.val().frequency);

    var convertedTime = moment(trainFirstTime, "HH:mm").subtract(1, "years");
    console.log(convertedTime);

    var currentTime = moment();

    var diffTime = moment().diff(moment(convertedTime), "minutes");
    console.log("Difference in time: " + diffTime);

    // Time apart (remainder)
    var timeRemainder = diffTime % trainFrequency;
    console.log(timeRemainder);

    // Minute Until Train
    var minutesAway = trainFrequency - timeRemainder;
    console.log("Minutes until train: " + minutesAway);

    // Next Train
    var nextArrival = moment().add(minutesAway, "minutes");
    console.log("Arrival time: " + moment(nextArrival).format("HH:mm"));

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextArrival.format("HH:mm")),
        $("<td>").text(minutesAway)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});

