const pokeItem = $(".poke-item");
const pokeInfo = $(".poke-info");
const API = "https://pokeapi.co/api/v2/pokemon/";
const modalBody = $(".modal-body");
let btnNext = $(".btn-next");
let btnPrev = $(".btn-prev");

const getStringForModal = (data) => {
  return `<img src="${
    data.sprites.front_default || data.sprites.front_shiny
  }"/><div>Name: ${data.name}</div><div>Types: ${data.types.reduce(
    (acc, cur) => (acc += cur.type.name + " "),
    ""
  )}</div><div>Weight: ${data.weight}</div>`;
};

$("body").on("click", ".tag-name__button", async (e) => {
  let currentURL = e.target.attributes.name.value;
  console.log(e.target.attributes.name.value);
  const response = await fetch(currentURL);
  const data = await response.json();
  const finishPoke = getStringForModal(data);
  $(".modal-body").html(finishPoke);
});

const renderPokemon = (pokemon) => {
  let { height, name, sprites, types, weight } = pokemon;
  let p = $(".p");
  p.addClass("tag-name__button");
  p.addClass("btn-primary");
  p.attr("data-bs-toggle", "modal");
  p.attr("data-bs-target", "#exampleModal");
};

const getPokemon = async (link) => {
  pokeItem.html("");
  const response = await fetch(link);
  const data = await response.json();
  btnNext.attr("id", data.next);
  btnPrev.attr("id", data.previous);
  data.results.forEach(async (item) => {
    const pokeUrl = await fetch(item.url);
    const pokeLink = await pokeUrl.json();
    pokeItem.append(`
        <p class="p" name="${item.url}">${item.name}</p>
        `);
    if (data.previous) {
      btnNext.attr("disabled", false);
      btnPrev.attr("disabled", false);
    }
    renderPokemon(pokeLink);
  });
};
getPokemon(API);
btnNext.on("click", (e) => {
  if (!e.target.id) {
    btnNext.attr("disabled", true);
    return;
  }
  console.log(e.target.id);
  let url = e.target.id;
  getPokemon(url);
});

btnPrev.on("click", (e) => {
  if (!e.target.id) {
    btnPrev.attr("disabled", true);
    return;
  }

  let url = e.target.id;
  getPokemon(url);
});
