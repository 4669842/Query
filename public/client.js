// client-side js
// run by the browser each time your view template is loaded

(function(){
  console.log('hello world :o');
  
  // our default array of servers
  const servers = [
    '1',
    '2',
    '3'
  ];
  
  // define variables that reference elements on our page
  const serversList = document.getElementById('servers');
  const serversForm = document.forms[0];
  const serverInput = serversForm.elements['server'];
  
  // a helper function that creates a list item for a given server
  const appendNewserver = function(server) {
    const newListItem = document.createElement('li');
    newListItem.innerHTML = server;
    serversList.appendChild(newListItem);
  }
  
  // iterate through every server and add it to our page
  servers.forEach( function(server) {
    appendNewserver(server);
  });
  
  // listen for the form to be submitted and add a new server when it is
  serversForm.onsubmit = function(event) {
    // stop our form submission from refreshing the page
    event.preventDefault();
    
    // get server value and add it to the list
    servers.push(serverInput.value);
    appendNewserver(serverInput.value);
  
    // reset form 
    serverInput.value = '';
    serverInput.focus();
  };
  
})()