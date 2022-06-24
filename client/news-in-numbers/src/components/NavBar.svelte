<script>
    export let name;
    export let elements;
    export let hrefElements;
</script>

<nav class="flex items-center justify-between flex-wrap bg-black p-6">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl tracking-tight">{name}</span>
    </div>
  <div class="w-full block flex-grow ml-5 lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
            {#each elements as element, i}
            <a href={hrefElements[i]} class="block text-base font-semibold mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">
                {element}
            </a>
            {/each}
        </div>
        <div>
            <a href="sing-in" class="inline-block text-sm px-4 py-2 leading-none text-white hover:text-black mt-4 lg:mt-0">Sign Up</a>
            <a href="sing-up" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-black hover:bg-white mt-4 lg:mt-0">Sign Up</a>
        </div>
  </div>
</nav>
