var cft = '' +
'<div class="row numbered num-NUM">' +
'  <div class="block lo"></div>' +
'  <div class="block left item" id="item-NUM-0"></div>' +
'  <div class="block middle item" id="item-NUM-1"></div>' +
'  <div class="block right item" id="item-NUM-2"></div>' +
'  <div class="block rio"></div>'+
'</div>';

var lookup = {
    'oxx':'>',
    'xxo':'<',
    'xxx':'+',
    'ooo':'-',
    'oxo':'.',
    'xox':',',
    'xoo':'[',
    'oox':']'
};
var nRows = 0;

/**
 *
 * @param id value of the id attr
 * @return {*}
 */
var getRow = function(id) {
    var parts = id.split('-');
    return parts[1];
}

var chooseSymbol = function(id) {
    var row = getRow(id);
    var all = ($('#item-'+row+'-0').hasClass('active') ? 'x' : 'o') +
              ($('#item-'+row+'-1').hasClass('active') ? 'x' : 'o') +
              ($('#item-'+row+'-2').hasClass('active') ? 'x' : 'o');
    return lookup[all];
};

var toggleActiveState = function(e) {
    var elem = e.target;
    $('#'+elem.id).toggleClass('active');
    var sym = chooseSymbol(elem.id);
    $('.num-'+getRow(elem.id)+' .rio').empty().append('<span>'+sym+'</span>');
};

var rebind = function(selector) {
    $(selector).off('click');
    $(selector).on('click', toggleActiveState);
};

/**
 * Translate Brainfuck code into oxo representation
 * @param code e.g. ++
 * @return {Array} e.g. ['xxx','xxx']
 */
var loadCode = function(code) {
    var tmp = {};
    for (var prop in lookup) {
        if (lookup.hasOwnProperty(prop)) {
            tmp[lookup[prop]] = prop;
        }
    }
    var ret = new Array();
    for (var i=0; i<code.length; i++) {
        ret.push(tmp[code[i]]);
    }
    return ret;
};

var newRow = function() {
    $('.main2').append(cft.replace(/NUM/g, nRows++));

    rebind('.item');

    return nRows - 1;
};

var newRowWithValues = function(values) {
    var num = newRow();

    for (var i = 0; i < values.length; i += 1) {
        console.log('#item-' + num + '-' + i);
        if (values[i] === 'x') {
            $('#item-' + num + '-' + i).toggleClass('active');
        }
    }
    var sym = chooseSymbol('#item-' + num + '-' + i);

    $('.num-' + num + ' .rio').empty().append('<span>'+sym+'</span>');
}

$('.off .rio').on('click', newRow);

$('.off .right').on('click', function(e) {
    $('#wide').toggleClass('hidden');

    var input = '+-'

    var output = loadCode(helloWorld);

    $('#wide')[0].innerHTML = helloWorld;
    $('.main2').empty();

    for (var i = 0; i < output.length; i += 1) {
        newRowWithValues(output[i]);
    }


});

$('.off .left').on('click', function(e) {

});

var helloWorld = '>+++++++++[<++++++++>-]<.>+++++++[<++++>-]<+.+++++++..+++.>>>++++++++[<++++>-]<.>>>++++++++++[<+++++++++>-]<---.<<<<.+++.------.--------.>>+.'
