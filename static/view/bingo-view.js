let bingoView = {}

function initView() {
  bingoView = {
    redTeam : document.querySelector('.team1'),
    blueTeam : document.querySelector('.team2'),
    greyTeam : document.querySelector('.neutral'),
  };
  return bingoView;
}

export { initView };