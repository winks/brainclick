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
    this.helloWorld = '>+++++++++[<++++++++>-]<.>+++++++[<++++>-]<+.+++++++..+++.>>>++++++++[<++++>-]<.>>>++++++++++[<+++++++++>-]<---.<<<<.+++.------.--------.>>+.';
}
/**
 * @param itemid value of the id attr
 * @return {*}
 */
Brainclick.prototype.getRow = function(itemid) {
    var parts = itemid.split('-');
    return parts[1];
}
/**
 * @param itemid value of the id attr
 * @return {*}
 */
Brainclick.prototype.getCol = function(itemid) {
    var parts = itemid.split('-');
    return parts[2];
}
/**
 * @param row The row in the matrix
 * @return {*}
 */
Brainclick.prototype.chooseSymbol = function(row) {
    var all = ($('#item-'+row+'-0').hasClass('active') ? 'x' : 'o') +
              ($('#item-'+row+'-1').hasClass('active') ? 'x' : 'o') +
              ($('#item-'+row+'-2').hasClass('active') ? 'x' : 'o');
    return this.lookup[all];
};
Brainclick.prototype.toggleActiveListener = function(e) {
    var id  = e.target.id,
        row = this.getRow(id);
    $('#' + id).toggleClass('active');
    this.setSymbol(row, this.chooseSymbol(row));
    this.updatePanel();
};
/**
 * Translate Brainfuck code into oxo representation
 * @param code e.g. ++
 * @return {Array} e.g. ['xxx','xxx']
 */
Brainclick.prototype.loadCodeFromString = function(code) {
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
}
Brainclick.prototype.newRowEmpty = function() {
    $('.matrix').append(this.rowTemplate.replace(/NUM/g, this.nRows++));

    this.updatePanel();
    this.rebind('.item');

    var num = this.nRows - 1;
    this.setSymbol(num, '-');

    return num;
}
Brainclick.prototype.newRowWithValues = function(values) {
    var num = this.newRowEmpty();

    for (var i = 0; i < values.length; i += 1) {
        if (values[i] === 'x') {
            $('#item-' + num + '-' + i).toggleClass('active');
        }
    }
    this.setSymbol(num, this.chooseSymbol(num));
}
Brainclick.prototype.loadExample = function() {
    this.resetAll();
    this.showWide();

    var input = this.loadCodeFromString(this.helloWorld);

    this.setPanelText(this.helloWorld);

    for (var i = 0; i < input.length; i += 1) {
        this.newRowWithValues(input[i]);
    }
}
Brainclick.prototype.resetAll = function () {
    $('.matrix').empty();
    this.setPanelText('');
    this.nRows = 0;
    this.hideWide();
}
Brainclick.prototype.updatePanel = function () {
    var s = '';
    for (var i = 0; i < this.nRows; i += 1) {
        s += this.chooseSymbol(i);
    }
    this.setPanelText(s);
    this.showWide();
}
Brainclick.prototype.rebind = function(selector) {
    $(selector).off('click');
    $(selector).on('click', this.toggleActiveListener.bind(this));
};
Brainclick.prototype.init = function () {
    $('.off .middle').on('click', this.resetAll.bind(this));
    $('.off .right').on('click', this.loadExample.bind(this));
    $('.off .rio').on('click', this.newRowEmpty.bind(this));
    $('#closebutton').on('click', this.hideWide.bind(this));
}
Brainclick.prototype.setSymbol = function(row, symbol) {
    $('.num-' + row + ' .rio').empty().append('<span>' + symbol + '</span>');
}
Brainclick.prototype.hideWide = function () {
    $('#wide').addClass('hidden');
}
Brainclick.prototype.showWide = function () {
    $('#wide').removeClass('hidden');
}
Brainclick.prototype.setPanelText = function (contents) {
    $('#codepanel')[0].innerHTML = contents;
}
var bc = new Brainclick();
bc.init();
