<script>
    import { goto } from "$app/navigation";

    export let title;
    export let imgSrc;
    export let tags = [];
    export let id;
    function onArticleClick() {
        goto("/article/" + id);
    }
    if (!imgSrc) {
        imgSrc = "https://picsum.photos/167/125";
    }
</script>

<div on:click={onArticleClick} class="m-auto mt-5 p-2 lg:w-2/5 border-black border-2 rounded-lg flex lg:hover:cursor-pointer lg:hover:animate-[up_0.2s_ease_1_0s_forwards] lg:animate-[down_0.2s_ease_1_0s_forwards]">
    <img src={imgSrc} class="rounded-tl-md rounded-bl-md" alt=""/>
    <div class="ml-10">
        <h1 class="text-3xl mt-5 font-bold line-clamp-2 text-overflow text-ellipsis">{title}</h1>
        <div class="flex">
            {#each tags as tag}
                <p class="mr-2 mt-5 ml-0 rounded-full p-1 px-2 bg-black text-white">{tag}</p>
            {/each}
        </div>
    </div>
    <slot></slot>
</div>
