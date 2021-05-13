<template>
  <div id="app">
    <router-view />
    <!-- 右下角通知 -->
    <notification/>
  </div>
</template>

<script>
import Notification from "./components/Notification";
export default {
  components: { Notification},
  name: 'App'
}
</script>
