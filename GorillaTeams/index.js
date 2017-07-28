"use strict";
const Alexa = require("alexa-sdk"); // import the library
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region:'us-east-1'});
var APP_ID = undefined;

// =====================================================================================================
// --------------------------------- Section 1. Data and Text strings  ---------------------------------
// =====================================================================================================
let people=[];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, descriptionHandlers, multipleSearchResultsHandlers);

    /*var info=[
        {firstName:"fabian",lastName:"moya",title:"Front End Developer",cityName:"sportslabs",twitter:"N/A",saytwitter:"the dave dev",slack:"fmoya",sayslack:"fabian.moya",linkedin:"",saylinkedin:"david isbitski",joinDate:"August 15th, 2016",gender:"m"},
        {firstName:"kenneth",lastName:"brenes",title:"Drupal developer",cityName:"sportslabs",twitter:"paulcutsinger",saytwitter:"paul cutsinger",slack:"kenneth.brenes",sayslack:"kenneth.brenes",linkedin:"https://www.linkedin.com/in/paulcutsinger",saylinkedin:"paul cutsinger",joinDate:"January 2016",gender:"m"},
        {firstName:"eduardo",lastName:"lobo",title:"Practice Lead",cityName:"Gorilla Logic",twitter:"amit",saytwitter:"amit",slack:"eduardo.lobo",sayslack:"eduardo.lobo",linkedin:"https://www.linkedin.com/in/ajotwani",saylinkedin:"a jotwani",joinDate:"February 2016",gender:"m"},
        {firstName:"Jose",lastName:"mejias",title:"an Alexa Gorilla Team",cityName:"columbus",twitter:"jeffblankenburg",saytwitter:"jeff blankenburg",slack:"jeffblankenburg",sayslack:"jeffblankenburg",linkedin:"https://www.linkedin.com/in/jeffblankenburg",saylinkedin:"jeff blankenburg",joinDate:"September 2016",gender:"m"},
        {firstName:"rob",lastName:"mccauley",title:"a Solutions Architect on the Alexa Skills Team",cityName:"DG",twitter:"robmccauley",saytwitter:"rob mccauley",slack:"robm26",sayslack:"rob m 26",linkedin:"https://www.linkedin.com/in/robm26",saylinkedin:"rob m 26",joinDate:"February 2016",gender:"m"},
        {firstName:"memo",lastName:"doring",title:"a Solutions Architect on the Alexa Skills Team",cityName:"yieldmo",twitter:"memodoring",saytwitter:"memo doring",slack:"memodoring",sayslack:"memo doring",linkedin:"https://www.linkedin.com/in/guillermodoring",saylinkedin:"guillermo doring",joinDate:"April 2016",gender:"m"},
        {firstName:"liz",lastName:"myers",title:"a Solutions Architect on the Alexa Skills Team",cityName:"DG",twitter:"lizmyers",saytwitter:"liz myers",slack:"lizmyers",sayslack:"liz myers",linkedin:"https://www.linkedin.com/in/lizmyers",saylinkedin:"liz myers",joinDate:"May 2016",gender:"f"},
        {firstName:"dean",lastName:"bryen",title:"an Alexa Echo",cityName:"davita",twitter:"deanbryen",saytwitter:"dean bryen",slack:"deanobalino",sayslack:"dean obalino",linkedin:"http://uk.linkedin.com/in/deanbryen",saylinkedin:"dean bryen",joinDate:"June 2016",gender:"m"},
        {firstName:"jen",lastName:"gilbert",title:"a Marketing Manager on the Alexa Skills team",cityName:"sportslabs",twitter:"thejengil",saytwitter:"the jengil",slack:"jengilbert",sayslack:"jen gilbert",linkedin:"https://www.linkedin.com/in/jenpaullgilbert/",saylinkedin:"jen paull gilbert",joinDate:"June 2016",gender:"f"},
        {firstName:"jen",lastName:"ellis",title:"a Marketing Manager on the Alexa Skills team",cityName:"yieldmo",twitter:"thejengil",saytwitter:"the jengil",slack:"jengilbert",sayslack:"jen gilbert",linkedin:"https://www.linkedin.com/in/jenpaullgilbert/",saylinkedin:"jen paull gilbert",joinDate:"June 2016",gender:"f"},
    ];*/
    //console.log("printing-->"+info);
    let scanningParameters = {
        TableName:'alexa_gorilla_people',
        Limit:100
    };

    docClient.scan(scanningParameters,function(err,data){
        if (err){
            //callback(err,null);
            console.log(err);
        }
        else{
            //callback(err,data);
            console.log(data);
            //people=info;
            people=data.Items;
            alexa.execute();
        }
    });
    //people=info;

};
//======================================================================================================
//TODO: Replace these text strings to edit the welcome and help messages
//======================================================================================================

var skillName = "Alexa Team Lookup";

//This is the welcome message for when a user starts the skill without a specific intent.
// var WELCOME_MESSAGE = "Welcome to  " + skillName + "! I can help you find Gorilla Team Members. " + getGenericHelpMessage(people);

var WELCOME_MESSAGE = "List a Gorilla Team Members. For example, " + getGenericHelpMessage(people)

//This is the message a user will hear when they ask Alexa for help in your skill.
var HELP_MESSAGE = "I can help you find Gorilla Team Members. "

//This is the message a user will hear when they begin a new search
var NEW_SEARCH_MESSAGE = getGenericHelpMessage(people);

//This is the message a user will hear when they ask Alexa for help while in the SEARCH state
var SEARCH_STATE_HELP_MESSAGE = getGenericHelpMessage(people);

var DESCRIPTION_STATE_HELP_MESSAGE = "Here are some things you can say: Tell me more, or give me his or her contact info";

var MULTIPLE_RESULTS_STATE_HELP_MESSAGE = "Sorry, please say the first and last name of the person you'd like to learn more about";

// This is the message use when the decides to end the search
var SHUTDOWN_MESSAGE = "Ok. Bye!.";

//This is the message a user will hear when they try to cancel or stop the skill.
var EXIT_SKILL_MESSAGE = "Ok.";

// =====================================================================================================
// ------------------------------ Section 2. Skill Code - Intent Handlers  -----------------------------
// =====================================================================================================
// CAUTION: Editing anything below this line might break your skill.
//======================================================================================================

var states = {
    SEARCHMODE: "_SEARCHMODE",
    DESCRIPTION: "_DESCRIPTION",
    MULTIPLE_RESULTS: "_MULTIPLE_RESULTS"
};

const newSessionHandlers = {
    "LaunchRequest": function() {
        this.handler.state = states.SEARCHMODE;
        this.emit(":ask", WELCOME_MESSAGE, getGenericHelpMessage(people));
    },
    "SearchByNameIntent": function() {
        console.log("SEARCH INTENT");
        this.handler.state = states.SEARCHMODE;
        this.emitWithState("SearchByNameIntent");
    },
    "TellMeMoreIntent": function() {
        this.handler.state = states.SEARCHMODE;
        // this.emitWithState("SearchByNameIntent");
        this.emit(":ask", WELCOME_MESSAGE, getGenericHelpMessage(people));
    },
    "TellMeThisIntent": function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState("SearchByNameIntent");
    },
    "SearchByInfoTypeIntent": function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState("SearchByInfoTypeIntent");
    },
    "AMAZON.YesIntent": function() {
        this.emit(":ask", getGenericHelpMessage(people), getGenericHelpMessage(people));
    },
    "AMAZON.NoIntent": function() {
        this.emit(":tell", SHUTDOWN_MESSAGE);
    },
    "AMAZON.RepeatIntent": function() {
        this.emit(":ask", HELP_MESSAGE, getGenericHelpMessage(people));
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = states.SEARCHMODE;
        var output = "Ok, starting over." + getGenericHelpMessage(people);
        this.emit(":ask", output, output);
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE + getGenericHelpMessage(people), getGenericHelpMessage(people));
    },
    "SessionEndedRequest": function() {
        this.emit("AMAZON.StopIntent");
    },
    "Unhandled": function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState("SearchByNameIntent");
    }
};
var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    "AMAZON.YesIntent": function() {
        this.emit(":ask", NEW_SEARCH_MESSAGE, NEW_SEARCH_MESSAGE);
    },
    "AMAZON.NoIntent": function() {
        this.emit(":tell", SHUTDOWN_MESSAGE);
    },
    "AMAZON.RepeatIntent": function() {
        var output;
        if(this.attributes.lastSearch){
            output = this.attributes.lastSearch.lastSpeech;
            console.log("repeating last speech");
        }
        else{
            output = getGenericHelpMessage(people);
            console.log("no last speech availble. outputting standard help message.");
        }
        this.emit(":ask",output, output);
    },
    "SearchByNameIntent": function() {
        searchByNameIntentHandler.call(this);
    },
    "SearchByCityIntent": function() {
        searchByCityIntentHandler.call(this);
    },
    "SearchByInfoTypeIntent": function() {
        searchByInfoTypeIntentHandler.call(this);
    },
    "TellMeThisIntent": function() {
        this.handler.state = states.DESCRIPTION;
        this.emitWithState("TellMeThisIntent");
    },
    "TellMeMoreIntent": function() {
        this.handler.state = states.DESCRIPTION;
        this.emitWithState("TellMeMoreIntent");
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", getGenericHelpMessage(people), getGenericHelpMessage(people));
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = states.SEARCHMODE;
        var output = "Ok, starting over." + getGenericHelpMessage(people);
        this.emit(":ask", output, output);
    },
    "SessionEndedRequest": function() {
        this.emit("AMAZON.StopIntent");
    },
    "Unhandled": function() {
        console.log("Unhandled intent in startSearchHandlers");
        this.emit(":ask", SEARCH_STATE_HELP_MESSAGE, SEARCH_STATE_HELP_MESSAGE);
    }
});
var multipleSearchResultsHandlers = Alexa.CreateStateHandler(states.MULTIPLE_RESULTS, {

    "AMAZON.StartOverIntent": function() {
        this.handler.state = states.SEARCHMODE;
        var output = "Ok, starting over." + getGenericHelpMessage(people);
        this.emit(":ask", output, output);
    },
    "AMAZON.YesIntent": function() {
        var output = "Hmm. I think you said - yes, but can you please say the name of the person you'd like to learn more about?";
        this.emit(":ask", output, output);
    },
    "AMAZON.NoIntent": function() {
        this.emit(":tell", SHUTDOWN_MESSAGE);
    },
    "AMAZON.RepeatIntent": function() {
        this.emit(":ask",this.attributes.lastSearch.lastSpeech, this.attributes.lastSearch.lastSpeech);
    },
    "SearchByNameIntent": function() {
        var slots = this.event.request.intent.slots;
        var firstName = isSlotValid(this.event.request, "firstName");
        var lastName = isSlotValid(this.event.request, "lastName");
        var cityName = isSlotValid(this.event.request, "cityName");
        var infoType = isSlotValid(this.event.request, "infoType");

        console.log("firstName:" + firstName);
        console.log("firstName:" + lastName);
        console.log("firstName:" + cityName);
        console.log("firstName:" + infoType);
        console.log("Intent Name:" + this.event.request.intent.name);

        var canSearch = figureOutWhichSlotToSearchBy(firstName,lastName,cityName);
        console.log("Multiple results found. canSearch is set to = " + canSearch);
        var speechOutput;

        if (canSearch)
        var searchQuery = slots[canSearch].value;
        var searchResults = searchDatabase(this.attributes.lastSearch.results, searchQuery, canSearch);
        var lastSearch;
        var output;

        if (searchResults.count > 1) { //multiple results found again
            console.log("multiple results were found again");
            this.handler.state = states.MULTIPLE_RESULTS;
            output = this.attributes.lastSearch.lastSpeech;
            this.emit(":ask",output, output);
        } else if (searchResults.count == 1) { //one result found
            this.attributes.lastSearch = searchResults;
            lastSearch = this.attributes.lastSearch;
            this.handler.state = states.DESCRIPTION;
            output = generateSearchResultsMessage(searchQuery,searchResults.results)
            this.attributes.lastSearch.lastSpeech = output;
            // this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
            this.emit(":ask", output, output);

        } else { //no match found
            lastSearch = this.attributes.lastSearch;
            var listOfPeopleFound = loopThroughArrayOfObjects(lastSearch.results);
            speechOutput = MULTIPLE_RESULTS_STATE_HELP_MESSAGE + ", " + listOfPeopleFound;
            this.emit(":ask", speechOutput, speechOutput);
        }
    },
    "SearchByCityIntent": function() {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState("SearchByCityIntent");
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", MULTIPLE_RESULTS_STATE_HELP_MESSAGE, MULTIPLE_RESULTS_STATE_HELP_MESSAGE);
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "SessionEndedRequest": function() {
        this.emit("AMAZON.StopIntent");
    },
    "Unhandled": function() {
        console.log("Unhandled intent in multipleSearchResultsHandlers");
        this.emit(":ask", MULTIPLE_RESULTS_STATE_HELP_MESSAGE, MULTIPLE_RESULTS_STATE_HELP_MESSAGE);
    }
});
var descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTION, {
    "TellMeMoreIntent": function() {
        var person;
        var speechOutput;
        var repromptSpeech;
        var cardContent;

        if(this.attributes.lastSearch){
            person = this.attributes.lastSearch.results[0];
            cardContent = generateCard(person); //calling the helper function to generate the card content that will be sent to the Alexa app.
            speechOutput = generateTellMeMoreMessage(person);
            repromptSpeech = "Would you like to find another Gorilla Member? Say yes or no";

            console.log("the contact you're trying to find more info about is " + person.firstName);
            this.handler.state = states.SEARCHMODE;
            this.attributes.lastSearch.lastSpeech = speechOutput;
            this.emit(":askWithCard", speechOutput, repromptSpeech, cardContent.title, cardContent.body, cardContent.image);
        }
        else{
            speechOutput = getGenericHelpMessage(people);
            repromptSpeech = getGenericHelpMessage(people);
            this.handler.state = states.SEARCHMODE;
            this.emit(":ask", speechOutput, repromptSpeech);
        }
    },
    "TellMeThisIntent": function() {
        var slots = this.event.request.intent.slots;
        var person = this.attributes.lastSearch.results[0];
        var infoType = isSlotValid(this.event.request, "infoType");
        var speechOutput;
        var repromptSpeech;
        var cardContent;

        console.log(isInfoTypeValid("slack"));

        if(this.attributes.lastSearch && isInfoTypeValid(infoType)){
            person =  this.attributes.lastSearch.results[0];
            cardContent = generateCard(person);
            speechOutput = generateSpecificInfoMessage(slots,person);
            repromptSpeech = "Would you like to find another Gorilla Team? Say yes or no";
            this.handler.state = states.SEARCHMODE;
            this.attributes.lastSearch.lastSpeech = speechOutput;
            this.emit(":askWithCard", speechOutput, repromptSpeech, cardContent.title, cardContent.body, cardContent.image);
        } else {
            //not a valid slot. no card needs to be set up. respond with simply a voice response.
            speechOutput = generateSearchHelpMessage(person.gender);
            repromptSpeech = "You can ask me - what's " + genderize("his-her", person.gender) + " twitter, or give me " + genderize("his-her", person.gender) + " slack username";
            this.attributes.lastSearch.lastSpeech = speechOutput;
            this.handler.state = states.SEARCHMODE;
            this.emit(":ask", speechOutput, repromptSpeech);
        }
    },
    "SearchByNameIntent": function() {
        searchByNameIntentHandler.call(this);
    },
    "SearchByCityIntent": function() {
        searchByCityIntentHandler.call(this);
    },
    "AMAZON.HelpIntent": function() {
        var slots = this.event.request.intent.slots;
        var person = this.attributes.lastSearch.results[0];
        this.emit(":ask", generateNextPromptMessage(person,"current"), generateNextPromptMessage(person,"current"));
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.NoIntent": function() {
        this.emit(":tell", SHUTDOWN_MESSAGE);
    },
    "AMAZON.YesIntent": function() {
        this.emit("TellMeMoreIntent");
    },
    "AMAZON.RepeatIntent": function() {
        this.emit(":ask",this.attributes.lastSearch.lastSpeech, this.attributes.lastSearch.lastSpeech);
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = states.SEARCHMODE;
        var output = "Ok, starting over." + getGenericHelpMessage(people);
        this.emit(":ask", output, output);
    },
    "SessionEndedRequest": function() {
        this.emit("AMAZON.StopIntent");
    },
    "Unhandled": function() {
        var slots = this.event.request.intent.slots;
        var person = this.attributes.lastSearch.results[0];

        console.log("Unhandled intent in DESCRIPTION state handler");
        this.emit(":ask", "Sorry, I don't know that" + generateNextPromptMessage(person,"general"), "Sorry, I don't know that" + generateNextPromptMessage(person,"general"));
    }
});

// ------------------------- END of Intent Handlers  ---------------------------------

function searchDatabase(peopleset, searchQuery, searchType) {
    var matchFound = false;
    var results = [];

    //beginning search
    for (var i = 0; i < peopleset.length; i++) {
        if (sanitizeSearchQuery(searchQuery) == peopleset[i][searchType]) {
            results.push(peopleset[i]);
            matchFound = true;
        }
        if ((i == peopleset.length - 1) && (matchFound == false)) {
            //this means that we are on the last record, and no match was found
            matchFound = false;
            console.log("no match was found using " + searchType);
            //if more than searchable items were provided, set searchType to the next item, and set i=0
            //ideally you want to start search with lastName, then firstname, and then cityName
        }
    }
    return {
        count: results.length,
        results: results
    };
}

function figureOutWhichSlotToSearchBy(firstName,lastName,cityName) {
    if (lastName){
        console.log("search by lastName");
        return "lastName";
    }
    else if (!lastName && firstName){
        console.log("search by firstName")
        return "firstName";
    }
    else if (!lastName && !firstName && cityName){
        console.log("search by Team Name")
        return "cityName";
    }
    else{
        return false;
        console.log("no valid slot provided. can't search.")
    }
}

function searchByNameIntentHandler(){
    var firstName = isSlotValid(this.event.request, "firstName");
    var lastName = isSlotValid(this.event.request, "lastName");
    var cityName = isSlotValid(this.event.request, "cityName");
    var infoType = isSlotValid(this.event.request, "infoType");
    var testingThis = testingThisFunction.call(this,"hello");

    var canSearch = figureOutWhichSlotToSearchBy(firstName,lastName,cityName);
    console.log("canSearch is set to = " + canSearch);

    if (canSearch){
        var searchQuery = this.event.request.intent.slots[canSearch].value;
        var searchResults = searchDatabase(people, searchQuery, canSearch);

        //saving lastSearch results to the current session
        var lastSearch = this.attributes.lastSearch = searchResults;
        var output;

        //saving last intent to session attributes
        this.attributes.lastSearch.lastIntent = "SearchByNameIntent";

        if (searchResults.count > 1) { //multiple results found
            console.log("Search complete. Multiple results were found");
            var listOfPeopleFound = loopThroughArrayOfObjects(lastSearch.results);
            output = generateSearchResultsMessage(searchQuery,searchResults.results) + listOfPeopleFound + ". would you like to list another Team Name?";
            this.handler.state = states.MULTIPLE_RESULTS; // change state to MULTIPLE_RESULTS
            this.attributes.lastSearch.lastSpeech = output;
            this.emit(":ask", output, output);
        } else if (searchResults.count == 1) { //one result found
            this.handler.state = states.DESCRIPTION; // change state to description
            console.log("one match was found");
            if (infoType) {
                //if a specific infoType was requested, redirect to specificInfoIntent
                console.log("infoType was provided as well")
                this.emitWithState("TellMeThisIntent");
            }
            else{
                console.log("no infoType was provided.")
                output = generateSearchResultsMessage(searchQuery,searchResults.results)
                this.attributes.lastSearch.lastSpeech = output;
                this.emit(":ask", output, output);
            }
        }
        else{//no match found
            console.log("no match found");
            console.log("searchQuery was  = " + searchQuery);
            console.log("searchResults.results was  = " + searchResults);
            output = generateSearchResultsMessage(searchQuery,searchResults.results)
            this.attributes.lastSearch.lastSpeech = output;
            // this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
            this.emit(":ask", output, output);
        }
    }
    else {
        console.log("no searchable slot was provided");
        console.log("searchQuery was  = " + searchQuery);
        console.log("searchResults.results was  = " + searchResults);

        this.emit(":ask", generateSearchResultsMessage(searchQuery,false), generateSearchResultsMessage(searchQuery,false));
    }
}

function searchByCityIntentHandler(){
    var slots = this.event.request.intent.slots;
    var cityName = isSlotValid(this.event.request, "cityName");

    if (cityName){
        var searchQuery = slots.cityName.value;
        console.log("will begin search with  " + slots.cityName.value + " in cityName");
        var searchResults = searchDatabase(people, searchQuery, "cityName");

        //saving lastSearch results to the current session
        var lastSearch = this.attributes.lastSearch = searchResults;
        var output;

        //saving last intent to session attributes
        this.attributes.lastSearch.lastIntent = "SearchByNameIntent";

        if (searchResults.count > 1) { //multiple results found
            console.log("Search completed by city. Multiple results were found");
            var listOfPeopleFound = loopThroughArrayOfObjects(lastSearch.results);
            output = generateSearchResultsMessage(searchQuery,searchResults.results) + listOfPeopleFound + ". Who would you like to learn more about?";
            //output = generateSearchResultsMessage(searchQuery,searchResults.count) + listOfPeopleFound + ". Who would you like to learn more about?";
            this.handler.state = states.MULTIPLE_RESULTS; // change state to MULTIPLE_RESULTS
            this.attributes.lastSearch.lastSpeech = output;
            this.emit(":ask", output, output);
        } else if (searchResults.count == 1) { //one result found
            console.log("one match found");
            this.handler.state = states.DESCRIPTION; // change state to description
            output = generateSearchResultsMessage(searchQuery,searchResults.results)
            this.attributes.lastSearch.lastSpeech = output;
            // this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
            this.emit(":ask", output, output);

        }
        else{//no match found
            console.log("no match found");
            console.log("searchQuery was  = " + searchQuery);
            console.log("searchResults.results was  = " + searchResults);
            output = generateSearchResultsMessage(searchQuery,searchResults.results)
            this.attributes.lastSearch.lastSpeech = output;
            // this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
            this.emit(":ask", output, output);

        }
    }
    else {
        console.log("no searchable slot was provided");
        console.log("searchQuery was  = " + searchQuery);
        console.log("searchResults.results was  = " + searchResults);

        this.emit(":ask", generateSearchResultsMessage(searchQuery,false), generateSearchResultsMessage(searchQuery,false));
    }
}

function searchByInfoTypeIntentHandler(){
    var slots = this.event.request.intent.slots;
    var firstName = isSlotValid(this.event.request, "firstName");
    var lastName = isSlotValid(this.event.request, "lastName");
    var cityName = isSlotValid(this.event.request, "cityName");
    var infoType = isSlotValid(this.event.request, "infoType");

    var canSearch = figureOutWhichSlotToSearchBy(firstName,lastName,cityName);
    console.log("canSearch is set to = " + canSearch);

    if (canSearch){
        var searchQuery = slots[canSearch].value;
        var searchResults = searchDatabase(people, searchQuery, canSearch);

        //saving lastSearch results to the current session
        var lastSearch = this.attributes.lastSearch = searchResults;
        var output;

        //saving last intent to session attributes
        this.attributes.lastSearch.lastIntent = "SearchByNameIntent";

        if (searchResults.count > 1) { //multiple results found
            console.log("multiple results were found");
            var listOfPeopleFound = loopThroughArrayOfObjects(lastSearch.results);
            output = generateSearchResultsMessage(searchQuery,searchResults.results) + listOfPeopleFound + ". Who would you like to learn more about?";
            this.handler.state = states.MULTIPLE_RESULTS; // change state to MULTIPLE_RESULTS
            this.attributes.lastSearch.lastSpeech = output;
            this.emit(":ask", output, output);
        } else if (searchResults.count == 1) { //one result found
            this.handler.state = states.DESCRIPTION; // change state to description
            console.log("one match was found");
            if (infoType) {
                //if a specific infoType was requested, redirect to specificInfoIntent
                console.log("infoType was provided as well")
                var person = this.attributes.lastSearch.results[0];
                var cardContent = generateCard(person);
                var speechOutput = generateSpecificInfoMessage(slots,person);
                var repromptSpeech = "Would you like to find another Gorilla Team? Say yes or no";
                this.attributes.lastSearch.lastSpeech = speechOutput;
                this.handler.state = states.SEARCHMODE;
                this.emit(":askWithCard", speechOutput, repromptSpeech, cardContent.title, cardContent.body, cardContent.image);
                // this.emitWithState("TellMeThisIntent");
            }
            else{
                console.log("no infoType was provided.")
                output = generateSearchResultsMessage(searchQuery,searchResults.results)
                this.attributes.lastSearch.lastSpeech = output;
                // this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
                this.emit(":ask", output, output);
            }
        }
        else{//no match found
            console.log("no match found");
            console.log("searchQuery was  = " + searchQuery);
            console.log("searchResults.results was  = " + searchResults);
            output = generateSearchResultsMessage(searchQuery,searchResults.results)
            this.attributes.lastSearch.lastSpeech = output;
            // this.emit(":ask", generateSearchResultsMessage(searchQuery,searchResults.results));
            this.emit(":ask", output, output);
        }
    }
    else {
        console.log("no searchable slot was provided");
        console.log("searchQuery was  = " + searchQuery);
        console.log("searchResults.results was  = " + searchResults);

        this.emit(":ask", generateSearchResultsMessage(searchQuery,false), generateSearchResultsMessage(searchQuery,false));
    }
}
// =====================================================================================================
// ------------------------------- Section 3. Generating Speech Messages -------------------------------
// =====================================================================================================

function generateNextPromptMessage(person,mode){
    //var infoTypes = ["slack username","linked-in"]
    var infoTypes = ["slack username"]
    var prompt;

    if (mode == "current"){
        // if the mode is current, we should give more informaiton about the current contact
        prompt = ". You can say - tell me more, or  tell me " + genderize("his-her", person.gender) + " " + infoTypes[getRandom(0,infoTypes.length-1)];
    }
    //if the mode is general, we should provide general help information
    else if (mode == "general"){
        prompt = ". " + getGenericHelpMessage(people);
    }
    return prompt;
}

function generateSendingCardToAlexaAppMessage(person,mode){
    var sentence = "I have sent " + person.firstName + "'s contact card to your Alexa app" + generateNextPromptMessage(person,mode);
    return sentence;
}

function generateSearchResultsMessage(searchQuery,results){
    var sentence;
    var details;
    var prompt;

    if (results){
        switch (true) {
            case (results.length == 0):
            sentence = "Hmm. I couldn't find people in " + searchQuery + ". You can list another team like, " + getRandomCity(people);
            break;
            case (results.length == 1):
            var person = results[0];
            details = person.firstName + " " + person.lastName + " is " + person.title + ", working for " + person.cityName
            prompt = generateNextPromptMessage(person,"current");
            sentence = details + prompt
            console.log(sentence);
            break;
            case (results.length > 1):
            sentence = "I found " + results.length + " matching results";
            break;
        }
    }
    else{
        sentence = "Sorry, I didn't quite get that. " + getGenericHelpMessage(people);
    }
    return sentence;
}

function getGenericHelpMessage(people){
    //var sentences = ["ask - who is " + getRandomName(people),"say - find an Gorilla Team like, " + getRandomCity(people)];
    //var sentences = ["ask - who is in " + getRandomCity(people)];
var sentences = ["ask - who is in sportslabs"];
    return "You can " + sentences[getRandom(0,sentences.length-1)]
}

function generateSearchHelpMessage(gender){
    var sentence = "Sorry, I don't know that. You can ask me - what's " + genderize("his-her", gender) +" twitter, or give me " + genderize("his-her", gender) + " Slack! username";
    return sentence;
}

function generateTellMeMoreMessage(person){
    var sentence = person.firstName + " joined Gorilla Logic on " + person.joinDate + ". " + genderize("his-her", person.gender) + " Slack! username is " + person.sayslack; // + " . " + generateSendingCardToAlexaAppMessage(person,"general");
    return sentence;
}
function generateSpecificInfoMessage(slots,person){
    var infoTypeValue;
    var sentence;

    if (slots.infoType.value == "git hub"){
        infoTypeValue = "slack";
        console.log("resetting gith hub to slack");
    }
    else{
        console.log("no reset required for slack");
        infoTypeValue = slots.infoType.value;
    }

    //sentence = person.firstName + "'s " + infoTypeValue.toLowerCase() + " is - " + person["say" + infoTypeValue.toLowerCase()] + " . Would you like to find another Gorilla Team? " + getGenericHelpMessage(people);
    sentence = person.firstName + "'s " + infoTypeValue.toLowerCase() + " is - " + person["say" + infoTypeValue.toLowerCase()] + " . Would you like to find another Gorilla Team Member? ";
    return optimizeForSpeech(sentence);
}



// =====================================================================================================
// ------------------------------------ Section 4. Helper Functions  -----------------------------------
// =====================================================================================================
// For more helper functions, visit the Alexa cookbook at https://slack.com/alexa/alexa-cookbook
//======================================================================================================

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomCity(arrayOfStrings) {
        return arrayOfStrings[getRandom(0, people.length - 1)].cityName;
}

function getRandomName(arrayOfStrings) {
    var randomNumber = getRandom(0, people.length - 1)
    return arrayOfStrings[randomNumber].firstName + " " + arrayOfStrings[randomNumber].lastName;
}

function titleCase(str) {
    return str.replace(str[0], str[0].toUpperCase());
}

function slowSpell(str) {
    return "That's spelled - " + str.split("").join("<break time=\"0.05s\"/>");
}

function generateCard(person) {
    var cardTitle = "Contact Info for " + titleCase(person.firstName) + " " + titleCase(person.lastName);
    var cardBody = "Twitter: " + "@" + person.twitter + " \n" + "GitHub: " + person.slack + " \n" + "LinkedIn: " + person.linkedin;
    var imageObj = {
        smallImageUrl: "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/team-lookup/avatars/" + person.firstName + "._TTH_.jpg",
        largeImageUrl: "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/team-lookup/avatars/" + person.firstName + "._TTH_.jpg",
    };
    return {
        "title": cardTitle,
        "body": cardBody,
        "image": imageObj
    };
}

function loopThroughArrayOfObjects(arrayOfStrings) {
    var joinedResult = "";
    // Looping through the each object in the array
    for (var i = 0; i < arrayOfStrings.length; i++) {
        //concatenating names (firstName + lastName ) for each item
        joinedResult = joinedResult + ", " + arrayOfStrings[i].firstName + " " + arrayOfStrings[i].lastName;
    }
    return joinedResult;
}

function genderize(type, gender) {
    var pronouns ={
        "m":{"he-she":"he","his-her":"his","him-her":"him"},
        "f":{"he-she":"she","his-her":"her","him-her":"her"}
    };
    return pronouns[gender][type];
}

function sanitizeSearchQuery(searchQuery){
    searchQuery = searchQuery.replace(/’s/g, "").toLowerCase();
    searchQuery = searchQuery.replace(/'s/g, "").toLowerCase();
    return searchQuery;
}

function optimizeForSpeech(str){
    var optimizedString = str.replace("slack","slack");
    return optimizedString;
}

function isSlotValid(request, slotName){
    var slot = request.intent.slots[slotName];
    //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
    var slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        slotValue = slot.value.toLowerCase();
        return slotValue;
    } else {
        //we didn't get a value in the slot.
        return false;
    }
}



function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function isInfoTypeValid(infoType){
    var validTypes = ["git hub","slack","twitter","linkedin"]
    return isInArray(infoType,validTypes);
}

function testingThisFunction(str){
    console.log("printing " + str);
}
