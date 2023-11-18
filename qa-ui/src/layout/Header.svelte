<script>
  import { userUuid } from "../stores/stores.js";
</script>

<nav class="p-4 mb-4 shadow">
  <a href="/" class="text-2xl text-gray-700 font-serif m-5">Home</a>
  <span class="text-2xl text-gray-700 font-serif">Hello {$userUuid}!</span>
</nav>
