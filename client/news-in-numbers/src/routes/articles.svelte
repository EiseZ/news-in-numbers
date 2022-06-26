<script>
    import { onMount } from "svelte";
    import { apiData } from '../store.js';
    let articles = [];
    onMount(async () => {
        fetch("http://localhost:4000/articles/3")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            articles = data;
        }).catch(error => {
            console.log(error);
            return [];
        });
    });

    import NavBar from "../components/NavBar.svelte"
    import Article from "../components/Article.svelte"

    let navbarPages = ["home", "articles", "contact"];
    let navbarHrefs = ["home", "articles", "contact"];
</script>
<NavBar name="News In Numbers" elements={navbarPages} hrefElements={navbarHrefs} />
{#each articles as article}
    <Article imgSrc={article.imgSrc} title={article.title} text={article.content} />
{/each}
