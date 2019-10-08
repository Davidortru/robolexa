'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

//GLOBAL VARIABLES

var flashcards = [
    {
      recipe: 'Pulled Pork Mac N Cheese with Barbecue Spices and Scallions.',
      
      ingredients: ' The ingredients are: 4 scallions, 12 ounces of cavatappi pasta, 20 ounces of pulled pork, 2 tablespoons of flour, 13 and a half ounces of milk, 2 tablespoons of sweetand smoky BBQ seasoning, 4 ounces of cream cheese, 4 cups of mexican cheese blend and 2 teaspoons of hot sauce. You would also need a medium pot, a strainer and a large pan.',
      
      step1: ' Bring a medium pot of salted water to a boil. Wash and dry scallions, then trim and thinly slice, separating greens and whites.',
              
      step2: ' Once water boils, add cavatappi to pot. Cook until al dente, 8-10 minutes. Scoop out and reserve 1 cup pasta cooking water, then drain.',
              
      step3: ' Meanwhile, tear pork into smaller, bite-sized pieces. Heat a large drizzle of oil in a large pan over medium-high heat. Add pork and a large pinch of salt and pepper. Cook, stirring a few times, until pork begins to brown, 4-5 minutes. Stir in scallion whites and cook 30 seconds. Transfer to a plate.',
              
      step4: ' After draining cavatappi, lower heat under pan used for pork to medium and add 4 tablespoons butter. Once melted, stir in flour and cook 30 seconds. Slowly whisk in milk, reserved pasta cooking water, barbecue seasoning, and a few pinches of salt and pepper. Bring to a simmer, then let bubble until just thickened, 1-2 minutes.',
              
      step5: ' Remove pan from heat and add cream cheese and Mexican cheese, stirring until smooth. Stir in cavatappi and pork to combine. Season with salt and pepper.',
              
      step6: ' Divide pasta between plates. Garnish with scallion greens and hot sauce (to taste).'
    },
    {
      recipe: 'One-Pot Cheese Tortelloni with Kale and Heirloom Grape Tomatoes.',
      
      ingredients: ' The ingredients are: 8 ounces of kale, 8 ounces of heirloom grape tomatoes, 2 lemons, 4 cloves of garlic, 18 ounces of cheese tortelloni, 2 teaspoons of chili flakes, half cup of parmesan cheese. You would also need a large pot, a strainer and a zester.',
              
      step1: ' Wash and dry all produces. Bring a large pot of salted water to a boil. Remove large ribs and stems from kale; tear or chop leaves into 1-inch pieces. Halve tomatoes lengthwise. Mince or grate garlic. Zest 1 tsp zest from lemon, then cut into quarters.',
              
      step2: ' Once water boils, add tortelloni to pot. Cook, stirring occasionally, until tender, 3-5 minutes. Reserve half cup cooking water, then drain.',
              
      step3: ' After draining tortelloni, heat a large drizzle of olive oil in same pot over medium-high heat. Add kale and cook, tossing, until tender, 3-4 minutes (TIP: Add a splash of water if leaves won’t soften.) Season with salt and pepper.',
              
      step4: ' Add tomatoes, garlic, and chili flakes to pot with kale. (TIP: Add the chili flakes to taste—start with a pinch and go up from there). Cook, tossing, until fragrant, 1-2 minutes. Season with salt and pepper.',
              
      step5: ' Add tortelloni, 2 tablespoons reserved cooking water, and 2 tablespoons butter to pot with veggies and toss to combine. Stir in a squeeze or two of lemon. Season with salt and pepper.',
              
      step6: ' Divide pasta between bowls. Sprinkle with Parmesan, lemon zest, and any remaining chili flakes, to taste. Serve with remaining lemon quarters for squeezing over.'
    }];

var deck = flashcards.length;

var num = Math.floor(Math.random()*deck);

var i=0;

var ROSLIB = require('roslib');

var ros = new ROSLIB.Ros({
     url : 'ws://localhost:9090'
 });


 ros.on('connection', function() {
       console.log('Connected to websocket server.');
     });
   
     ros.on('error', function(error) {
       console.log('Error connecting to websocket server: ', error);
     });
   
     ros.on('close', function() {
       console.log('Connection to websocket server closed.');
     });
  
     
       var topic_alexa = new ROSLIB.Topic({
    ros : ros,
    name : '/topic_alexa',
    messageType : 'std_msgs/String'
  });

       var topic_action = new ROSLIB.Topic({
    ros : ros,
    name : '/topic_action',
    messageType : 'std_msgs/String'
  });
       
       
var msg=new ROSLIB.Message({
  data: "The skill is running, open assistant dorota to start."
  
});
topic_alexa.publish(msg);

var mssg=new ROSLIB.Message({
  data: "Waiting for a command."
  
});
topic_action.publish(mssg);

var dorotaService = new ROSLIB.Service({
     ros : ros,
     name : 'bt_manager/add_new_task',
     serviceType : 'bt_manager/AddTask'
});

// CONVERSATION

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Welcome to Dorota! What\'s your name?', 'Please tell me your name.');
        
        var msg=new ROSLIB.Message({
  	    data: "Welcome to Dorota! What\'s your name?"
	    });
	    topic_alexa.publish(msg);
	    
	    var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		    task_permanence: false,
		    task_impact: 'none',
		    task_args: ['Welcome to Dorota! What\'s your name?']
     	});
   
     	dorotaService.callService(request, function(result) { });
    },

    MyNameIntent() {
        this.ask('Hey ' + this.$inputs.names.value + ', nice to meet you! What would you like to do?', 'Sorry, I didn\'t understand you, what would you like me to do?');
        
        var msg=new ROSLIB.Message({
  	    data: "Hey " + this.$inputs.names.value + ", nice to meet you! What would you like to do?"
	    });
	    topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Hey ' + this.$inputs.names.value + ', nice to meet you! What would you like to do?', 'Sorry, I didn\'t understand you, what would you like me to do?']
     	});
	
	dorotaService.callService(request, function(result) { });

    
    },
    AnswerIntent() {
	if (this.$inputs.answer.value == "recipe") {
        this.ask('Okay, I have several recipes of pasta. Say let\'s eat to get one randomly or list to know the available ones.');

	var msg=new ROSLIB.Message({
  	data: "Okay, I have several recipes of pasta. Say let\'s eat to get one randomly or list to know the available ones."
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Okay, I have several recipes of pasta. Say let\'s eat to get one randomly or list to know the available ones.']
     	});
	
	dorotaService.callService(request, function(result) { });


	} else {
	this.ask('Sorry I can\'t do that, I can offer you a pasta recipe, say let\'s eat or say bye to end our conversation.');

	var msg=new ROSLIB.Message({
  	data: "Sorry I can\'t do that, I can offer you a pasta recipe, say let\'s eat or say bye to end our conversation."
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Sorry I can\'t do that, I can offer you a pasta recipe, say let\'s eat or say bye to end our conversation.']
     	});
	
	dorotaService.callService(request, function(result) { });


	}
    },
    MealIntent() {
	
	var receta = flashcards[num].recipe;
	var ingre = flashcards[num].ingredients;
	
	//loop para decir todas las recetas? for (let i=0; i!=deck; i++){flashcards[i].recipe};	
	
	if (this.$inputs.meal.value == "lets eat") {
        this.ask('All of my recipes are for 4 people. This is ' + receta + ingre);

	var msg=new ROSLIB.Message({
  	data: "All of my recipes are for 4 people. This is " + receta + ingre
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['All of my recipes are for 4 people. This is ' + receta + ingre]
     	});
	
	dorotaService.callService(request, function(result) { });


	} else if (this.$inputs.meal.value == "list") {
	this.ask('My recipes are: ' + flashcards[0].recipe +' And '+flashcards[1].recipe); 

	var msg=new ROSLIB.Message({
  	data: "My recipes are: " + flashcards[0].recipe +' And '+flashcards[1].recipe
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['My recipes are: ' + flashcards[0].recipe +' And '+flashcards[1].recipe]
     	});
	
	dorotaService.callService(request, function(result) { });
	
	
	} else {
	this.tell('Sorry I can\'t help you. It has been a pleasure talking to you, I hope I can help next time. Talk to you soon.');
	
	var msg=new ROSLIB.Message({
  	data: "Sorry I can\'t help you. It has been a pleasure talking to you, I hope I can help next time. Talk to you soon."
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Sorry I can\'t help you. It has been a pleasure talking to you, I hope I can help next time. Talk to you soon.']
     	});
	
	dorotaService.callService(request, function(result) { });

	
	}
    },
    ContIntent() {
		
	i=i+1;
	var s1 = flashcards[num].step1;
	var s2 = flashcards[num].step2;
	var s3 = flashcards[num].step3;
	var s4 = flashcards[num].step4;
	var s5 = flashcards[num].step5;
	var s6 = flashcards[num].step6;
	//console.log(i); ver por pantalla
	if (this.$inputs.cont.value == "got it") {
	if (i==1) {
	this.ask(s1);

	var msg=new ROSLIB.Message({
  	data: s1
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: [s1]
     	});
	
	dorotaService.callService(request, function(result) { });
	

	} else if (i==2) {
	this.ask(s2);

	var msg=new ROSLIB.Message({
  	data: s2
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: [s2]
     	});
	
	dorotaService.callService(request, function(result) { });


	} else if (i==3) {
	this.ask(s3);

	var msg=new ROSLIB.Message({
  	data: s3
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: [s3]
     	});
	
	dorotaService.callService(request, function(result) { });


	} else if (i==4) {
	this.ask(s4);

	var msg=new ROSLIB.Message({
  	data: s4
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: [s4]
     	});
	
	dorotaService.callService(request, function(result) { });


	} else if (i==5) {
	this.ask(s5);

	var msg=new ROSLIB.Message({
  	data: s5
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: [s5]
     	});
	
	dorotaService.callService(request, function(result) { });


	} else if (i==6) {
	this.ask(s6);

	var msg=new ROSLIB.Message({
  	data: s6
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: [s6]
     	});
	
	dorotaService.callService(request, function(result) { });


	}else {
	this.tell('The recipe is over, I hope you enjoy it, bye bye');

	var msg=new ROSLIB.Message({
  	data: "The recipe is over, I hope you enjoy it, bye bye"
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['The recipe is over, I hope you enjoy it, bye bye']
     	});
	
	dorotaService.callService(request, function(result) { });


	i=0;}
	}
    },
	ActionIntent() {
        if (this.$inputs.action.value == "go") {
        this.ask('Okay, coming right up');

	var msg=new ROSLIB.Message({
  	data: "Okay, coming right up"
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 7,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Okay, coming right up']
     	});
	
	dorotaService.callService(request, function(result) { });


	var mssg=new ROSLIB.Message({
  	data: "Command made"
	});
	topic_action.publish(mssg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'go_to_point',
       		task_priority : 6,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['goal']['[-6.57,-4.96,0]']
     	});

	dorotaService.callService(request, function(result) { });

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Let\'s eat people!']
     	});

	dorotaService.callService(request, function(result) { });

	}

    },
	HourIntent() {

	var now = new Date();
	var today = now.toDateString();
	var hours = now.getHours();
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();

        if (this.$inputs.hour.value == "time") {
        this.ask('It is ' + hours + ':' + minutes + ':' + seconds);

	var msg=new ROSLIB.Message({
  	data: "It is " + hours + ":" + minutes + ":" + seconds
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['It is ' + hours + ':' + minutes + ':' + seconds]
     	});
	
	dorotaService.callService(request, function(result) { });


	}else if (this.$inputs.hour.value == "date" || "day"){
	this.ask('It is ' + today);

	var msg=new ROSLIB.Message({
  	data: "It is " + today
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['It is ' + today]
     	});
	
	dorotaService.callService(request, function(result) { });


	}

    	},
});

module.exports.app = app;
