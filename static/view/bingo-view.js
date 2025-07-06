let bingoView = {}

function initView() {
  bingoView = {
    bingo : document.querySelector(".grid"),
    cases : document.querySelectorAll(".case"),

    left : document.querySelector(".team1"),

    right : document.querySelector(".team2"),

    actions : document.querySelector(".actions"),

    neutral : document.querySelector(".neutral"),

    shuffle : document.querySelector(".bi-shuffle"),
  };
  return bingoView;
}

export { initView };