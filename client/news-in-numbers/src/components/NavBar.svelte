<script>
    export let name;
    export let elements;
    export let hrefElements;
</script>

<nav class="flex items-center justify-between flex-wrap bg-black p-6">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl tracking-tight">{name}</span>
    </div>
  <div class="w-full block flex-grow ml-5 sm:flex sm:items-center sm:w-auto">
        <div class="text-sm sm:flex-grow">
            {#each elements as element, i}
            <a href={hrefElements[i]} class="block text-base font-semibold mt-4 sm:inline-block sm:mt-0 text-gray-300 hover:text-white mr-4">
                {element}
            </a>
            {/each}
        </div>
        <div>
            <a href="/login" class="inline-block text-sm px-4 py-2 leading-none text-white hover:text-grey mt-6 sm:mt-0 pl-0 sm:pl-4">Login</a>
            <a href="/signup" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-black hover:bg-white mt-4 sm:mt-0">Sign Up</a>
        </div>
  </div>
</nav>
