<script>
  import { userUuid } from "../stores/stores.js";

  const formatUserUuid = () => {
    return $userUuid.split("-")[0];
  };
</script>

<nav class="p-2 mb-4 shadow flex justify-between items-center">
  <a
    href="/"
    class="text-2xl text-gray-700 font-serif m-5 hover:text-violet-700">Home</a
  >
  <span id="userUuid" class="mr-3 text-2xl text-gray-700 font-serif"
    >{formatUserUuid()}</span
  >
</nav>
