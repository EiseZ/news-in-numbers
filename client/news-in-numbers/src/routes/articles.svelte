<script>
    import { onMount } from "svelte";
    let articles = [];
    onMount(async () => {
        fetch("http://localhost:4000/articles/3", { credentials: "include" })
        .then(response => {
            console.log(response);
            if (response.status == 401 || response.status == 403) {
                goto("/login");
            } else if (response.status == 402) {
                goto("/pay")
            }
            response.json()
            .then(data => {
                console.log(data);
                articles = data;
            })
        })
        .catch(error => {
            console.log(error);
            return [];
        });
    });

    import NavBar from "../components/NavBar.svelte"
    import Article from "../components/Article.svelte"
    import { goto } from "$app/navigation";

    let navbarPages = ["home", "articles", "contact"];
    let navbarHrefs = ["home", "articles", "contact"];
</script>

<NavBar name="News In Numbers" elements={navbarPages} hrefElements={navbarHrefs} />
{#each articles as article}
    <Article imgSrc={article.imgSrc} title={article.title} content={article.content} />
{/each}
