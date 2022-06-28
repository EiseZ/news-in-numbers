<script context="module">
    export async function load({ fetch, url }) {
        const paymentId = url.searchParams.get("session_id")
        if (!paymentId) {
            return {
                status: 302,
                redirect: "/pay",
            }
        }
        fetch(`http://localhost:4000/payment-successfull/${paymentId}`, {
            method: "POST",
            credentials: "include"
        });

        return {};
    }
</script>

<script>
    import NavBar from "../components/NavBar.svelte"
    import Article from "../components/Article.svelte"
    import { goto } from "$app/navigation";

    let navbarPages = ["home", "articles", "contact"];
    let navbarHrefs = ["home", "articles", "contact"];

    function onButtonSubmit() {
        goto("/articles");
    }
</script>

<NavBar name="News In Numbers" elements={navbarPages} hrefElements={navbarHrefs} />
<Article imgSrc=" " title="Payment Succesfull" content="Congratulations on your subscribtion of News In Numbers">
    <button on:click={onButtonSubmit} class="text-sm px-4 py-2 leading-none border rounded text-black border-black hover:border-transparent hover:text-white hover:bg-black mt-10">Return to your articles</button>
</Article>
