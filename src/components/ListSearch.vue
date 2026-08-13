<script setup>
import { ref, watch, onMounted } from 'vue'

const list_content = ref(null)
const offset_option = ref('')
const types_option = ref('')

const availableTypes = [
  'fire',
  'water',
  'grass',
  'electric',
  'ground',
  'rock',
  'poison',
  'ghost',
  'fighting',
  'psychic',
  'steel',
  'normal',
  'flying',
  'dragon',
  'ice',
  'dark',
  'fairy',
  'bug',
]
const maxCount = 1351
let nextPage = ref(false)
let previousPage = ref(false)
let loading = ref(false)
let timer = null
let globalOffset = 0
let globalType = ''

function checkTypeExists(typeSearching) {
  let exists = false
  availableTypes.forEach((type) => {
    if (type === typeSearching) {
      exists = true
    }
  })
  return exists
}

function existsPreviousOrNext(offset, limit){
  if (offset-limit < 0) previousPage.value = false;
  else previousPage.value = true;

  if (offset+limit > maxCount) nextPage.value = false;
  else nextPage.value = true;
}

function parseData(data, offset, limit) {
  existsPreviousOrNext(offset, limit)

  let pokemonFound = []
  data.results.forEach((found) => {
    pokemonFound.push(found.name)
  })

  return pokemonFound
}

function parseTypeData(data, offset, limit) {
  existsPreviousOrNext(offset, limit)

  let pokemonFound = []
  let sliced = data.pokemon.slice(offset, limit + offset)
  sliced.forEach((found) => {
    pokemonFound.push(found.pokemon.name)
  })

  return pokemonFound
}

function changeUI(parsed, offset) {
  const pokemonList = list_content.value
  pokemonList.innerHTML = ''

  parsed.forEach((pokemon, i) => {
    let generalInfo = document.createElement('div')
    generalInfo.textContent = offset + i + 1 + ' ' + pokemon
    pokemonList.appendChild(generalInfo)

    let blank = document.createElement('hr')
    pokemonList.appendChild(blank)
  })
}

async function startSimpleSearch(offset = 0, limit = 20) {
  try {
    let queries = 'offset=' + offset + '&limit=' + limit
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?' + queries)
    if (!response.ok) {
      throw new Error('Response status: ' + response.status)
    }
    let data = await response.json()
    let parsed = parseData(data, offset, limit)

    changeUI(parsed, offset)
  } catch (error) {
    alert('Error: ' + error.message)
    console.log('Error: ' + error.message)
  }
}

async function startTypeSearch(type, offset = 0, limit = 20) {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/type/' + type)
    if (!response.ok) {
      throw new Error('Response status: ' + response.status)
    }
    let data = await response.json()
    let parsed = parseTypeData(data, offset, limit)

    changeUI(parsed, offset)
  } catch (error) {
    alert('Error: ' + error.message)
    console.log('Error: ' + error.message)
  }
}

function searchParameters(offset='', typeSearching='') {
  try {
    if (offset === null || offset === '' || offset === NaN) {
      offset = 0
    } else {
      offset = parseInt(offset)
    }

    if (offset < 0 || offset > maxCount || offset === NaN) {
      throw new Error('Goes over the maximum or minimum available')
    }
    if (!checkTypeExists(typeSearching) && typeSearching !== '' && typeSearching !== null) {
      throw new Error("Type doesn't exist")
    }
    globalOffset = offset
    globalType = typeSearching

    if (typeSearching === '' || typeSearching === null) startSimpleSearch(offset)
    else startTypeSearch(typeSearching, offset)
  } catch (error) {
    alert('Error: ' + error.message)
    console.log('Error: ' + error.message)
  } finally {
    loading.value = false
  }
}

function searchNextPage(){
  searchParameters(globalOffset+20, globalType)
}

function searchPreviousPage(){
  searchParameters(globalOffset-20, globalType)
}

onMounted(() => {
  searchParameters()
})

watch([offset_option, types_option], (newValues, _) => {
  loading.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    searchParameters(newValues[0], newValues[1])
  }, 1000)
})
</script>

<template>
  <h2>Busqueda por lista</h2>
  <button ref="previous_button" v-if="previousPage===true" @click="searchPreviousPage">Anterior</button>
  <button ref="next_button" v-if="nextPage===true" @click="searchNextPage">Siguiente</button>
  <div ref="options" class="text-container" id="general-info">
    <input
      id="offset"
      v-model="offset_option"
      type="integer"
      placeholder="Id de inicio de la busqueda"
    />
    <input id="types" v-model="types_option" placeholder="Tipo a buscar" />
  </div>

  <hr />
  <div class="text-container" v-if="loading">Cargando datos...</div>
  <div ref="list_content" class="text-container" style="display: inline-block" v-else></div>
</template>

<style>
input {
  margin: 6px;
  border-radius: 3px;
}
button {
  background-color: #f76998;
  margin: 5px;
  border-radius: 5px;
  transition: scale 0.2s ease-in;
}
button:hover {
  cursor: pointer;
  scale: 1.1;
}

#general-info {
  align-items: center;
  justify-content: center;
  display: flex;
}

.text-container {
  background-color: #feffd7;
  color: black;
  margin: 4px;
  padding: 8px;
  display: flex;
  border-radius: 5px;
  min-width: 50%;
}

@media screen and (max-width: 480px){
    .text-container {
        margin: 4px;
        padding: 8px;
        display: inline-block;
        min-width: 75%;
    }
    #general-info {
        align-items: normal; 
        justify-content: inherit; 
        display: inline-block;
    }
}
</style>
