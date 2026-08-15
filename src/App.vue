<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

const isAuthenticated = ref(false)
const username = ref('')
const router = useRouter()

const checkAuth = () => {
  const token = localStorage.getItem('token')
  isAuthenticated.value = !!token
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      username.value = payload.sub
    } catch (e) {
      username.value = ''
    }
  } else {
    username.value = ''
  }
}

onMounted(() => {
  checkAuth()
  window.addEventListener('auth-change', checkAuth)
})

onUnmounted(() => {
  window.removeEventListener('auth-change', checkAuth)
})

const logout = () => {
  localStorage.removeItem('token')
  checkAuth()
  router.push('/login')
}
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="Buscador Pokedex" />
      <span v-if="isAuthenticated" class="user-greeting">Hola, {{ username }}</span>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/single-search">Buscador Individual</RouterLink>
        <RouterLink to="/list-search">Buscador por Lista</RouterLink>
        <RouterLink to="/compare-search">Buscador Doble</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/favorites">Favoritos</RouterLink>
        <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
        <a href="#" v-if="isAuthenticated" @click.prevent="logout">Logout</a>
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

.user-greeting {
  display: inline-block;
  padding: 0 10px;
  color: var(--color-text);
  font-weight: bold;
  text-transform: capitalize;
}
</style>
