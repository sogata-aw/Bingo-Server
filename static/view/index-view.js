let view = {};

function initView() {
  view = {
    btnLog: document.querySelector(".login"),
    nameInput: document.querySelector("#name"),
  };
  return view;
}

export { initView };

