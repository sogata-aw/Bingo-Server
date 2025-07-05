let bingoView = {}

function initView() {
  bingoView = {
    bingo : document.querySelector(".grid"),
    cases : document.querySelectorAll(".case"),

    left : document.querySelector(".team1"),

    right : document.querySelector(".team2"),

    actions : document.querySelector(".actions"),

    neutral : document.querySelector(".neutral"),
    neutralState : document.querySelector(".neutralState"),

    shuffle : document.querySelector(".bi-shuffle"),
    lock : document.querySelector(".bi-lock-fill"),
    swap : document.querySelector(".bi-arrow-repeat"),
    erase : document.querySelector(".bi-eraser"),
  };
  return bingoView;
}

export { initView };