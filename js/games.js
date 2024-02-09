function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
$.getJSON("/games.json", function (data) {
  if (document.readyState === "complete") {
    loadGames(data);
  } else {
    var areGamesReady = setInterval(function () {
      if (document.readyState === "complete") {
        loadGames(data);
        clearInterval(areGamesReady);
      }
    }, 50);
  }
});
function loadGames(data) {
  starredgames = getCookie("starred");
  if (starredgames == "") {
    starredgames = [];
  } else {
    starredgames = JSON.parse(starredgames);
  }
  $("#gamesearch").prop({
    placeholder: "Click here to search through our " + data.length + " games!"
  });
  data.sort(dynamicSort("name"));
  gamelist = data;
  for (var i = 0; i < data.length; i++) {
    var _$element = $("<div>").attr({
      class: "game",
      id: data[i].directory,
      recommended: data[i].recommended
    }).data("recommended", data[i].recommended).append($("<img>").prop({
      src: data[i].directory + "/" + data[i].image,
      alt: data[i].name + " logo"
    })).append($("<h1>").text(data[i].name)).append($("<img>").prop({
      src: "img/star.svg",
      alt: "star",
      class: "star"
    }));
    if (starredgames.includes(data[i].directory)) {
      _$element.find("img.star").attr("id", "starred");
      _$element.find("img.star").attr("src", "img/star-fill.svg");
      var $pinnedelement = _$element.clone();
      $("#pinned").append($pinnedelement);
      if ($("#pinnedmessage")) {
        $("#pinnedmessage").hide();
      }
    }
    $("#games").append(_$element);
  }
  $("#games #message").remove();
  if (search = 1) {
    var txt = $("#gamesearch").val();
    if (txt == "") {
      $("#games .suggest").show();
    } else {
      $("#games .suggest").hide();
    }
    $("#games .game").hide();
    $("#games .game").each(function () {
      if ($(this).text().toUpperCase().indexOf(txt.toUpperCase()) != -1 || $(this).attr("id").toUpperCase().indexOf(txt.toUpperCase()) != -1) {
        $(this).show();
      }
    });
  }

  // starred games
  var starred;
  $(document).on("click", ".game", function (event) {
    if ($(event.target).is("img.star")) {
      if (!$(event.target).attr("id")) {
        $(event.target).prop({
          id: "starred"
        });
        $(event.target).prop({
          src: "img/star-fill.svg"
        });
        starred = Cookies.get("starred");
        if (starred) {
          starred = JSON.parse(starred);
        } else {
          starred = [];
        }
        starred.push($(this).attr("id"));
        Cookies.set("starred", JSON.stringify(starred));
        $element = $(this).clone();
        $("#pinned").append($element);
        $("#pinnedmessage").hide();
        temp = $("#pinned")[0].childNodes;
        pinnedarray = _toConsumableArray(temp);
        pinnedarray.sort(dynamicSort("id"));
        $("#pinned").empty();
        for (var _i = 0; _i < pinnedarray.length; _i++) {
          pinnedarraynodes = pinnedarray[_i].childNodes;
          pinnedarraynodes = _toConsumableArray(pinnedarraynodes);
          var _$element2 = $("<div>").prop({
            class: "game",
            id: pinnedarray[_i].id
          }).append($("<img>").prop({
            src: pinnedarraynodes[0].src,
            alt: pinnedarraynodes[0].alt,
            class: "gameicon"
          })).append($("<h1>").text(pinnedarraynodes[1].innerHTML)).append($("<img>").prop({
            src: "img/star-fill.svg",
            alt: "star",
            class: "star",
            id: "starred"
          }));
          $("#pinned").append(_$element2);
        }
      } else {
        $(event.target).removeAttr("id");
        $(event.target).attr("src", "img/star.svg");
        $thisdiv = "#" + $(this).attr("id");
        $thisdiv = $thisdiv.replace(".", "\\.");
        starred = Cookies.get("starred");
        starred = JSON.parse(starred);
        ourindex = starred.indexOf($(this).attr("id"));
        starred.splice(ourindex, 1);
        Cookies.set("starred", JSON.stringify(starred));
        $("#pinned " + $thisdiv).remove();
        if ($("#pinned").is(":empty")) {
          $("#pinnedmessage").show();
        }
        $($thisdiv + " #starred").attr("src", "img/star.svg");
        $($thisdiv + " #starred").removeAttr("id");
      }
    } else {
      redirectGame($(this).attr("id"));
    }
  });
  $(document).on("click", "#game img .star", function (event) {
    $(this).prop({
      class: "material-symbols-outlined fill"
    });
  });
}
function redirectGame(dir) {
  window.location.href = window.location.origin + "/" + dir + "/index.html";
}
function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    if (sortOrder == -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
}
function selectRandomGame() {
  redirectGame(gamelist[Math.floor(Math.random() * gamelist.length - 1)].directory);
}
var viewrecommended = 0;
function recommendedGames() {
  if (viewrecommended == 0) {
    $("#games .game").hide();
    $("#games .game").each(function () {
      if ($(this).attr("recommended")) {
        $(this).show();
      }
    });
    $("#recommend").text("Click to view all games again!");
    viewrecommended = 1;
  } else {
    $("#games .game").hide();
    $("#games .game").show();
    viewrecommended = 0;
    $("#recommend").text("Click to view recommended games!");
  }
}