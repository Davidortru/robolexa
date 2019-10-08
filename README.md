# robolexa
Development of a conversational system for service robots using Amazon Alexa.

In this project, the virtual assistant Amazon Alexa is used to create a conversational system that can be integrated in a service robot. A skill is developed in which the conversation that takes place is the explanation of several recipes step by step. This dialog captures the user answers on the Amazon developer console, and the questions the system asks (logic programming), running on a computer. For that, the open source enviroment Jovo framework is used in the creation of the project, and the interpreted programming language JavaScript. This conversational system is integrated into ROS through a websocket, rosbridge, which allows to call a service that controls a mobile robot, using the roslibjs library. All this system formed by the logic programming and the skill, with the code for its communication in ROS, is integrated into a mobile service robot by the University of Malaga.

For this system to work, it is needed:

- To create a new custom skill in the Alexa Developer Console.

- To paste either the spanish version [Dorota(ES)] or the english version [Dorota] at the JSON EDITOR section.

- To create a new project in a computer with the JOVO system install.

- To replace the app.js file in the src folder by either the english version [v_inglesa.js] or the spanish one [v_espanola.js] changing the name back to app.js.
