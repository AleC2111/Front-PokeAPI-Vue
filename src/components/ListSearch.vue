<script setup>
import { ref, watch, onMounted } from 'vue'
import { useFetch } from '@vueuse/core'

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

function existsPreviousOrNext(offset, limit) {
  if (offset - limit < 0) previousPage.value = false
  else previousPage.value = true

  if (offset + limit > maxCount) nextPage.value = false
  else nextPage.value = true
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
  let queries = 'offset=' + offset + '&limit=' + limit
  const { data, error, isFetching } = await useFetch(
    'https://pokeapi.co/api/v2/pokemon/?' + queries,
  )
  let parsed = parseData(JSON.parse(data.value), offset, limit)

  changeUI(parsed, offset)
}

async function startTypeSearch(type, offset = 0, limit = 20) {
  const { data, error, isFetching } = await useFetch('https://pokeapi.co/api/v2/type/' + type)
  let parsed = parseTypeData(JSON.parse(data.value), offset, limit)

  changeUI(parsed, offset)
}

function searchParameters(offset = '', typeSearching = '', limit = 20) {
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

    if (typeSearching === '' || typeSearching === null) startSimpleSearch(offset, limit)
    else startTypeSearch(typeSearching, offset, limit)
  } catch (error) {
    alert('Error: Ha ocurrido un error en la busqueda')
    console.log('Error: ' + error.message)
  } finally {
    loading.value = false
  }
}

function searchNextPage() {
  searchParameters(globalOffset + 20, globalType)
}

function searchPreviousPage() {
  searchParameters(globalOffset - 20, globalType)
}

function loadFirstGen() {
  searchParameters(0, '', 151)
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
  <button ref="previous_button" v-if="previousPage === true" @click="searchPreviousPage">
    Anterior
  </button>
  <button ref="next_button" v-if="nextPage === true" @click="searchNextPage">Siguiente</button>
  <div ref="options" class="text-container" id="general-info">
    <input
      id="offset"
      v-model="offset_option"
      type="integer"
      placeholder="Id de inicio de la busqueda"
    />
    <input id="types" v-model="types_option" placeholder="Tipo a buscar" />
    <button ref="first_gen" @click="loadFirstGen">Cargar 1ra Generación</button>
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

@media screen and (max-width: 480px) {
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
