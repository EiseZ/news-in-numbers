<script context="module">
    export async function load({ fetch }) {
        const response = await fetch("http://localhost:4000/create-checkout-session", { method: "POST" });
        if (response.ok) {
            let data = await response.json();
            return {
                status: 302,
                redirect: data.url,
            }
        }
        return {};
    }
</script>
