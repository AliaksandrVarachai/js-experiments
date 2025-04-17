(async () => {

  console.log(new Response().type); // "default"

// console.log((await fetch("/")).type); // "basic"

console.log((await fetch("https://example.com")).type); // "cors"

// console.log((await fetch("https://crossorigin.example/image", { mode: "no-cors" })).type); // "opaque"

// console.log((await fetch("/surprise-me", { redirect: "manual" })).type); // "opaqueredirect"

})();