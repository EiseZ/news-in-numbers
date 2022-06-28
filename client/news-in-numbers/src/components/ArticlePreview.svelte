<script>
    export let title;
    export let content;
    export let imgSrc;
    export let tags = [];
    if (!imgSrc) {
        imgSrc = "https://picsum.photos/1000/500";
    }
</script>

<div class="m-auto mt-5 p-5 lg:w-2/5 border-black">
    <img src={imgSrc} class="" alt=""/>
    <div class="flex">
        {#each tags as tag}
            <p class="mr-2 mt-5 ml-0 rounded-full p-1 px-2 bg-black text-white">{tag}</p>
        {/each}
    </div>
    <h1 class="text-4xl mt-5 font-bold">{title}</h1>
    <p class="mt-5">{content}</p>
    <slot></slot>
</div>
