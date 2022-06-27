<script>
    import { goto } from '$app/navigation';

    import NavBar from "../components/NavBar.svelte"

    let navbarPages = ["home", "articles", "contact"];
    let navbarHrefs = ["home", "articles", "contact"];

    let email;
    let password;

    function login() {
        fetch(`http://localhost:4000/createUser/${email}/${password}`)
            .then(data => {
                if (!data) {
                    // TODO: Invalid login
                }
                goto("/login");
            });
    }
</script>

<NavBar name="News In Numbers" elements={navbarPages} hrefElements={navbarHrefs} />
<div class="m-auto mt-5 p-5 lg:w-2/5">
    <h1 class="text-4xl mt-5 font-bold">Sign Up</h1>
    <form on:submit|preventDefault={login} id="login-form" class="flex flex-col w-1/2">
        <label for="email" class="mt-5 font-bold">Email</label>
        <input type="text" id="email" bind:value={email} class="border"/>
        <label for="password" class="mt-5 font-bold">Password</label>
        <input type="text" id="password" bind:value={password} class="border"/>
    </form>
    <button type="submit" form="login-form" value="Login" class="inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black hover:border-transparent hover:text-white hover:bg-black mt-5">Login</button>
</div>
