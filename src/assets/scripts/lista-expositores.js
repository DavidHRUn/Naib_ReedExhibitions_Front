function cambiarColores(Boton) {
    if ($(event.target).hasClass('btn-outline-dark')) {
        $("#Boton" + Boton).removeClass("btn-outline-dark");
        $("#Boton" + Boton).addClass("btn-outline-warning");
        $("#Boton" + Boton).html("<i class='fas fa-tags'></i> Etiquetado");

    } else if ($(event.target).hasClass('btn-outline-warning')) {
        $("#Boton" + Boton).removeClass("btn-outline-warning");
        $("#Boton" + Boton).addClass("btn-outline-primary");
        $("#Boton" + Boton).html("<i class='fas fa-eye'></i> Detalle");

        $("#Boton" + Boton).unbind('click');
        $("#Boton" + Boton).click(function() {
            window.location.href = "Detalle 2.html";
        });

    }
}