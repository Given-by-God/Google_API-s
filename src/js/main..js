// Скрипт,который ждет пока выполнится поисковый запрос.Поиск выполнился - DOM-дерево обновилось.
//     Затем отправка 10 первых ссылок на сервер,там происходит обработка.После обработки происходит запуск
// API Google SPEED и вывод скорости в конце страницы

//    Ждем полной загрузки DOM - дерева
window.onload = function () {

//  Нажимаем на кнопку (она там единственная)
    $('.gsc-search-button-v2').click(function () {

        //Идет поиск  - поэтому ждем 2 сек(чтобы наверняка).
        //Ну и берем первые 10 ссылок
        setTimeout(function () {
            var array = [];
            var links = document.getElementsByTagName("a");

            //счетчик от 2 - избавляемся от  гугловской рекламы,
            //Плюс еще ссылки повторяются,что бы этого избежать -
            // вбит костыль. И именно поэтому счетчик идет до 29.
            //Но кладет он 10 ссылок.Только количество запросов
            // должно быть не меньше 30,а так все нормально
            for (var i = 2; i <= 29; i += 3) {
                array.push(links[i].href);
            }
            //массив ссылок
            console.log(array);


            //отправка на сервер,на обработку
            $.ajax({
                method: "POST",
                url: "server.php",
                data: {links: JSON.stringify(array)}//превращаем в json
            })
            //Принимаем обработанные данные c сервера
                .done(function (links) {
//                        console.log(links);

                    var obj = JSON.parse(links);
                    console.log(obj);

//                      запуск api Google Speed
//                     -------------------------------------
                    var id;
                    for (var i = 0; i < obj.length; i++) {
                        id = setInterval(runPagespeed(obj[i]), 0);
                    }

                    setTimeout(clearInterval(id), 10000); //удаляем
//                     ---------------------------------
                })

                .fail(function (jqXHR, textStatus) {
                    alert("Request failed: " + textStatus);
                });

        }, 2000);
    });
};

