<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
const route = useRoute()
</script>

<template>
 
  <Header />
  <div class="container-fuild">
    <main>
      <div class="container"> 
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </main>

    <Footer />
     
  </div>
</template>

<style>
.app-container { 
  display: flex;
  flex-direction: column;
}

main {
  flex: 1; 
  

}

.navbar {
  border-bottom: 1px solid #eee;
  background-color: #fff;
}

.navbar-brand img {
  max-height: 50px;
  width: auto;
}

.search-box {
  width: 100%; 
}

.search-box .form-control {
  padding-right: 40px;
}

.search-box .form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.search-btn {
  padding: 0 1rem;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  border: none;
  background: none;
  color: #666;
}

.search-btn:hover {
  color: #dc3545;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 991.98px) {
  .search-box {
    margin: 1rem 0;
  }
}

@media (max-width: 767.98px) {
  .navbar-brand img {
    max-height: 40px;
  }

  .search-box .form-control {
    font-size: 0.9rem;
  }

  .nav-link {
    font-size: 0.9rem;
  }
}

.search-icon-btn {
  border-color: #ced4da;
  background-color: #fff;
  color: #dc3545;
}

.search-icon-btn:hover {
  background-color: #dc3545;
  color: #fff;
}

.input-group>.form-control:focus {
  z-index: 3;
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
</style>
