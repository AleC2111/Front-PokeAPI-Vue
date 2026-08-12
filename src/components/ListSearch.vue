<script setup>
import { ref, watchEffect } from 'vue'

const list_content = ref(null)
const offset_option = ref(null)
const types_option = ref(null)

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
let nextPage = null
let previousPage = null
let loading = false

function checkTypeExists(typeSearching) {
  let exists = false
  availableTypes.forEach((type) => {
    if (type === typeSearching) {
      exists = true
    }
  })
  return exists
}

function parseData(data) {
  nextPage = data.next
  previousPage = data.previous

  let pokemonFound = []
  data.results.forEach((found) => {
    pokemonFound.push(found.name)
  })

  return pokemonFound
}

function parseTypeData(data, offset, limit) {
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
    let parsed = parseData(data)

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

function searchParameters() {
  try {
    loading = true
    let offset
    let typeSearching 

    if (offset_option.value === null || offset_option.value.value === '') {
      offset = 0
    } else {
      offset = parseInt(offset_option.value.value)
    }

    if (types_option.value === null){
      typeSearching = ''
    } else {
      typeSearching = types_option.value.value
    }

    if (offset < 0 || offset > maxCount || offset === NaN) {
      throw new Error('Goes over the maximum or minimum available')
    }
    if (!checkTypeExists(typeSearching) && typeSearching !== '' && typeSearching !== null) {
      throw new Error("Type doesn't exist")
    }

    if (typeSearching === '' || typeSearching === null) startSimpleSearch(offset)
    else startTypeSearch(typeSearching, offset)
  } catch (error) {
    alert('Error: ' + error.message)
    console.log('Error: ' + error.message)
  } finally {
    loading = false
  }
}

watchEffect(() => {
  searchParameters()
})
</script>

<template>
  <h2>Busqueda por lista</h2>
  <button ref="previous_button" v-if="previousPage != null">Anterior</button>
  <button ref="next_button" v-if="nextPage != null">Siguiente</button>
  <div ref="options" class="text-container" id="general-info">
    <input
      id="offset"
      ref="offset_option"
      type="integer"
      placeholder="Id de inicio de la busqueda"
    />
    <input id="types" ref="types_option" placeholder="Tipo a buscar" />
    <button ref="confirm" @click="searchParameters">Confirmar</button>
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
