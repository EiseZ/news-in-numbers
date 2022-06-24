<script>
    import NavBar from "../components/NavBar.svelte"
    import Article from "../components/Article.svelte"

    let navbarPages = ["home", "articles", "contact"];
    let navbarHrefs = ["home", "articles", "contact"];
</script>
<NavBar name="News In Numbers" elements={navbarPages} hrefElements={navbarHrefs} />
<Article imgSrc="" title="Titel" text="Dit is een beetje tekst" />
