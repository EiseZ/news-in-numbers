<script>
    export let title;
    export let text;
    export let imgSrc;
</script>

<div class="m-auto lg:w-2/5">
    <img src={imgSrc} class="" alt=""/>
    <h1 class="text-4xl mt-10 font-bold">{title}</h1>
    <p class="mt-5">{text}</p>
</div>
