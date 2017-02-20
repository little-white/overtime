(function() {
    function loadTable(data) {
        var template = document.getElementById('template').innerHTML;
        Mustache.parse(template); 
        var rendered = Mustache.render(template, data);

        return rendered;
    }

    function render(elem, view){
		elem.innerHTML = view;
    }

    window.loadTable = loadTable;
    window.render = render;
})(window);
