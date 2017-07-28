var Alexa = require('alexa-sdk');

var   completeHelp = 'Here\'s some things you can say,'
        + ' What is Alexa. <break time=\"200ms\"/>'
        + ' What is an Alexa Skill. <break time=\"200ms\"/>'
        + ' What is Alexa Skills Kit. <break time=\"200ms\"/>'
        + ' and exit.';
var okWheneverYouAreReadyYouCanAskMeAbout = 'Okay. Whenever you\'re ready, you can ask me more questions. ';
var helpAnythingElseMore = 'Would you like me to help you with anything else?';
var sorryDidNotFollowQuestion = 'Sorry, I did not follow the question. ';
var sayHelpAtAnyTime ="Say the word help anytime you need me.";
var askMe = 'Ask me ';

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
    'LaunchRequest': function () {
    this.emit(':ask', "Hi Gorillas! <break time=\"200ms\"/> welcome to Alexa lunch and learn session. You can ask me anything about Alexa", sayHelpAtAnyTime);
    },
    'WhatIsAlexa': function () {
        var whatIsAlexaResponse = 'Alexa is Amazon’s voice service and the brain behind millions of devices like the Amazon Echo, Echo Dot and more. <break time=\"200ms\"/>'
                                + 'Alexa has the ability to play music, answer general questions, set an alarm or timer and more.';
        
        this.emit(':ask', whatIsAlexaResponse, askMe + 'why Alexa?');
    },
    'WhyAlexa': function () {
        var whyAlexaResponse = 'Alexa is built in the cloud, so it is always getting smarter. The more customers use Alexa, the more she adapts to speech patterns, vocabulary, and personal preferences. With Alexa, developers can build new voice experiences and take many advantages.';
        
        this.emit(':ask', whyAlexaResponse, askMe + 'what is an alexa skill?');
    },
    'WhatIsAnAlexaSkill': function () {
        var whatIsAnAlexaResponse = 'Alexa provides capabilities, or skills, that enable customers to create a more personalized experience. There are now more than 15,000 skills from companies like Starbucks, Uber, and Capital One as well as innovative designers and developers.';
        
        this.emit(':ask', whatIsAnAlexaResponse, askMe + ' what is an alexa ski kit?');
    },
    'WhatIsAlexaSkillKit': function () {
        var whatIsAlexaSkillKitResponse = 'Alexa Skill Kit is a collection of self-service APIs, tools, documentation, and code samples that makes it fast and easy for you to add skills to Alexa. <break time=\"200ms\"/>'
                                        + 'With the Alexa Skill Kit, designers, developers, and brands can build engaging skills and reach millions of customers. <break time=\"200ms\"/>'
                                        + 'With Alexa Skill Kit, you can leverage Amazon’s knowledge and pioneering work in the field of voice design.';
        
        this.emit(':ask', whatIsAlexaSkillKitResponse, askMe + 'what kind of skill I can build?');
    },
    'WhatKindOfSkillICanBuild': function () {
        var whatKindOfSkillICanBuildResponse = 'Custom Skill. <break time=\"200ms\"/>'
                                + 'Smart Home Skill. <break time=\"200ms\"/>'
                                + 'Video Skill.';
        
        this.emit(':ask', whatKindOfSkillICanBuildResponse, askMe + 'about Custom skill?');
    },
    'TellMeMoreAboutCustomSkill': function () {
        var tellMeMoreAboutCustomSkillResponse = 'It is a skill that can handle just about any type of request <break time=\"200ms\"/>'
                                + 'You define the requests the skill can handle and the words users say to invoke those requests. <break time=\"200ms\"/>'
                                + 'For example. <break time=\"200ms\"/>'
                                + 'Look up information from a web service <break time=\"200ms\"/>'
                                + 'Integrate with a web service to order something. Like order a car from Uber, order a pizza from Domino’s Pizza. <break time=\"200ms\"/>'
                                + 'Interactive games. <break time=\"200ms\"/>'
                                + 'Just about anything else you can think of <break time=\"200ms\"/>';
        
        this.emit(':ask', tellMeMoreAboutCustomSkillResponse, askMe + 'Smart Home Skill?');
    },
    'TellMeMoreAboutSmartHomeSkill': function () {
        var tellMeMoreAboutSmartHomeSkillResponse = 'It is a skill that lets a user control cloud-enabled smart home devices such as lights and thermostats. <break time=\"200ms\"/>'
                                + 'The Smart Home Skill defines the requests the skill can handle  and the words users say to invoke those requests. <break time=\"200ms\"/>'
                                + 'For example. <break time=\"200ms\"/>'
                                + 'Turn lights on and off <break time=\"200ms\"/>'
                                + 'Change the brightness of dimmable lights <break time=\"200ms\"/>'
                                + 'Change the temperature on a thermostat';
        
        this.emit(':ask', tellMeMoreAboutSmartHomeSkillResponse, askMe + 'about Video Skill?');
    },
    'TellMeMoreAboutVideoSkill': function () {
        var tellMeMoreAboutVideoSkillResponse = 'It is a skill that lets a user control cloud-enabled video services <break time=\"200ms\"/>'
                                + 'The Video Skill API defines the requests the skill can handle and the words users say to invoke those requests <break time=\"200ms\"/>'
                                + 'For example. <break time=\"200ms\"/>'
                                + 'Play a movie <break time=\"200ms\"/>'
                                + 'Find a TV show <break time=\"200ms\"/>'
                                + 'Change a channel';
        
        this.emit(':ask', tellMeMoreAboutVideoSkillResponse, helpAnythingElseMore);
    }, 
    'AlexaThanks': function(){
        this.emit(':tell' ,"Bye. See you next time!");
    },  
    'AMAZON.NoIntent': function () {
        this.emit(':tell', "thank you","");
    },
    'Unhandled': function () {
        this.emit(':tell', sorryDidNotFollowQuestion + textHelper);
    },
    'AMAZON.StopIntent': function(){
        this.emit(':tell' ,okWheneverYouAreReadyYouCanAskMeAbout);
    },
    'AMAZON.HelpIntent': function(){
         this.emit(':ask' , completeHelp + ' So, how can I help?', 'How can I help?');
    }

};
