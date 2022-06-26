<script>
    export let title;
    export let text;
    export let imgSrc;
    export let tags = [];
    if (!imgSrc) {
        imgSrc = "https://picsum.photos/1000/500";
    }
</script>

<div class="m-auto mt-5 p-5 lg:w-2/5">
    <img src={imgSrc} class="" alt=""/>
    <div class="flex">
        {#each tags as tag}
            <p class="m-2 ml-0 rounded-full p-1 px-2 bg-black text-white">{tag}</p>
        {/each}
    </div>
    <h1 class="text-4xl mt-5 font-bold">{title}</h1>
    <p class="mt-5">{text}</p>
</div>
