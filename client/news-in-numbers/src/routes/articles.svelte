<script>
    import { onMount } from "svelte";
    let articles = [];
    let articleIds = [];
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
                articles = data.articles;
                articleIds = data.articleIds;
            })
        })
        .catch(error => {
            // TODO: Error page
            console.log(error);
            return [];
        });
    });

    import NavBar from "../components/NavBar.svelte"
    import ArticlePreview from "../components/ArticlePreview.svelte"
    import { goto } from "$app/navigation";

    let navbarPages = ["home", "articles", "contact"];
    let navbarHrefs = ["home", "articles", "contact"];
</script>

<NavBar name="News In Numbers" elements={navbarPages} hrefElements={navbarHrefs} />
<div class="m-auto mt-5 p-5 lg:w-2/5">
    <h1 class="text-4xl mt-5 font-bold">Articles</h1>
</div>
{#each articles as article, i}
   <ArticlePreview imgSrc={article.imgSrc} title={article.title} tags={article.tags} id={articleIds[i]}/>
{/each}
