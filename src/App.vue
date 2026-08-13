<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

// Usar useFetch
// Bookmarks de favoritos con FastAPI

//Extra
// Buscar el pokemon al hacer hover en la lista
// Agregar metodo evolutivo a las líneas evolutivas
// Agregar casos para formas alternativas en las líneas evolutivas (megas, regionales, etc)
// Permita nombres sin tener que usar - (Formas regionales, megas, etc)
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="Pokedex usando PokeAPI y Vue" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/single-search">Buscador Individual</RouterLink>
        <RouterLink to="/list-search">Buscador por Lista</RouterLink>
        <RouterLink to="/compare-search">Buscador Doble</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 4px;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
