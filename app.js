
let searchForm = document.getElementById("search-form");
let searchInput = document.getElementById("search-input");
let resultSection = document.querySelector(".result-section");
let randomBtn = document.getElementById("random-select");
let clearSelect = document.getElementById("clear-select");
let statMax = 255;
let totalPokemon = 0;
let loadingDiv = document.getElementById("loading");
let currentPokemonId = 0;
let browseSection = document.querySelector(".browse-section");
let previousBtn = document.getElementById("previous-btn");
let nextBtn = document.getElementById("next-btn");

/*
    function that establishes the total count of Pokemon in the API to be used as a limit throughout the script
*/

async function fetchTotalCount() {
    try {
       
        const response = await fetch("https://pokeapi.co/api/v2/pokemon-species/");
        if (!response.ok) throw new Error('Could not fetch total count');
        
        const data = await response.json();
        
        totalPokemon = data.count; 

        console.log(`Total Pokémon count: ${totalPokemon}`);
    } catch (err) {
        console.error("Failed to load total count, defaulting to 1025:", err);
        totalPokemon = 1025; 
    }
}

fetchTotalCount();



/*
    event listener for capturing and cleaning up serach query. initiates search functions.
*/
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let query = searchInput.value
      .toLowerCase()
      .replace(/[.’'♀♂]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    console.log(`Search: ${query}`);
    searchPokemon(query);
    
});

/* 
    throws error if search query is empty
*/
let searchPokemon = (searchQuery) => {
  if (!searchQuery) {
    console.log("Search query is empty.");
    resultSection.innerHTML = "<h2>Search query is empty.</h2>";
    return;
  }

  getPokeData(searchQuery);
};



/*
    little function to reset search
*/
let resetSearch = () => {
    console.log("clear");
    resultSection.innerHTML = "";
    browseSection.style.display = "none";
    clearSelect.style.display = "none";
    searchInput.value = searchInput.defaultValue;
};

/*
    event listener for the clear button
*/
clearSelect.addEventListener("click", resetSearch);


/*
    clears the pokemon card if search field is cleared
*/

searchInput.addEventListener("input", (e) => {

    if (e.target.value.trim() === "") {
        resetSearch();
  }
});


/*
    random number for random loop up
*/
function generateRandomNumber() {
  // Generates an integer from 1 to total pokemon
  let randomPokeNumber = Math.floor(Math.random() * totalPokemon) + 1;
    console.log(`Random selection: ${randomPokeNumber}`);
     clearSelect.style.display = "inline";
    searchPokemon(randomPokeNumber); 
}


/*
    event listener for random button
*/
randomBtn.addEventListener("click", generateRandomNumber);

/*
    function that fetches the pokemon api data
*/
let getPokeData = async (searchQuery) => {
    let baseUrl1 = `https://pokeapi.co/api/v2/pokemon/${searchQuery}`;
    let baseUrl2 = `https://pokeapi.co/api/v2/pokemon-species/${searchQuery}`;

    loadingDiv.style.display = "block";
    console.log("Loading...");

    try {
        let [response1, response2] = await Promise.all([
             fetch(baseUrl1),
             fetch(baseUrl2),
           ]);

      if (!response1.ok || !response2.ok) {
        throw new Error(
          `Pokémon not found! Error status: ${response1.status} ${response2.status}`,
        );
      }

      let [data, speciesData] = await Promise.all([
        response1.json(),
        response2.json(),
      ]);
        
        currentPokemonId = data.id;
        renderPokemon(data, speciesData);
        
    }
    catch (err) {
      console.log(err);
      resultSection.innerHTML =
        "<h2>Pokémon not found. Check the name or Pokédex number and try again.</h2>";
    }
    finally {
      loadingDiv.style.display = "none";
    }
};


let displayNextPrevious = (data) => {
  browseSection.style.display = "block";

  if (data.id === 1) {
    previousBtn.style.display = "none";
    document.querySelector(".browse-buttons").style.justifyContent = "end";
  } else {
    previousBtn.style.display = "inline";
    document.querySelector(".browse-buttons").style.justifyContent = "space-between";
  }

  if (data.id === totalPokemon - 1) {
    nextBtn.style.display = "none";
    document.querySelector(".browse-buttons").style.justifyContent = "start";
  } else {
      nextBtn.style.display = "inline";
      nextBtn.style.marginLeft = "auto";
    document.querySelector(".browse-buttons").style.justifyContent = "space-between";
  }
};

/*
    function that displays the fetched data
*/
let renderPokemon = (data, speciesData) => {
    console.log(data, speciesData);

    resultSection.innerHTML = ""; 
    clearSelect.style.display = "inline";

    displayNextPrevious(data);

    let div = document.createElement("div");
    div.className = "pokeResult";
    
    // character name
    let name = document.createElement("h2");
    name.textContent = data.name.toUpperCase().replaceAll("-", " ");

    // character ID
    let number = document.createElement("div");
    number.className = "pokeNumber";
    number.textContent = `#${data.id}`;

    // character image
    let image = document.createElement("img");
    image.className = "pokeImage";
    image.src =
      data.sprites.other["official-artwork"].front_default;
    image.alt = `${data.name}`;

    // genus
    let genush3 = document.createElement("h3");
    genush3.textContent = "Genus:";
    genush3.classList.add("leto-black");
    let genusP = document.createElement("p");
    let englishGenus = speciesData.genera.find(
      (entry) => entry.language.name === "en",
    );
    genusP.textContent = englishGenus.genus;

    // description
    let descriptionh3 = document.createElement("h3");
    descriptionh3.textContent = "Description:";
    descriptionh3.classList.add("leto-black");
    let descriptionP = document.createElement("p");
    let englishDesc = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en",
    );
    descriptionP.textContent = englishDesc.flavor_text;


    // types 
    let typesh3 = document.createElement("h3");
    typesh3.textContent = "Types:";
    typesh3.classList.add("leto-black");
    let types = document.createElement("ul");
    types.className = "pokeTypes";
    let pokemonTypes = data.types;
    pokemonTypes.forEach((t) => {
        let typeList = document.createElement("li");
        typeList.textContent = t.type.name.replaceAll("-", " ");
        types.append(typeList);
    });


    // abilities list
    let abilitiesh3 = document.createElement("h3");
    abilitiesh3.textContent = "Abilities:";
    abilitiesh3.classList.add("leto-black");
    let abilities = document.createElement("ul");
    abilities.className = "pokeAbilities";
    let pokemonAbilities = data.abilities;
    pokemonAbilities.forEach((a) => {
      let abilitiesList = document.createElement("li");
      abilitiesList.textContent = a.ability.name.replaceAll("-", " ");
      abilities.append(abilitiesList);
    });   


    // stats list
    let statsh3 = document.createElement("h3");
    statsh3.textContent = "Stats:";
    statsh3.classList.add("leto-black");
    let stats = document.createElement("ul");
    stats.className = "pokeStats";
    let pokemonStats = data.stats;
    pokemonStats.forEach((s) => {
    let statLabel = document.createElement("div");
    statLabel.className = "stat-label-row";
        statLabel.innerHTML = `
        <span class="stat-name">${s.stat.name.replaceAll('-', ' ')}:</span>`; 
        let statsList = document.createElement("li");
        statsList.classList.add("statBar"); 
        statsList.textContent = `${s.base_stat}`;
        let statsWidth = Math.round((s.base_stat/statMax) * 100);
        statsList.style.width = `calc(${statsWidth}% - 12px)`;

      stats.append(statLabel, statsList);
    });  


    div.append(name, number, image, genush3, genusP, descriptionh3, descriptionP, typesh3, types, abilitiesh3, abilities, statsh3, stats);
    
    resultSection.appendChild(div);
  
    
};


/*
    event listeners for next and previous buttons
*/
previousBtn.addEventListener("click", () => {
    console.log(`previous clicked. go to: ${currentPokemonId - 1}`);
        if (currentPokemonId && currentPokemonId > 1) {
            let prevId = currentPokemonId - 1;
            searchPokemon(prevId); 
        } 
});

nextBtn.addEventListener("click", () => {
    console.log(`next clicked. go to: ${currentPokemonId + 1}`);
        if (currentPokemonId && currentPokemonId < totalPokemon) {
            let nextId = currentPokemonId + 1;
        searchPokemon(nextId); 
  }
});


