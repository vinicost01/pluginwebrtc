<?php
/*
Plugin Name: vinicost-webrtc
*/

function enqueue_receiver_scripts() {
    wp_enqueue_script( 'receiver-script', plugins_url( 'receiver.js', __FILE__ ) );
}

function add_receiver_shortcode() {
    ob_start();
    include( 'receiver.html' );
    return ob_get_clean();
}

add_action( 'wp_enqueue_scripts', 'enqueue_receiver_scripts' );
add_shortcode( 'video_receiver', 'add_receiver_shortcode' );

function enqueue_transmitter_scripts() {
    wp_enqueue_script( 'transmitter-script', plugins_url( 'transmitter.js', __FILE__ ) );
}

function add_transmitter_shortcode() {
    ob_start();
    include( 'transmitter.html' );
    return ob_get_clean();
}

add_action( 'wp_enqueue_scripts', 'enqueue_transmitter_scripts' );
add_shortcode( 'video_transmitter', 'add_transmitter_shortcode' );