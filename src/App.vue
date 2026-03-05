<template>
  <div class="min-h-screen">
    <header class="bg-white shadow-sm">
      <div class="flex justify-between max-w-7xl mx-auto px-6 py-4">
        <router-link class="text-xl font-bold text-blue-600 hover:text-blue-800" to="/"
          >TaskFlow</router-link
        >
        <a target="_blank" href="https://github.com/demidbes"
          >by <span class="rainbow-text">Demidbes</span></a
        >
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-6 py-8">
      <router-view />
    </main>
  </div>
</template>
