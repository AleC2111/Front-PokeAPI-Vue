<script setup>
import { ref, watch } from 'vue'
import { useFetch } from '@vueuse/core'

const search_bar = ref('')
const name = ref(null)
const pokedex_id = ref(null)
const image = ref(null)
const types = ref(null)
const abilities = ref(null)
const height_weight = ref(null)
const move_list = ref(null)
const shiny_toggle = ref(null)
const stats_graph = ref(null)
const evolution_line = ref(null)

let currentData = { default_image: '/default-img.jpg', shiny_image: '/shiny-img.jpg' }
let loading = ref(false)
let timer = null

function parseData(data) {
  let id = data.id
  let pokemonName = data.name
  let stats = []
  for (let i = 0; i < data.stats.length; i++) {
    stats.push(data.stats[i].base_stat)
  }
  let abilitiesData = []
  for (let i = 0; i < data.abilities.length; i++) {
    abilitiesData.push(data.abilities[i].ability.name)
  }
  let typesData = []
  for (let i = 0; i < data.types.length; i++) {
    typesData.push(data.types[i].type.name)
  }
  let height = data.height / 10
  let weight = data.weight / 10
  let moves = data.moves
  let default_image = data.sprites.front_default
  let shiny_image = data.sprites.front_shiny

  currentData = {
    id: id,
    name: pokemonName,
    base_stats: stats,
    abilities: abilitiesData,
    types: typesData,
    height: height,
    weight: weight,
    moves: moves,
    default_image: default_image,
    shiny_image: shiny_image,
    favorite: false,
  }
  return currentData
}

function changeAbilitiesUI(abilities) {
  let finalText = 'Habilidades: '
  for (let i = 0; i < abilities.length; i++) {
    if (i < abilities.length - 1) {
      finalText = finalText + abilities[i] + ', '
    } else {
      finalText = finalText + abilities[i]
    }
  }
  return finalText
}

function statsGraph(ctx, baseStats) {
  const statNames = ['HP', 'ATK', 'DEF', 'SP. ATK', 'SP. DEF', 'SPD']
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  ctx.clearRect(0, 0, width, height)
  const margin = 5
  const barHeight = height - margin * 2
  const maxValue = 255

  baseStats.forEach((statValue, i) => {
    const barWidth = (statValue / maxValue) * (width - margin * 10)
    const x = width - margin - barWidth
    const y = margin + i * 20 + 10

    if (statValue < 40) ctx.fillStyle = '#c6001a'
    else if (statValue < 60) ctx.fillStyle = '#fd5441'
    else if (statValue < 80) ctx.fillStyle = '#ff752b'
    else if (statValue < 100) ctx.fillStyle = '#fffb2b'
    else if (statValue < 130) ctx.fillStyle = '#64ff2b'
    else if (statValue < 150) ctx.fillStyle = '#02c819'
    else if (statValue < 180) ctx.fillStyle = '#27ff90'
    else ctx.fillStyle = '#27edff'
    ctx.fillRect(x, y, barWidth, barHeight * 0.1)

    ctx.fillStyle = '#010101'
    ctx.fillText(statNames[i] + ': ' + statValue, x - 65, y + 10)
  })
}

function changeMoveList(moveData, movesContainer) {
  movesContainer.innerHTML = ''

  moveData.forEach(async (move, i) => {
    const { data, error, isFetching } = await useFetch(
      'https://pokeapi.co/api/v2/move/' + move.move.name,
    )
    let parsedData = JSON.parse(data.value)

    let moveElementName = document.createElement('div')
    moveElementName.textContent = move.move.name
    movesContainer.appendChild(moveElementName)

    let parsedMove = document.createElement('div')
    parsedMove.textContent =
      'Clase de daño: ' +
      parsedData.damage_class.name +
      ' Poder base: ' +
      parsedData.power +
      ' Precision: ' +
      parsedData.accuracy +
      ' Prioridad: ' +
      parsedData.priority
    movesContainer.appendChild(parsedMove)
    if (parsedData.effect_entries.length !== 0) {
      let moveDescription = document.createElement('div')
      moveDescription.textContent = parsedData.effect_entries[1].effect
      movesContainer.appendChild(moveDescription)
    } else {
      let moveDescription = document.createElement('div')
      moveDescription.textContent = 'No hay descripción'
      movesContainer.appendChild(moveDescription)
    }

    let blank = document.createElement('hr')
    movesContainer.appendChild(blank)
  })
}

function changeShiny() {
  if (!shiny_toggle.value.checked) {
    image.value.src = currentData.default_image
  } else {
    image.value.src = currentData.shiny_image
  }
}

async function parsedEvolution(evolutionChainUrl) {
  const { data, error, isFetching } = await useFetch(evolutionChainUrl)
  let evolutionData = JSON.parse(data.value).chain
  let baseForm = []
  let firstPhaseForm = []
  let lastPhaseForm = []

  baseForm.push(evolutionData['species']['name'])
  if (Object.hasOwn(evolutionData, 'evolves_to')) {
    for (let i = 0; i < evolutionData['evolves_to'].length; i++) {
      firstPhaseForm.push(evolutionData['evolves_to'][i]['species']['name'])
      if (Object.hasOwn(evolutionData['evolves_to'][i], 'evolves_to')) {
        for (let j = 0; j < evolutionData['evolves_to'][i]['evolves_to'].length; j++) {
          lastPhaseForm.push(evolutionData['evolves_to'][i]['evolves_to'][j]['species']['name'])
        }
      }
    }
  }

  let fullLine = [baseForm]
  if (firstPhaseForm.length > 0) fullLine.push(firstPhaseForm)
  if (lastPhaseForm.length > 0) fullLine.push(lastPhaseForm)
  console.log(fullLine)

  return formatEvolutionLine(fullLine)
}

function formatEvolutionLine(fullLine) {
  let formattedLine = ''
  for (let i = 0; i < fullLine.length; i++) {
    let separator = ' -> '
    if (fullLine[i].length > 1) {
      separator = ', '
    }
    for (let j = 0; j < fullLine[i].length; j++) {
      if (i === fullLine.length - 1 && j === fullLine[i].length - 1) {
        formattedLine = formattedLine + fullLine[i][j]
      } else {
        formattedLine = formattedLine + fullLine[i][j] + separator
      }
    }
  }

  console.log(formattedLine)
  return formattedLine
}

async function updateEvolutionLine(pokemonName) {
  const { data, error, isFetching } = await useFetch(
    'https://pokeapi.co/api/v2/pokemon-species/' + pokemonName,
  )
  if (JSON.parse(data.value) === null || JSON.parse(data.value) === undefined || error) {
    return pokemonName
  }
  let evolutionChainUrl = JSON.parse(data.value).evolution_chain.url

  return await parsedEvolution(evolutionChainUrl)
}

async function changeUI(parsed) {
  const canvas = stats_graph.value
  const ctx = canvas.getContext('2d')

  name.value.textContent = parsed.name.toUpperCase()
  pokedex_id.value.textContent = 'Id: ' + parsed.id
  changeShiny()
  types.value.textContent = parsed.types
  abilities.value.textContent = changeAbilitiesUI(parsed.abilities)
  statsGraph(ctx, parsed.base_stats)
  height_weight.value.textContent =
    'Altura: ' + parsed.height + ' m, Peso: ' + parsed.weight + ' kg'
  evolution_line.value.textContent = await updateEvolutionLine(parsed.name)
  changeMoveList(parsed.moves, move_list.value)
}

async function startSearch(pokemonName) {
  try {
    let parsed
    if (localStorage.getItem(pokemonName)) {
      console.log(pokemonName)
      is_favorite.value = true
      currentData = JSON.parse(localStorage.getItem(pokemonName))
      parsed = currentData
    } else {
      const { data, error, isFetching } = await useFetch(
        'https://pokeapi.co/api/v2/pokemon/' + pokemonName,
      )
      parsed = parseData(JSON.parse(data.value))
    }

    changeUI(parsed)
  } catch (error) {
    alert('Error: Ha ocurrido un error en la busqueda')
    console.log('Error: ' + error.message)
  } finally {
    loading.value = false
  }
}

const saved = ref(false)
const removed = ref(false)
const is_favorite = ref(false)
function saveFavoritePokemon() {
  if (pokedex_id.value.textContent !== 'Id') {
    if (currentData['favorite'] === true) {
      currentData['favorite'] = false
      is_favorite.value = false
      saved.value = false
      removed.value = true
      localStorage.removeItem(currentData.name)
    } else {
      currentData['favorite'] = true
      is_favorite.value = true
      saved.value = true
      removed.value = false
      localStorage.setItem(currentData.name, JSON.stringify(currentData))
    }
  } else {
    alert('Busca un Pokemon primero')
  }
}

watch(search_bar, (newValue, _) => {
  loading.value = true
  saved.value = false
  removed.value = false
  is_favorite.value = false
  clearTimeout(timer)
  timer = setTimeout(() => {
    startSearch(newValue.toLowerCase())
  }, 1000)
})
</script>

<template>
  <div>
    <h2>Buscador de datos de Pokemon</h2>
    <div class="text-container">
      <input v-model="search_bar" placeholder="Busca por nombre o id..." value="" />
      <div class="text-container" style="max-width: 30%">
        Shiny:
        <input ref="shiny_toggle" type="checkbox" @click="changeShiny" />
      </div>
      <button ref="save_favorite" @click="saveFavoritePokemon">Guardar en Favoritos</button>
    </div>

    <h3 class="changing-container" v-if="loading">Cargando datos...</h3>
    <h3 class="changing-container" v-if="removed">Eliminado!</h3>
    <h3 class="changing-container" v-if="saved">Guardado!</h3>
    <h3 class="changing-container" style="" v-if="is_favorite">Favorito</h3>
    <div id="general-info">
      <h3 ref="name" style="margin: 4px">Nombre</h3>
      <h4 ref="pokedex_id" style="margin: 4px">Id</h4>
      <img ref="image" alt="Imagen de Pokemon" src="/default-img.jpg" />

      <div id="pokemon-info">
        <div class="text-container" ref="types">Tipos:</div>
        <div class="text-container" ref="abilities">Habilidades:</div>
        <hr />
        <div class="text-container" ref="base-stats">Estadisticas:</div>
        <div class="text-container">
          <canvas ref="stats_graph" width="200" height="150"></canvas>
        </div>
        <div class="text-container" ref="height_weight">Peso y Altura:</div>
      </div>
    </div>
    <div>
      <h5>Línea evolutiva</h5>
      <div ref="evolution_line" class="text-container"></div>
    </div>
    <div>
      <h5>Movimientos</h5>
      <div id="move-list" ref="move_list"></div>
    </div>
  </div>
</template>

<style scoped>
img {
  min-width: 20%;
  min-height: 20%;
  max-width: 20%;
  max-height: 20%;
  margin: 10px;
}
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

.changing-container {
  background-color: #feffd7;
  margin: 4px;
  padding: 8px;
  display: flex;
  border-radius: 5px;
  text-align: center;
  justify-content: center;
  color: rgb(188, 59, 182);
}

.text-container {
  background-color: #feffd7;
  color: black;
  margin: 4px;
  padding: 8px;
  display: flex;
  border-radius: 5px;
}

#move-list {
  background-color: #feffd7;
  color: black;
  margin: 4px;
  padding: 8px;
  border-radius: 5px;
  display: block;
}

@media screen and (max-width: 480px) {
  img {
    min-width: 40%;
    min-height: 40%;
    max-width: 40%;
    max-height: 40%;
    margin: 5px;
  }
  .text-container {
    margin: 4px;
    padding: 8px;
    display: inline-block;
    border-radius: 5px;
    min-width: 20%;
  }
  #general-info {
    align-items: normal;
    justify-content: inherit;
    display: inline-block;
  }
}
</style>
