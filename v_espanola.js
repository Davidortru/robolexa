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
      recipe: 'Pasta cremosa con pimientos y pollo.',
      
      ingredients: ' Los ingredientes son: 2 litros de agua, 250 gramos de la pasta que más te guste, 1 cucharada de aceite de oliva, laurel, sal, pimiento rojo, pollo y mantequilla.',
      
      step1: ' Hierve la pasta con las hojas de laurel y la sal durante 8 minutos.',
              
      step2: ' Cocina los pimientos junto con la pechuga de pollo, sazona con la sal. Corta la pechuga y reserva.',
              
      step3: ' Bate los pimientos con la mantequilla.',
              
      step4: ' Añade la guarnición a la pasta cocida.',
              
      step5: ' Añade el queso parmesano.',
              
      step6: ' Sirve con perejil fresco.'
    },
    {
      recipe: 'Pasta con Pollo y Setas.',
      
      ingredients: ' Los ingredientes son: Caldo de Pollo, pechuga de pollo , 200 gramos de pasta, una taza de leche desnatada, setas cortadas en tiras delgadas, margarina sin sal.',
              
      step1: ' Derretir la margarina y cocinar el pollo hasta que esté doradito.',
              
      step2: ' Cocer la pasta hasta que estén al dente.',
              
      step3: ' Agregar las setas al pollo y cocinar un par de minutos.',
              
      step4: ' Verter la leche junto con el caldo de pollo',
              
      step5: ' Cocer durante 10 minutos. Agregar e integrar la pasta.',
              
      step6: ' Retirar y servir con un chorrito de lima justo antes de comer.'
    }];

var deck = flashcards.length;

var num = Math.floor(Math.random()*deck);

var i=0;

var ROSLIB = require('roslib');

var ros = new ROSLIB.Ros({
     url : 'ws://localhost:9090'
 });


 ros.on('connection', function() {
       console.log('Conectado al servidor web.');
     });
   
     ros.on('error', function(error) {
       console.log('Error conectando al servidor web: ', error);
     });
   
     ros.on('close', function() {
       console.log('Conexion con el servidor web cerrada.');
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
  data: "La skill se esta ejecutando, abre asistente dorota para empezar."
  
});
topic_alexa.publish(msg);

var mssg=new ROSLIB.Message({
  data: "Esperando una orden."
  
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
        this.ask('Bienvenido a Dorota, ¿cuál es tu nombre?', 'Por favor dime tu nombre.');
        
        var msg=new ROSLIB.Message({
  	    data: "Bienvenido a Dorota, cual es tu nombre?"
	    });
	    topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Bienvenido a Dorota, ¿cuál es tu nombre?']
     	});
   
     	dorotaService.callService(request, function(result) { });
	
    },

    MyNameIntent() {
        this.ask('¡Hola ' + this.$inputs.names.value + ', encantada de conocerte! ¿Qué te gustaría hacer?', 'Lo siento no te he entendido, ¿qué quieres que haga?');
        
        var msg=new ROSLIB.Message({
  	    data: "Hola " + this.$inputs.names.value + ", encantada de conocerte! Que te gustaria hacer?"
	    });
	    topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['¡Hola ' + this.$inputs.names.value + ', encantada de conocerte! ¿Qué te gustaría hacer?', 'Lo siento no te he entendido, ¿qué quieres que haga?']
     	});
   
     	dorotaService.callService(request, function(result) { });
    
    },
    AnswerIntent() {
	if (this.$inputs.answer.value == "receta") {
        this.ask('Vale, tengo varias recetas de pasta. Di vamos a comer para empezar una aleatoriamente o lista para ver las disponibles.');

	var msg=new ROSLIB.Message({
  	data: "Vale, tengo varias recetas de pasta. Di vamos a comer para empezar una aleatoriamente o lista para ver las disponibles."
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Vale, tengo varias recetas de pasta. Di vamos a comer para empezar una aleatoriamente o lista para ver las disponibles.']
     	});
	
	dorotaService.callService(request, function(result) { });

	} else {
	this.ask('Lo siento no puedo hacer eso, puedo ofrecerte una receta de comida, di vamos a comer, o di adiós para terminar nuestra conversación.');

	var msg=new ROSLIB.Message({
  	data: "Lo siento no puedo hacer eso, puedo ofrecerte una receta de comida, di vamos a comer, o di adios para terminar nuestra conversacion."
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Lo siento no puedo hacer eso, puedo ofrecerte una receta de comida, di vamos a comer, o di adiós para terminar nuestra conversación.']
     	});

	dorotaService.callService(request, function(result) { });

	}
    },
    MealIntent() {
	
	var receta = flashcards[num].recipe;
	var ingre = flashcards[num].ingredients;
	
	if (this.$inputs.meal.value == "vamos a comer") {
        this.ask('Todas mis recetas son para cuatro personas. Esta es ' + receta + ingre);

	var msg=new ROSLIB.Message({
  	data: "Todas mis recetas son para cuatro personas. Esta es " + receta + ingre
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Todas mis recetas son para cuatro personas. Esta es ' + receta + ingre]
     	});

	dorotaService.callService(request, function(result) { });

	} else if (this.$inputs.meal.value == "lista") {
	this.ask('Mis recetas son: ' + flashcards[0].recipe +' y '+ flashcards[1].recipe); 

	var msg=new ROSLIB.Message({
  	data: "Mis recetas son: " + flashcards[0].recipe +' y '+ flashcards[1].recipe
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Mis recetas son: ' + flashcards[0].recipe +' y '+ flashcards[1].recipe]
     	});	

	dorotaService.callService(request, function(result) { });
	
	} else {
	this.tell('Siento no poder ayudarte. Ha sido un placer hablar contigo, espero ser de ayuda la próxima vez. Hablamos pronto.');
	
	var msg=new ROSLIB.Message({
  	data: "Siento no poder ayudarte. Ha sido un placer hablar contigo, espero ser de ayuda la proxima vez. Hablamos pronto."
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Siento no poder ayudarte. Ha sido un placer hablar contigo, espero ser de ayuda la próxima vez. Hablamos pronto.']
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
	if (this.$inputs.cont.value == "continúa") {
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

	}else {
	this.tell('La receta se ha acabado, espero que la disfrutes, hasta luego.');

	var msg=new ROSLIB.Message({
  	data: "La receta se ha acabado, espero que la disfrutes, hasta luego."
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['La receta se ha acabado, espero que la disfrutes, hasta luego.']
     	});

	dorotaService.callService(request, function(result) { });

	i=0;}
	}
    },
	ActionIntent() {
        if (this.$inputs.action.value == "ve") {
        this.ask('Vale, ahora mismo.');

	var msg=new ROSLIB.Message({
  	data: "Vale, ahora mismo."
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 7,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Vale, ahora mismo.']
     	});

	dorotaService.callService(request, function(result) { });

	var mssg=new ROSLIB.Message({
  	data: "Orden realizada."
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
		task_args: ['¡Chicos vamos a comer!']
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

        if (this.$inputs.hour.value == "hora") {
        this.ask('Son las ' + hours + ':' + minutes + ':' + seconds);

	var msg=new ROSLIB.Message({
  	data: "Son las " + hours + ":" + minutes + ":" + seconds
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Son las ' + hours + ':' + minutes + ':' + seconds]
     	});

	dorotaService.callService(request, function(result) { });

	}else if (this.$inputs.hour.value == "fecha" || "dia"){
	this.ask('Hoy es ' + today);

	var msg=new ROSLIB.Message({
  	data: "Hoy es " + today
	});
	topic_alexa.publish(msg);

	var request = new ROSLIB.ServiceRequest({
       		task_name : 'say',
       		task_priority : 5,
		task_permanence: false,
		task_impact: 'none',
		task_args: ['Hoy es ' + today]
     	});

	dorotaService.callService(request, function(result) { });

	}

    	},
});

module.exports.app = app;
