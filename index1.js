var socket = io();
$(document).ready(function(){
	$('#submit_username').click(function(){
			getUserName();
	});

	socket.on('showAllUsers',function(data){
		var htmlUsers = "<ul>All Users</ul>";
		for(var i=0;i<data.length;i++) {
			htmlUsers+= `<li>${data[i]}</li>`
		}
		$('#show_users').html(htmlUsers);
	});

	$('#post_message').click(function(){
		var message = $('#messageToBeSent').val();
		$('#messageToBeSent').val('');
		socket.send(message);
	});

	socket.on('message',function(data){
		$('#message_body').append(`<p>${data.usr} : ${data.msg}</p>`);
	});

	socket.on('disconnect',function(){
			$('#username_container').removeClass('displayNone');
			$('#message_container').addClass('displayNone');
			$('#show_users').addClass('displayNone');
			 $('#create_username').val('');
	});
});
function getUserName(){
	var userName = $('#create_username').val();
	socket.emit('addUser',userName,function(boolean){
		if(boolean) {
			$('#username_container').addClass('displayNone');
			$('#message_container').removeClass('displayNone');
			$('#show_users').removeClass('displayNone');
		} else{
			$('#error_username').removeClass('displayNone');
			setTimeout(function(){
				$('#error_username').addClass('displayNone');
			},2000)
		}
	})
}