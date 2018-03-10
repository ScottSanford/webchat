$(document).ready(function(){
    var socket = io();

    var paramOne = $.deparam(window.location.pathname);
    var newParam = paramOne.split('.');
    
    swap(newParam, 0, 1)
    
    var paramTwo = newParam[0] + '.' + newParam[1]
});

function swap(input, value1, value2) {
    var temp = input[value1];
    input[value1] = input[value2]
    input[value2] = temp
}