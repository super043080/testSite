<?php

	$name = $_GET['name'];
	$email = $_GET['email'];
	$subject = $_GET['subject'];
	$enquiry = $_GET['enquiry'];


	$to = 'bernardbunlerdwu@gmail.com';
	$subject = 'Contact enquiry';
	$headers = 'From : super043080@yahoo.com';

	mail($to,$subject,$enquiry,$headers)

?>