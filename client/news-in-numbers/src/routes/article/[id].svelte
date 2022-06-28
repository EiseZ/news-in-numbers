<script context="module">
    export async function load({ params }) {
        return {
            props: {
                articleId: params.id,
            }
        }
    }
</script>

<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    let article;
    let articleFound = false;
    export let articleId;
    onMount(async () => {
        fetch(`http://localhost:4000/article/${articleId}`, { credentials: "include" })
        .then(response => {
            console.log(response);
            if (response.status == 401 || response.status == 403) {
                goto("/login");
            } else if (response.status == 402) {
                goto("/pay")
            }
            response.json()
            .then(data => {
                if (data) {
                    articleFound = true;
                }
                console.log(data.title);
                article = data;
            })
        }).catch(error => {
            console.log(error);
            return [];
        });
    });

    import NavBar from "../../components/NavBar.svelte"
    import Article from "../../components/Article.svelte"

    let navbarPages = ["home", "articles", "contact"];
    let navbarHrefs = ["home", "articles", "contact"];
</script>

<NavBar name="News In Numbers" elements={navbarPages} hrefElements={navbarHrefs} />
{#if articleFound}
    <Article imgSrc={""} title={article.title} text={article.content} tags={article.tags} />
{:else}
    <!--TODO: Article not found-->
{/if}
