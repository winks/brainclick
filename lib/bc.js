var Brainclick = function() {
    this.lookup = {
        'oxx':'>',
        'xxo':'<',
        'xxx':'+',
        'ooo':'-',
        'oxo':'.',
        'xox':',',
        'xoo':'[',
        'oox':']'
    };
    this.nRows = 0;
    this.rowTemplate = '' +
        '<div class="row numbered num-NUM">' +
        '  <div class="block lo"></div>' +
        '  <div class="block left item" id="item-NUM-0"></div>' +
        '  <div class="block middle item" id="item-NUM-1"></div>' +
        '  <div class="block right item" id="item-NUM-2"></div>' +
        '  <div class="block rio"></div>'+
        '</div>';
    this.helloWorld = '>+++++++++[<++++++++>-]<.>+++++++[<++++>-]<+.+++++++..+++.>>>++++++++[<++++>-]<.>>>++++++++++[<+++++++++>-]<---.<<<<.+++.------.--------.>>+.'
};

/**
 *
 * @param id value of the id attr
 * @return {*}
 */
Brainclick.prototype.getRow = function(id) {
    var parts = id.split('-');
    return parts[1];
}

/**
 * @todo remove getRow code from this function
 * @param id
 * @return {*}
 */
Brainclick.prototype.chooseSymbol = function(id) {
    var row = this.getRow(id);
    var all = ($('#item-'+row+'-0').hasClass('active') ? 'x' : 'o') +
              ($('#item-'+row+'-1').hasClass('active') ? 'x' : 'o') +
              ($('#item-'+row+'-2').hasClass('active') ? 'x' : 'o');
    return this.lookup[all];
};

Brainclick.prototype.toggleActiveState = function(e) {
    var id = e.target.id,
        sym;
    $('#' + id).toggleClass('active');
    sym = this.chooseSymbol(id);
    $('.num-' + this.getRow(id) + ' .rio').empty().append('<span>' + sym + '</span>');
};

Brainclick.prototype.rebind = function(selector) {
    $(selector).off('click');
    $(selector).on('click', this.toggleActiveState.bind(this));
};

/**
 * Translate Brainfuck code into oxo representation
 * @param code e.g. ++
 * @return {Array} e.g. ['xxx','xxx']
 */
Brainclick.prototype.loadCode = function(code) {
    var tmp = {};
    for (var prop in this.lookup) {
        if (this.lookup.hasOwnProperty(prop)) {
            tmp[this.lookup[prop]] = prop;
        }
    }
    var ret = new Array();
    for (var i = 0; i < code.length; i += 1) {
        ret.push(tmp[code[i]]);
    }
    return ret;
};

Brainclick.prototype.newRow = function() {
    $('.main2').append(this.rowTemplate.replace(/NUM/g, this.nRows++));

    this.rebind('.item');

    return this.nRows - 1;
};

Brainclick.prototype.newRowWithValues = function(values) {
    var num = this.newRow();

    for (var i = 0; i < values.length; i += 1) {
        if (values[i] === 'x') {
            $('#item-' + num + '-' + i).toggleClass('active');
        }
    }
    var sym = this.chooseSymbol('#item-' + num + '-' + i);

    $('.num-' + num + ' .rio').empty().append('<span>' + sym + '</span>');
}

Brainclick.prototype.init = function () {
    $('.off .rio').on('click', this.newRow.bind(this));
    $('.off .right').on('click', this.loadExample.bind(this));
}

Brainclick.prototype.loadExample = function() {
    $('#wide').toggleClass('hidden');

    var output = this.loadCode(this.helloWorld);

    $('#wide')[0].innerHTML = this.helloWorld;
    $('.main2').empty();

    for (var i = 0; i < output.length; i += 1) {
        this.newRowWithValues(output[i]);
    }
}

var bc = new Brainclick();
bc.init();


